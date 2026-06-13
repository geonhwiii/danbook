import { useEffect, useState } from 'react';
import { useCompletedMap, useProgressStore } from '@lib/progress';

export interface DashLesson {
  id: string;
  title: string;
}

export interface DashCourse {
  slug: string;
  title: string;
  subtitle: string;
  lessons: DashLesson[];
}

export interface ProgressDashboardProps {
  courses: DashCourse[];
}

/**
 * 랜딩의 진행률 대시보드 — "학습 계속하기" 강의 카드 + "진행 상황" 요약.
 * zustand store를 구독하므로 완료 토글 시 즉시 갱신된다.
 */
export default function ProgressDashboard({ courses }: ProgressDashboardProps) {
  const completed = useCompletedMap();
  const resetAll = useProgressStore((s) => s.resetAll);
  const [animate, setAnimate] = useState(false);
  const done = (id: string) => Boolean(completed[id]);

  // 첫 페인트 후부터 진행률 바 트랜지션 허용(0%→실제값 깜빡임 방지).
  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const barTransition = animate ? 'transition-[width] duration-500' : '';

  const totalLessons = courses.reduce((n, c) => n + c.lessons.length, 0);
  const completedLessons = courses.reduce((n, c) => n + c.lessons.filter((l) => done(l.id)).length, 0);
  const completedCourses = courses.filter((c) => c.lessons.length > 0 && c.lessons.every((l) => done(l.id))).length;
  const overallPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // 진행 중인 강의를 위로, 진행률 내림차순.
  const cards = courses
    .map((c) => {
      const doneCount = c.lessons.filter((l) => done(l.id)).length;
      const pct = c.lessons.length ? Math.round((doneCount / c.lessons.length) * 100) : 0;
      const nextLesson = c.lessons.find((l) => !done(l.id)) ?? c.lessons[0];
      const started = doneCount > 0;
      return { c, doneCount, pct, nextLesson, started };
    })
    .sort((a, b) => Number(b.started) - Number(a.started) || b.pct - a.pct);

  const anyStarted = cards.some((x) => x.started);

  function onReset() {
    if (confirm('학습 진행 기록을 모두 초기화할까요?')) resetAll();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      {/* 학습 계속하기 / 강의 */}
      <div>
        <div className="flex items-end justify-between gap-4">
          <h2 className="display-md">{anyStarted ? '학습 계속하기' : '강의'}</h2>
          <a
            href="/docs"
            className="text-[0.875rem] font-medium text-primary-text transition-colors hover:text-primary-active"
          >
            전체 강의 →
          </a>
        </div>

        <ul className="mt-6 flex flex-col gap-3">
          {cards.map(({ c, doneCount, pct, nextLesson, started }) => {
            const resumeHref = nextLesson ? `/docs/${nextLesson.id}` : `/docs/${c.slug}`;
            const cta = pct >= 100 ? '복습' : started ? '재개' : '시작';
            return (
              <li key={c.slug}>
                <div className="flex flex-col gap-4 rounded-lg border border-hairline bg-surface-card p-5 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <a href={`/docs/${c.slug}`} className="title-sm block transition-colors hover:text-primary-text">
                      {c.title}
                    </a>
                    <p className="caption mt-0.5 text-muted-soft">{c.subtitle}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-strong">
                        <div
                          className={`h-full rounded-full bg-primary ${barTransition}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="caption font-jetbrains shrink-0 tabular-nums text-muted">
                        {pct}% · {doneCount}/{c.lessons.length}
                      </span>
                    </div>
                  </div>
                  <a
                    href={resumeHref}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[0.875rem] font-medium text-canvas transition-opacity hover:opacity-90"
                  >
                    {cta}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 진행 상황 요약 */}
      <aside className="rounded-xl border border-hairline bg-surface-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="title-md">진행 상황</h2>
          <button
            type="button"
            onClick={onReset}
            className="caption text-muted-soft transition-colors hover:text-error"
          >
            초기화
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat value={String(completedLessons)} label="완료한 레슨" />
          <Stat value={String(completedCourses)} label="완료한 강의" />
          <Stat value={String(totalLessons)} label="전체 레슨" />
          <Stat value={`${overallPct}%`} label="전체 진행률" />
        </div>

        <div className="mt-5">
          <div className="caption flex items-center justify-between text-muted">
            <span>전체 진행률</span>
            <span className="font-jetbrains tabular-nums">{overallPct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-strong">
            <div className={`h-full rounded-full bg-primary ${barTransition}`} style={{ width: `${overallPct}%` }} />
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-canvas-soft p-4">
      <p className="display-sm tabular-nums">{value}</p>
      <p className="caption mt-1 text-muted">{label}</p>
    </div>
  );
}
