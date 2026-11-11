"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ExamData,
  ExamQuestion,
  ExamResultRecord,
  ExamSection,
  ExamDraftRecord,
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
  clearExamDraft,
  getExamDraft,
  saveExamDraft,
} from "@/lib/examDraft";
import { exportExamResultPdf } from "@/lib/examPdf";
import {
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Flag,
  Pause,
  Save,
  PlayCircle,
  FileDown,
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
  const [isPaused, setIsPaused] = useState(false);
  const [draft, setDraft] = useState<ExamDraftRecord | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const submittingRef = useRef(false);
  const answersRef = useRef(answers);
  const timeLeftRef = useRef(timeLeft);

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

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    setMounted(true);
    setDraft(getExamDraft(exam.id));
  }, [exam.id]);

  const persistDraft = useCallback(
    (
      nextAnswers: Record<number, string>,
      nextTimeLeft: number,
      notify = false
    ) => {
      const saved = saveExamDraft(exam.id, nextAnswers, nextTimeLeft);
      setDraft(saved);
      if (notify) setDraftSavedAt(saved.updatedAt);
      return saved;
    },
    [exam.id]
  );

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

    clearExamDraft(exam.id);
    setDraft(null);
    setDraftSavedAt(null);
    setIsPaused(false);
    setPhase("result");
  }, [answers, allQuestions, exam.id, scorable, timeLeft]);

  useEffect(() => {
    if (phase !== "doing" || isPaused) return;
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
  }, [phase, isPaused]);

  useEffect(() => {
    if (phase === "doing" && timeLeft === 0 && !isPaused) {
      submit();
    }
  }, [phase, timeLeft, isPaused, submit]);

  // Lưu khi đổi đáp án
  useEffect(() => {
    if (phase !== "doing") return;
    persistDraft(answers, timeLeftRef.current);
  }, [phase, answers, persistDraft]);

  // Lưu định kỳ thời gian còn lại (im lặng)
  useEffect(() => {
    if (phase !== "doing") return;
    const id = window.setInterval(() => {
      saveExamDraft(exam.id, answersRef.current, timeLeftRef.current);
    }, 10000);
    return () => window.clearInterval(id);
  }, [phase, exam.id]);

  // Lưu khi rời trang
  useEffect(() => {
    if (phase !== "doing") return;
    const onLeave = () => {
      saveExamDraft(exam.id, answersRef.current, timeLeftRef.current);
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [phase, exam.id]);

  function selectAnswer(qid: number, key: string) {
    if (phase !== "doing" || isPaused) return;
    setAnswers((prev) => ({ ...prev, [qid]: key }));
  }

  function startExam() {
    submittingRef.current = false;
    clearExamDraft(exam.id);
    setDraft(null);
    setDraftSavedAt(null);
    setAnswers({});
    setTimeLeft(EXAM_DURATION_MINUTES * 60);
    setSpent(0);
    setIsPaused(false);
    setPhase("doing");
  }

  function resumeDraft() {
    const d = getExamDraft(exam.id);
    if (!d) return;
    submittingRef.current = false;
    setAnswers(d.answers ?? {});
    setTimeLeft(
      Math.min(
        EXAM_DURATION_MINUTES * 60,
        Math.max(0, d.timeLeftSeconds)
      )
    );
    setSpent(0);
    setIsPaused(false);
    setDraft(d);
    setDraftSavedAt(d.updatedAt);
    setPhase("doing");
  }

  function restart() {
    submittingRef.current = false;
    clearExamDraft(exam.id);
    setDraft(null);
    setDraftSavedAt(null);
    setAnswers({});
    setTimeLeft(EXAM_DURATION_MINUTES * 60);
    setSpent(0);
    setIsPaused(false);
    setPhase("ready");
  }

  function togglePause() {
    if (phase !== "doing") return;
    setIsPaused((p) => {
      const next = !p;
      if (next) {
        persistDraft(answers, timeLeft, true);
      }
      return next;
    });
  }

  function saveDraftManual() {
    if (phase !== "doing") return;
    persistDraft(answers, timeLeft, true);
    window.alert(
      `Đã lưu tạm trên máy này.\nĐã chọn ${answeredCount}/${allQuestions.length} câu · còn ${formatTime(timeLeft)}.`
    );
  }

  if (phase === "ready") {
    const draftAnswered = draft
      ? Object.keys(draft.answers ?? {}).length
      : 0;

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
            <li>· Pause đồng hồ hoặc Lưu tạm (localStorage, không cần DB)</li>
            <li>· Hết giờ tự nộp · chỉ xem đáp án sau khi nộp</li>
          </ul>

          {mounted && draft && (
            <div className="mb-4 rounded-[12px] border border-accent-border bg-accent-soft px-3.5 py-3 text-left">
              <p className="text-[12px] font-semibold text-accent-muted">
                Có bài đang làm dở
              </p>
              <p className="text-[11px] text-[#70665a] dark:text-[#b8aba0] mt-0.5">
                Đã chọn {draftAnswered}/{allQuestions.length} · còn{" "}
                {formatTime(draft.timeLeftSeconds)}
              </p>
            </div>
          )}

          <div className="space-y-2.5">
            {mounted && draft && (
              <button
                type="button"
                onClick={resumeDraft}
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-[14px] bg-accent hover:bg-accent-hover text-white text-sm font-bold active:scale-[0.98] cursor-pointer"
              >
                <PlayCircle size={16} />
                Tiếp tục bài đã lưu
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (draft && !window.confirm("Bắt đầu mới sẽ xoá bài lưu tạm. Tiếp tục?")) {
                  return;
                }
                startExam();
              }}
              className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-[14px] text-sm font-bold active:scale-[0.98] cursor-pointer ${
                draft
                  ? "bg-black/[0.05] dark:bg-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb]"
                  : "bg-accent hover:bg-accent-hover text-white"
              }`}
            >
              <Play size={16} />
              {draft ? "Bắt đầu mới" : "Bắt đầu làm bài"}
            </button>
          </div>
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
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                const name = window.prompt(
                  "Họ tên học sinh (hiện trên phiếu nộp GV):",
                  ""
                );
                if (name === null) return;
                const ok = exportExamResultPdf({
                  exam,
                  answers,
                  score,
                  total: scorable,
                  timeSpentSeconds: spent,
                  studentName: name,
                });
                if (!ok) {
                  window.alert(
                    "Không mở được cửa sổ PDF. Cho phép popup rồi thử lại."
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[12px] text-sm font-bold bg-accent hover:bg-accent-hover text-white cursor-pointer active:scale-[0.98]"
            >
              <FileDown size={14} />
              Xuất PDF nộp GV
            </button>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[12px] text-sm font-semibold bg-black/[0.05] dark:bg-white/[0.08] cursor-pointer"
            >
              <RotateCcw size={14} />
              Làm lại
            </button>
          </div>
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
    <div className="w-full pb-28 animate-fade-in relative">
      {/* Sticky timer */}
      <div className="sticky top-[52px] z-20 -mx-1 mb-4 px-3 py-2.5 rounded-[14px] bg-white/95 dark:bg-[#1a1714]/95 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-md flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <Clock
            size={15}
            className={
              isPaused ? "text-[#8a8074]" : urgent ? "text-red-500" : "text-accent"
            }
          />
          <span
            className={`font-mono text-sm font-bold tabular-nums ${
              isPaused
                ? "text-[#8a8074]"
                : urgent
                  ? "text-red-500"
                  : "text-[#1f1a16] dark:text-[#f5f0eb]"
            }`}
          >
            {formatTime(timeLeft)}
            {isPaused ? " · tạm dừng" : ""}
          </span>
        </div>
        <span className="text-[11px] text-[#8a8074] shrink-0">
          Đã chọn {answeredCount}/{allQuestions.length}
          {draftSavedAt ? " · đã lưu" : ""}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePause}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[12px] font-semibold bg-black/[0.05] dark:bg-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb] cursor-pointer active:scale-95"
            title={isPaused ? "Tiếp tục" : "Tạm dừng đồng hồ"}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
            {isPaused ? "Tiếp tục" : "Pause"}
          </button>
          <button
            type="button"
            onClick={saveDraftManual}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[12px] font-semibold bg-black/[0.05] dark:bg-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb] cursor-pointer active:scale-95"
            title="Lưu tạm trên máy này"
          >
            <Save size={12} />
            Lưu tạm
          </button>
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
      </div>

      {isPaused && (
        <div className="mb-4 rounded-[14px] border border-accent-border bg-accent-soft px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-accent-muted">
              Đồng hồ đang tạm dừng
            </p>
            <p className="text-[12px] text-[#70665a] dark:text-[#b8aba0] mt-0.5">
              Bài đã được lưu tạm. Bấm Tiếp tục để làm tiếp.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPaused(false)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-[12px] bg-accent hover:bg-accent-hover text-white text-[13px] font-bold cursor-pointer active:scale-95 shrink-0"
          >
            <Play size={14} />
            Tiếp tục
          </button>
        </div>
      )}

      <h1 className="font-serif font-bold text-lg mb-4 text-[#1f1a16] dark:text-[#f5f0eb]">
        {exam.test_title}
      </h1>

      <div
        className={`space-y-8 transition-opacity ${
          isPaused ? "opacity-50 pointer-events-none select-none" : ""
        }`}
      >
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

      <div className="mt-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2.5">
        <button
          type="button"
          onClick={saveDraftManual}
          className="w-full py-2.5 rounded-[14px] text-sm font-semibold bg-black/[0.05] dark:bg-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb] cursor-pointer active:scale-[0.98]"
        >
          Lưu tạm &amp; làm tiếp sau
        </button>
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
