"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ExamData,
  ExamQuestion,
  ExamResultRecord,
  ExamSection,
} from "@/lib/examTypes";
import {
  EXAM_DURATION_MINUTES,
  EXAM_RESULT_KEY,
} from "@/lib/examTypes";
import {
  countScorable,
  isExamAnswerCorrect,
  optionKey,
} from "@/lib/examUtils";
import {
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Flag,
} from "lucide-react";

interface ExamPlayerProps {
  exam: ExamData;
}

function formatTime(sec: number): string {
  const m = Math.floor(Math.max(0, sec) / 60);
  const s = Math.max(0, sec) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function HighlightQuestion({
  text,
  target,
}: {
  text: string;
  target?: string;
}) {
  if (!target || !text.includes(target)) {
    return <>{text}</>;
  }
  const parts = text.split(target);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="underline decoration-2 underline-offset-2 decoration-accent">
              {target}
            </span>
          )}
        </span>
      ))}
    </>
  );
}

function ReadingPassage({ text }: { text: string }) {
  const parts = text.split(/(\[\d+\])/g);
  return (
    <div className="text-[14px] leading-[1.9] text-[#1f1a16] dark:text-[#f5f0eb] whitespace-pre-wrap">
      {parts.map((p, i) => {
        const m = p.match(/^\[(\d+)\]$/);
        if (m) {
          return (
            <span
              key={i}
              className="inline-flex items-center justify-center mx-0.5 min-w-[1.6rem] px-1 rounded bg-accent/15 text-accent-muted text-[12px] font-bold align-baseline"
            >
              {m[1]}
            </span>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </div>
  );
}

function StarTemplate({ template }: { template: string }) {
  const parts = template.split(/(＿＿|★)/g);
  return (
    <p className="text-[15px] leading-relaxed text-[#1f1a16] dark:text-[#f5f0eb]">
      {parts.map((p, i) => {
        if (p === "★") {
          return (
            <span
              key={i}
              className="inline-flex mx-0.5 px-1.5 py-0.5 rounded bg-accent text-white text-sm font-bold align-middle"
            >
              ★
            </span>
          );
        }
        if (p === "＿＿") {
          return (
            <span
              key={i}
              className="inline-block mx-0.5 w-8 border-b border-[#1f1a16] dark:border-[#f5f0eb] align-bottom"
            />
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </p>
  );
}

export default function ExamPlayer({ exam }: ExamPlayerProps) {
  const [phase, setPhase] = useState<"ready" | "doing" | "result">("ready");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60);
  const [spent, setSpent] = useState(0);
  const submittingRef = useRef(false);

  const scorable = useMemo(() => countScorable(exam), [exam]);
  const allQuestions = useMemo(
    () => exam.sections.flatMap((s) => s.questions),
    [exam]
  );
  const answeredCount = Object.keys(answers).length;

  const score = useMemo(() => {
    let correct = 0;
    for (const q of allQuestions) {
      if (isExamAnswerCorrect(q, answers[q.id]) === true) correct++;
    }
    return correct;
  }, [allQuestions, answers]);

  const submit = useCallback(() => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    const used = EXAM_DURATION_MINUTES * 60 - timeLeft;
    setSpent(used);

    let correct = 0;
    for (const q of allQuestions) {
      if (isExamAnswerCorrect(q, answers[q.id]) === true) correct++;
    }

    try {
      const raw = localStorage.getItem(EXAM_RESULT_KEY);
      const list: ExamResultRecord[] = raw ? JSON.parse(raw) : [];
      list.push({
        examId: exam.id,
        score: correct,
        total: scorable,
        timeSpentSeconds: used,
        date: new Date().toISOString(),
      });
      localStorage.setItem(EXAM_RESULT_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }

    setPhase("result");
  }, [answers, allQuestions, exam.id, scorable, timeLeft]);

  useEffect(() => {
    if (phase !== "doing") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "doing" && timeLeft === 0) {
      submit();
    }
  }, [phase, timeLeft, submit]);

  function selectAnswer(qid: number, key: string) {
    if (phase !== "doing") return;
    setAnswers((prev) => ({ ...prev, [qid]: key }));
  }

  function startExam() {
    submittingRef.current = false;
    setAnswers({});
    setTimeLeft(EXAM_DURATION_MINUTES * 60);
    setSpent(0);
    setPhase("doing");
  }

  function restart() {
    submittingRef.current = false;
    setAnswers({});
    setTimeLeft(EXAM_DURATION_MINUTES * 60);
    setSpent(0);
    setPhase("ready");
  }

  if (phase === "ready") {
    return (
      <div className="w-full space-y-5 animate-fade-in py-6">
        <div className="rounded-[20px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90 p-6 text-center">
          <p className="text-[11px] font-bold text-accent mb-2">
            JLPT N2 · 模擬試験
          </p>
          <h1 className="font-serif font-bold text-2xl text-[#1f1a16] dark:text-[#f5f0eb] mb-2">
            {exam.test_title}
          </h1>
          <p className="text-sm text-[#70665a] dark:text-[#b8aba0] mb-5">
            {exam.total_questions} câu · {exam.sections.length} phần ·{" "}
            {EXAM_DURATION_MINUTES} phút
          </p>
          <ul className="text-left text-xs text-[#5e554c] dark:text-[#b8aba0] space-y-1.5 mb-6 bg-black/[0.03] dark:bg-white/[0.04] rounded-[12px] p-3.5">
            <li>· Làm từ trên xuống theo từng Mondai</li>
            <li>· Có đồng hồ; hết giờ tự nộp</li>
            <li>· Chỉ xem đáp án sau khi nộp bài</li>
          </ul>
          <button
            type="button"
            onClick={startExam}
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-[14px] bg-accent hover:bg-accent-hover text-white text-sm font-bold active:scale-[0.98] cursor-pointer"
          >
            <Play size={16} />
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const pct = scorable > 0 ? Math.round((score / scorable) * 100) : 0;
    return (
      <div className="w-full space-y-5 animate-fade-in pb-16">
        <div className="rounded-[20px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90 p-6 text-center">
          <h2 className="font-serif font-bold text-xl mb-1">Kết quả</h2>
          <p className="font-serif font-bold text-4xl text-accent my-2">
            {score}/{scorable}
          </p>
          <p className="text-sm text-[#70665a] dark:text-[#b8aba0]">
            {pct}% · Thời gian {formatTime(spent)}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[12px] text-sm font-semibold bg-black/[0.05] dark:bg-white/[0.08] cursor-pointer"
          >
            <RotateCcw size={14} />
            Làm lại
          </button>
        </div>

        <div className="space-y-6">
          {exam.sections.map((section, si) => (
            <SectionBlock
              key={section.section_id}
              section={section}
              sectionIndex={si}
              answers={answers}
              review
            />
          ))}
        </div>
      </div>
    );
  }

  // doing
  const urgent = timeLeft <= 5 * 60;

  return (
    <div className="w-full pb-28 animate-fade-in">
      {/* Sticky timer */}
      <div className="sticky top-[52px] z-20 -mx-1 mb-4 px-3 py-2.5 rounded-[14px] bg-white/95 dark:bg-[#1a1714]/95 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Clock
            size={15}
            className={urgent ? "text-red-500" : "text-accent"}
          />
          <span
            className={`font-mono text-sm font-bold tabular-nums ${
              urgent ? "text-red-500" : "text-[#1f1a16] dark:text-[#f5f0eb]"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
        <span className="text-[11px] text-[#8a8074] shrink-0">
          Đã chọn {answeredCount}/{allQuestions.length}
        </span>
        <button
          type="button"
          onClick={() => {
            const miss = allQuestions.length - answeredCount;
            const msg =
              miss > 0
                ? `Còn ${miss} câu chưa chọn. Nộp bài?`
                : "Nộp bài và xem kết quả?";
            if (window.confirm(msg)) submit();
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[10px] text-[12px] font-bold bg-accent text-white cursor-pointer active:scale-95"
        >
          <Flag size={12} />
          Nộp bài
        </button>
      </div>

      <h1 className="font-serif font-bold text-lg mb-4 text-[#1f1a16] dark:text-[#f5f0eb]">
        {exam.test_title}
      </h1>

      <div className="space-y-8">
        {exam.sections.map((section, si) => (
          <SectionBlock
            key={section.section_id}
            section={section}
            sectionIndex={si}
            answers={answers}
            onSelect={selectAnswer}
          />
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
        <button
          type="button"
          onClick={() => {
            const miss = allQuestions.length - answeredCount;
            const msg =
              miss > 0
                ? `Còn ${miss} câu chưa chọn. Nộp bài?`
                : "Nộp bài và xem kết quả?";
            if (window.confirm(msg)) submit();
          }}
          className="w-full py-3 rounded-[14px] text-sm font-bold bg-accent hover:bg-accent-hover text-white cursor-pointer active:scale-[0.98]"
        >
          Nộp bài
        </button>
      </div>
    </div>
  );
}

function SectionBlock({
  section,
  sectionIndex,
  answers,
  onSelect,
  review = false,
}: {
  section: ExamSection;
  sectionIndex: number;
  answers: Record<number, string>;
  onSelect?: (qid: number, key: string) => void;
  review?: boolean;
}) {
  return (
    <section className="space-y-4">
      <div className="border-b border-black/[0.08] dark:border-white/[0.1] pb-2">
        <p className="text-[11px] font-bold text-accent mb-1">
          問題 {sectionIndex + 1}
        </p>
        <p className="text-[13px] text-[#5e554c] dark:text-[#b8aba0] leading-relaxed">
          {section.instruction}
        </p>
      </div>

      {section.reading_text && (
        <div className="rounded-[14px] bg-black/[0.03] dark:bg-white/[0.04] p-3.5 sm:p-4">
          <ReadingPassage text={section.reading_text} />
        </div>
      )}

      <div className="space-y-5">
        {section.questions.map((q) => (
          <QuestionBlock
            key={q.id}
            question={q}
            selected={answers[q.id]}
            onSelect={onSelect}
            review={review}
          />
        ))}
      </div>
    </section>
  );
}

function QuestionBlock({
  question,
  selected,
  onSelect,
  review,
}: {
  question: ExamQuestion;
  selected?: string;
  onSelect?: (qid: number, key: string) => void;
  review: boolean;
}) {
  const verdict = review ? isExamAnswerCorrect(question, selected) : null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-start gap-2">
        <span className="text-[13px] font-bold text-[#8a8074] shrink-0 pt-0.5">
          {question.id}.
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          {question.target_word && !question.question && (
            <p className="text-[15px] font-serif font-bold text-[#1f1a16] dark:text-[#f5f0eb]">
              {question.target_word}
            </p>
          )}
          {question.question && (
            <p className="text-[15px] leading-relaxed text-[#1f1a16] dark:text-[#f5f0eb]">
              <HighlightQuestion
                text={question.question}
                target={question.target_word}
              />
            </p>
          )}
          {question.template && <StarTemplate template={question.template} />}
        </div>
        {review && verdict !== null && (
          <span className="shrink-0 mt-0.5">
            {verdict ? (
              <CheckCircle2 size={16} className="text-[#2e7d58]" />
            ) : (
              <XCircle size={16} className="text-[#c0392b]" />
            )}
          </span>
        )}
      </div>

      <div className="pl-5 space-y-1.5">
        {question.options.map((opt, i) => {
          const key = optionKey(opt, i);
          const isSelected = selected === key;
          const isCorrect = review && question.answer === key;

          let style =
            "border-black/[0.08] dark:border-white/[0.1] hover:border-accent-border";
          if (review) {
            if (isCorrect) {
              style =
                "border-[#2e7d58]/50 bg-[#2e7d58]/10 text-[#2e7d58] dark:text-[#52c28d]";
            } else if (isSelected) {
              style = "border-[#c0392b]/40 bg-[#c0392b]/08 text-[#c0392b]";
            } else {
              style = "border-transparent opacity-50";
            }
          } else if (isSelected) {
            style =
              "border-accent bg-accent/10 text-[#1f1a16] dark:text-[#f5f0eb]";
          }

          return (
            <button
              key={key}
              type="button"
              disabled={review}
              onClick={() => onSelect?.(question.id, key)}
              className={`w-full text-left px-3 py-2 rounded-[10px] border text-[13px] leading-snug transition-all cursor-pointer disabled:cursor-default ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {review && question.answer && !selected && (
        <p className="pl-5 text-[11px] text-[#8a8074]">Chưa chọn</p>
      )}
    </div>
  );
}
