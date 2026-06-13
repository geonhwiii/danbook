import { useEffect, useState } from 'react';
import { useCompletedMap } from '@lib/progress';

export interface CourseProgressProps {
  /** 이 강의의 모든 레슨 id (정렬 순서) */
  lessonIds: string[];
}

/**
 * 사이드바 상단 진행률 바.
 * zustand persist가 동기 hydrate되므로 첫 클라이언트 렌더부터 올바른 너비를 갖는다.
 * 첫 페인트 이후에만 width 트랜지션을 켜서 0%→실제값 깜빡임을 막는다.
 */
export default function CourseProgress({ lessonIds }: CourseProgressProps) {
  const completed = useCompletedMap();
  const [animate, setAnimate] = useState(false);
  const doneCount = lessonIds.filter((id) => completed[id]).length;
  const pct = lessonIds.length ? Math.round((doneCount / lessonIds.length) * 100) : 0;

  // 첫 페인트 후부터 트랜지션 허용.
  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Astro로 렌더된 사이드바 목록(이 island 바깥)의 완료 표시를 동기화.
  useEffect(() => {
    document.querySelectorAll<HTMLAnchorElement>('#docs-sidebar a[data-lesson-id]').forEach((a) => {
      const id = a.dataset.lessonId ?? '';
      a.classList.toggle('is-done', Boolean(completed[id]));
    });
  }, [completed]);

  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-strong">
        <div
          className={`h-full rounded-full bg-primary ${animate ? 'transition-[width] duration-500' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="code-type shrink-0 tabular-nums text-muted-soft">{pct}%</span>
    </div>
  );
}
