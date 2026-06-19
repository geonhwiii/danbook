import { useId, useState } from 'react';

export interface QuizOption {
  /** 보기 텍스트 */
  text: string;
  /** 정답이면 true */
  correct?: boolean;
  /** 이 보기를 골랐을 때(또는 정답일 때) 보여줄 해설 */
  explanation?: string;
}

export interface QuizProps {
  /** 질문 */
  question: string;
  /** 서버에서 Shiki로 하이라이트한 코드 HTML (Quiz.astro가 생성) */
  codeHtml?: string;
  /** 보기 목록 (정답은 correct: true) */
  options: QuizOption[];
}

type Status = 'idle' | 'correct' | 'incorrect';

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m20 6-11 11-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9 9 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 콘텐츠 안에서 사용하는 인터랙티브 퀴즈.
 * 보기를 고르고 Check를 누르면 정답 여부를 표시하고, Reset으로 초기화한다.
 */
export default function Quiz({ question, codeHtml, options }: QuizProps) {
  const groupName = useId();
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const checked = status !== 'idle';
  const correctIndex = options.findIndex((o) => o.correct);

  function check() {
    if (selected === null) return;
    setStatus(options[selected]?.correct ? 'correct' : 'incorrect');
  }

  function reset() {
    setSelected(null);
    setStatus('idle');
  }

  function optionClasses(i: number): string {
    const base = 'flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors';
    if (!checked) {
      return `${base} cursor-pointer ${
        selected === i ? 'border-primary bg-primary/5' : 'border-hairline hover:border-hairline-strong'
      }`;
    }
    if (i === correctIndex) return `${base} border-success bg-success/8`;
    if (i === selected) return `${base} border-error bg-error/8`;
    return `${base} border-hairline opacity-50`;
  }

  // 카드 전체 테두리: 채점 후 정/오답 색.
  const cardBorder = !checked ? 'border-hairline' : status === 'correct' ? 'border-success/60' : 'border-error/60';

  return (
    <div className={`not-prose my-8 rounded-xl border ${cardBorder} bg-canvas-soft p-6`}>
      <p className={`title-md ${codeHtml ? 'mb-4' : 'mb-5'}`}>{question}</p>

      {codeHtml && (
        <div
          className="quiz-code mb-5 overflow-x-auto rounded-lg border border-hairline"
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        />
      )}

      <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={question}>
        {options.map((opt, i) => {
          const id = `${groupName}-${i}`;
          const isCorrect = i === correctIndex;
          const isWrongPick = checked && i === selected && !isCorrect;
          // 해설은: 정답 보기(맞췄을 때) 또는 내가 고른 틀린 보기에만 노출.
          const showExplanation = checked && opt.explanation && ((isCorrect && status === 'correct') || isWrongPick);

          return (
            <label key={id} htmlFor={id} className={optionClasses(i)}>
              <input
                id={id}
                type="radio"
                name={groupName}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                checked={selected === i}
                disabled={checked}
                onChange={() => setSelected(i)}
              />
              <span className="min-w-0 flex-1">
                <span className="body-sm block leading-relaxed text-body">{opt.text}</span>
                {showExplanation && (
                  <span className={`caption mt-2 block leading-relaxed ${isCorrect ? 'text-success' : 'text-error'}`}>
                    {opt.explanation}
                  </span>
                )}
              </span>
              {checked && isCorrect && (
                <span className="mt-0.5 shrink-0 self-start text-success">
                  <CheckIcon />
                </span>
              )}
              {isWrongPick && (
                <span className="mt-0.5 shrink-0 self-start text-error">
                  <CrossIcon />
                </span>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={check}
          disabled={selected === null || checked}
          className="inline-flex h-9 items-center rounded-md border border-hairline-strong px-4 text-[0.8125rem] font-medium text-body transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-hairline-strong disabled:hover:text-body"
        >
          Check
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-9 items-center rounded-md border border-hairline-strong px-4 text-[0.8125rem] font-medium text-body transition-colors hover:border-ink hover:text-ink"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
