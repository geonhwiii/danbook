/**
 * 학습 진행 상태 — zustand persist(localStorage) 기반.
 * 저장 형태: { completed: { [lessonId]: ISO 완료시각 } }
 *   lessonId 예: "networking-for-web-developers/01-ping-to-http"
 *
 * - React 컴포넌트: useProgress(selector) 훅 사용
 * - 비 React(astro 스크립트): isDone/setDone/toggleDone/... 함수 사용
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const KEY = 'danbook-progress-v1';

interface ProgressState {
  /** lessonId → 완료시각(ISO) */
  completed: Record<string, string>;
  setDone: (lessonId: string, done: boolean) => void;
  toggleDone: (lessonId: string) => boolean;
  resetAll: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      setDone: (lessonId, done) =>
        set((s) => {
          const completed = { ...s.completed };
          if (done) {
            if (!completed[lessonId]) completed[lessonId] = new Date().toISOString();
          } else {
            delete completed[lessonId];
          }
          return { completed };
        }),
      toggleDone: (lessonId) => {
        const next = !get().completed[lessonId];
        get().setDone(lessonId, next);
        return next;
      },
      resetAll: () => set({ completed: {} }),
    }),
    {
      name: KEY,
      storage: createJSONStorage(() => localStorage),
      // 마이그레이션 여지를 위한 버전.
      version: 1,
    },
  ),
);

// 다른 탭에서 진행 상태가 바뀌면 이 탭의 store도 다시 읽어온다.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) useProgressStore.persist.rehydrate();
  });
}

/* ──────────────────────────────────────────────────────────────
   React 훅
   ────────────────────────────────────────────────────────────── */

/** 완료 맵을 구독하는 훅. */
export function useCompletedMap(): Record<string, string> {
  return useProgressStore((s) => s.completed);
}

/** 특정 레슨 완료 여부를 구독하는 훅. */
export function useIsDone(lessonId: string): boolean {
  return useProgressStore((s) => Boolean(s.completed[lessonId]));
}

/* ──────────────────────────────────────────────────────────────
   비 React(astro 인라인 스크립트)용 명령형 API
   ────────────────────────────────────────────────────────────── */

export function isDone(lessonId: string): boolean {
  return Boolean(useProgressStore.getState().completed[lessonId]);
}

export function setDone(lessonId: string, done: boolean) {
  useProgressStore.getState().setDone(lessonId, done);
}

export function toggleDone(lessonId: string): boolean {
  return useProgressStore.getState().toggleDone(lessonId);
}

/** 완료된 모든 레슨 id. */
export function completedIds(): string[] {
  return Object.keys(useProgressStore.getState().completed);
}

/** lessonId → 완료시각(ISO) 맵. */
export function completedMap(): Record<string, string> {
  return useProgressStore.getState().completed;
}

export function resetAll() {
  useProgressStore.getState().resetAll();
}

/** 진행 상태 변경 구독 (persist 의 cross-tab 동기화 포함). */
export function onProgressChange(handler: () => void): () => void {
  return useProgressStore.subscribe(handler);
}
