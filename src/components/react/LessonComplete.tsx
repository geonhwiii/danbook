import { useIsDone, useProgressStore } from '@lib/progress';

export interface LessonCompleteProps {
  /** 레슨 id (예: "networking-for-web-developers/01-ping-to-http") */
  lessonId: string;
}

/**
 * 레슨 하단의 완료 토글. 버튼을 눌러야만 완료/취소된다(자동 완료 없음).
 */
export default function LessonComplete({ lessonId }: LessonCompleteProps) {
  const done = useIsDone(lessonId);
  const toggleDone = useProgressStore((s) => s.toggleDone);

  return (
    <div className="mt-14 flex flex-col items-start gap-4 rounded-lg border border-hairline bg-canvas-soft p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors ${
            done ? 'border-success bg-success text-on-primary' : 'border-hairline-strong text-transparent'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="m20 6-11 11-5-5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <p className="title-sm">{done ? '완료한 레슨입니다 ✓' : '이 레슨을 다 읽으셨나요?'}</p>
          <p className="caption text-muted">완료 표시는 이 브라우저에 저장됩니다.</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => toggleDone(lessonId)}
          className={
            done
              ? 'inline-flex h-10 items-center gap-2 rounded-full border border-hairline-strong px-5 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink'
              : 'inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-[0.875rem] font-medium text-canvas transition-opacity hover:opacity-90'
          }
        >
          {done ? '완료 취소' : '완료로 표시'}
        </button>
      </div>
    </div>
  );
}
