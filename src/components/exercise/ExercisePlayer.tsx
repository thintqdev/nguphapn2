"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ExerciseData, ExerciseQuestion, ExerciseResultRecord } from "@/lib/exerciseTypes";
import { isAnswerCorrect } from "@/lib/exerciseUtils";
import ExerciseAudioButton from "./ExerciseAudioButton";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Award,
  HelpCircle,
  Eye,
  FileCheck,
  Flag,
  Grid,
  Sparkles,
  ArrowRight,
  X,
  Play,
  Pause,
} from "lucide-react";

interface ExercisePlayerProps {
  exercise: ExerciseData;
}

const DEFAULT_EXAM_MINUTES = 40; // 40 minutes for 50 questions

// ─── QuestionText: renders ___ as underline slots and __★__ as a highlighted star badge ───
function QuestionText({ text }: { text: string }) {
  // Split on ___ and __★__
  const parts = text.split(/(__★__|___)/g);

  return (
    <>
      {parts.map((part, idx) => {
        if (part === "__★__") {
          return (
            <span
              key={idx}
              className="inline-flex items-center justify-center mx-0.5 px-2.5 py-0.5 rounded-[8px] bg-[#df6e53] text-white text-base font-bold tracking-wide shadow-sm align-middle"
            >
              ★
            </span>
          );
        }
        if (part === "___") {
          return (
            <span
              key={idx}
              className="inline-block mx-0.5 w-10 border-b-2 border-[#1f1a16] dark:border-[#f5f0eb] align-bottom"
              aria-hidden="true"
            />
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}

export default function ExercisePlayer({ exercise }: ExercisePlayerProps) {
  const router = useRouter();

  // Mode: "practice" (instant feedback) or "exam" (timed with score at end)
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong" | "correct" | "flagged">("all");
  const [isGridOpen, setIsGridOpen] = useState(false);

  // Timer for exam mode
  const [timeLeft, setTimeLeft] = useState(DEFAULT_EXAM_MINUTES * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved progress for this exercise if available
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(`n2_exercise_progress_${exercise.id}`);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (parsed.selectedAnswers) setSelectedAnswers(parsed.selectedAnswers);
        if (parsed.flagged) setFlagged(parsed.flagged);
      }
    } catch {
      // Ignore
    }
  }, [exercise.id]);

  // Save progress
  useEffect(() => {
    if (!isSubmitted) {
      try {
        localStorage.setItem(
          `n2_exercise_progress_${exercise.id}`,
          JSON.stringify({ selectedAnswers, flagged })
        );
      } catch {
        // Ignore
      }
    }
  }, [selectedAnswers, flagged, isSubmitted, exercise.id]);

  // Exam timer countdown
  useEffect(() => {
    if (mode === "exam" && !isSubmitted && !isTimerPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, isSubmitted, isTimerPaused]);

  // Total questions
  const totalQuestions = exercise.questions.length;
  const currentQ: ExerciseQuestion = exercise.questions[currentIndex] || exercise.questions[0];

  // Number of answered questions
  const answeredCount = Object.keys(selectedAnswers).length;

  // Score calculation
  const scoreStats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    exercise.questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (!userAns) {
        unattempted++;
      } else if (isAnswerCorrect(userAns, q.answer)) {
        correct++;
      } else {
        wrong++;
      }
    });

    const percent = Math.round((correct / totalQuestions) * 100);
    return { correct, wrong, unattempted, percent };
  }, [exercise.questions, selectedAnswers, totalQuestions]);

  // Handle option select
  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;

    // In practice mode, you can change your answer anytime or once selected
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const toggleFlag = (qId: number) => {
    setFlagged((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setIsGridOpen(false);

    // Save result to localStorage
    try {
      const record: ExerciseResultRecord = {
        exerciseId: exercise.id,
        score: scoreStats.correct,
        total: totalQuestions,
        date: new Date().toLocaleDateString("vi-VN"),
        mode,
        timeSpentSeconds: DEFAULT_EXAM_MINUTES * 60 - timeLeft,
      };

      const existingRecords = JSON.parse(
        localStorage.getItem("n2_exercise_records") || "[]"
      );
      existingRecords.unshift(record);
      localStorage.setItem(
        "n2_exercise_records",
        JSON.stringify(existingRecords.slice(0, 30))
      );
    } catch {
      // Ignore
    }
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn làm lại bài thi từ đầu?")) {
      setSelectedAnswers({});
      setFlagged({});
      setIsSubmitted(false);
      setCurrentIndex(0);
      setTimeLeft(DEFAULT_EXAM_MINUTES * 60);
      try {
        localStorage.removeItem(`n2_exercise_progress_${exercise.id}`);
      } catch {
        // Ignore
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if current question is answered correctly
  const currentUserAnswer = selectedAnswers[currentQ?.id];
  const isCurrentCorrect = currentUserAnswer
    ? isAnswerCorrect(currentUserAnswer, currentQ?.answer)
    : false;
  const isCurrentAnswered = !!currentUserAnswer;

  // Filter questions for review
  const filteredQuestionIndices = useMemo(() => {
    if (!isSubmitted || reviewFilter === "all") {
      return exercise.questions.map((_, i) => i);
    }
    return exercise.questions
      .map((q, i) => {
        const ans = selectedAnswers[q.id];
        const isCorr = ans ? isAnswerCorrect(ans, q.answer) : false;
        const isFlag = !!flagged[q.id];

        if (reviewFilter === "wrong" && (!ans || !isCorr)) return i;
        if (reviewFilter === "correct" && isCorr) return i;
        if (reviewFilter === "flagged" && isFlag) return i;
        return null;
      })
      .filter((i): i is number => i !== null);
  }, [exercise.questions, isSubmitted, reviewFilter, selectedAnswers, flagged]);

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-16">
      {/* Top Header Card: Title, Back button & Mode Switcher */}
      <div className="p-4 sm:p-5 rounded-[22px] bg-white/90 dark:bg-[#1a1714]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <Link
            href="/exercise"
            className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-[#70665a] dark:text-[#a09486] hover:text-[#df6e53] dark:hover:text-[#f39882] active:scale-95 transition-all"
            title="Quay lại danh sách bài tập"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#df6e53]/15 text-[#df6e53] dark:text-[#f39882] uppercase tracking-wider">
                JLPT N2
              </span>
              <span className="text-xs text-[#8a8074] dark:text-[#9e9285] font-medium">
                {totalQuestions} Câu hỏi
              </span>
            </div>
            <h1 className="font-serif font-bold text-base sm:text-lg text-[#1f1a16] dark:text-[#f5f0eb] leading-snug line-clamp-1">
              {exercise.title}
            </h1>
          </div>
        </div>

        {/* Right tools: Mode toggle & Question Grid button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Mode toggle */}
          {!isSubmitted && (
            <div className="flex items-center p-1 rounded-[14px] bg-black/[0.04] dark:bg-white/[0.06] select-none text-xs">
              <button
                type="button"
                onClick={() => setMode("practice")}
                className={`px-3 py-1.5 rounded-[10px] font-semibold transition-all cursor-pointer ${
                  mode === "practice"
                    ? "bg-white dark:bg-[#201d19] text-[#df6e53] dark:text-[#f39882] shadow-xs"
                    : "text-[#70665a] dark:text-[#a09486]"
                }`}
              >
                Luyện tập
              </button>
              <button
                type="button"
                onClick={() => setMode("exam")}
                className={`px-3 py-1.5 rounded-[10px] font-semibold transition-all cursor-pointer ${
                  mode === "exam"
                    ? "bg-[#df6e53] text-white shadow-xs"
                    : "text-[#70665a] dark:text-[#a09486]"
                }`}
              >
                Thi thử
              </button>
            </div>
          )}

          {/* Timer if exam mode */}
          {mode === "exam" && !isSubmitted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#df6e53]/10 dark:bg-[#df6e53]/20 text-[#df6e53] dark:text-[#f39882] font-mono font-bold text-xs">
              <Clock size={14} className={timeLeft < 300 ? "animate-pulse text-red-500" : ""} />
              <span>{formatTime(timeLeft)}</span>
              <button
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                title={isTimerPaused ? "Tiếp tục" : "Tạm dừng"}
                className="ml-1 p-0.5 hover:opacity-75 cursor-pointer"
              >
                {isTimerPaused ? <Play size={11} /> : <Pause size={11} />}
              </button>
            </div>
          )}

          {/* Grid Question Map button */}
          <button
            onClick={() => setIsGridOpen(true)}
            className="p-2 rounded-[12px] bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] text-[#70665a] dark:text-[#a09486] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Mở danh sách câu hỏi"
          >
            <Grid size={15} />
            <span className="hidden sm:inline">
              {answeredCount}/{totalQuestions}
            </span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#8a8074] dark:text-[#9e9285] px-1 font-medium">
          <span>
            Câu hỏi{" "}
            <span className="font-bold text-[#1f1a16] dark:text-[#f5f0eb]">
              {currentIndex + 1}
            </span>{" "}
            / {totalQuestions}
          </span>
          <span>
            Đã làm:{" "}
            <span className="font-bold text-[#df6e53] dark:text-[#f39882]">
              {answeredCount}
            </span>{" "}
            ({Math.round((answeredCount / totalQuestions) * 100)}%)
          </span>
        </div>
        <div className="h-1.5 w-full bg-black/[0.05] dark:bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#df6e53] to-[#ef927c] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      {currentQ && (
        <div className="p-5 sm:p-7 rounded-[26px] bg-white dark:bg-[#1a1714] ios-glass border border-black/[0.06] dark:border-white/[0.08] shadow-sm space-y-6">
          {/* Question Category and Tools */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.07]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-[8px] bg-black/[0.05] dark:bg-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb]">
                {currentIndex < 35 ? "Phần 1: Chọn từ thích hợp" : "Phần 2: Sắp xếp câu (Dấu sao ★)"}
              </span>

              {mode === "practice" && isCurrentAnswered && (
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-[8px] flex items-center gap-1 ${
                    isCurrentCorrect
                      ? "bg-[#2e7d58]/15 text-[#2e7d58] dark:text-[#52c28d]"
                      : "bg-[#c0392b]/15 text-[#c0392b] dark:text-[#e74c3c]"
                  }`}
                >
                  {isCurrentCorrect ? (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Chính xác</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={13} />
                      <span>Chưa đúng</span>
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <ExerciseAudioButton text={currentQ.question} size="sm" />

              <button
                onClick={() => toggleFlag(currentQ.id)}
                title={flagged[currentQ.id] ? "Bỏ đánh dấu" : "Đánh dấu câu cần xem lại"}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  flagged[currentQ.id]
                    ? "bg-[#e67e22]/20 text-[#d35400] dark:text-[#f39c12]"
                    : "text-[#8a8074] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                }`}
              >
                <Flag size={15} fill={flagged[currentQ.id] ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-[#1f1a16] dark:text-[#f5f0eb] leading-relaxed tracking-tight">
              <QuestionText text={currentQ.question} />
            </h2>
            {currentIndex >= 35 && (
              <p className="text-xs text-[#8a8074] dark:text-[#9e9285] italic">
                ★ = vị trí cần điền. Chọn đáp án ứng với dấu sao trong 4 ô trống.
              </p>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-2.5 pt-1">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = currentUserAnswer === opt;
              const isCorrectOpt = isAnswerCorrect(opt, currentQ.answer);

              let optionStyle =
                "bg-[#fbf9f6] dark:bg-[#201d19] border-black/[0.06] dark:border-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb] hover:border-black/20 dark:hover:border-white/20";

              if (mode === "practice") {
                if (isCurrentAnswered) {
                  if (isCorrectOpt) {
                    optionStyle =
                      "bg-[#2e7d58]/12 border-[#2e7d58] text-[#2e7d58] dark:text-[#52c28d] font-bold shadow-2xs";
                  } else if (isSelected && !isCorrectOpt) {
                    optionStyle =
                      "bg-[#c0392b]/12 border-[#c0392b] text-[#c0392b] dark:text-[#e74c3c]";
                  } else {
                    optionStyle = "opacity-60 border-transparent bg-black/[0.02] dark:bg-white/[0.02]";
                  }
                }
              } else {
                // Exam mode
                if (isSelected) {
                  optionStyle =
                    "bg-[#df6e53]/15 border-[#df6e53] text-[#df6e53] dark:text-[#f39882] font-bold shadow-2xs";
                }
                if (isSubmitted) {
                  if (isCorrectOpt) {
                    optionStyle =
                      "bg-[#2e7d58]/15 border-[#2e7d58] text-[#2e7d58] dark:text-[#52c28d] font-bold";
                  } else if (isSelected && !isCorrectOpt) {
                    optionStyle =
                      "bg-[#c0392b]/15 border-[#c0392b] text-[#c0392b] dark:text-[#e74c3c]";
                  }
                }
              }

              return (
                <div
                  key={oIdx}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-3.5 sm:p-4 rounded-[18px] border transition-all cursor-pointer flex items-center justify-between gap-3 select-none active:scale-[0.99] ${optionStyle}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center font-bold text-xs shrink-0">
                      {oIdx + 1}
                    </span>
                    <span className="font-serif text-[15px] sm:text-base leading-snug">
                      {opt}
                    </span>
                  </div>

                  {/* Feedback icons in practice or submitted exam */}
                  {(mode === "practice" && isCurrentAnswered) || isSubmitted ? (
                    isCorrectOpt ? (
                      <CheckCircle2 size={18} className="text-[#2e7d58] shrink-0" />
                    ) : isSelected ? (
                      <XCircle size={18} className="text-[#c0392b] shrink-0" />
                    ) : null
                  ) : isSelected ? (
                    <span className="w-3 h-3 rounded-full bg-[#df6e53] shrink-0" />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Explanation Box (Visible in Practice Mode after choosing answer OR in Exam Mode after submission) */}
          {((mode === "practice" && isCurrentAnswered) || isSubmitted) && (
            <div className="p-4 sm:p-5 rounded-[20px] bg-gradient-to-br from-[#f8ede8]/60 via-[#fbf5f2]/60 to-transparent dark:from-[#2a1d18]/60 dark:via-[#1e1714]/60 border border-[#df6e53]/25 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#df6e53] dark:text-[#f39882] flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Đáp án & Giải thích chi tiết</span>
                </span>
                <span className="text-xs font-bold text-[#2e7d58] dark:text-[#52c28d]">
                  {/* For part 2 questions (36-50), show just the key word, strip the sort order note */}
                  Đáp án{currentIndex >= 35 ? " ★" : ""}: {currentQ.answer.replace(/\s*\(Vị trí.*?\)/, "").trim()}
                </span>
              </div>

              {/* Main explanation */}
              <p className="text-xs sm:text-[13px] text-[#3e362f] dark:text-[#ded5cb] leading-relaxed">
                {currentQ.explanation}
              </p>

              {/* Meanings of other options if present */}
              {currentQ.grammar_meanings && Object.keys(currentQ.grammar_meanings).length > 0 && (
                <div className="pt-2.5 border-t border-black/[0.06] dark:border-white/[0.07] space-y-1.5">
                  <div className="text-[11px] font-bold text-[#8a8074] dark:text-[#9e9285] uppercase tracking-wider">
                    Ý nghĩa các phương án khác:
                  </div>
                  <div className="space-y-1 text-xs text-[#5e5349] dark:text-[#b8ada2]">
                    {Object.entries(currentQ.grammar_meanings).map(([key, val]) => (
                      <div key={key} className="flex items-start gap-1.5">
                        <span className="font-bold text-[#df6e53] dark:text-[#f39882] shrink-0">
                          [{key}]
                        </span>
                        <span>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-black/[0.06] dark:border-white/[0.07] gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-[14px] bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-xs font-semibold text-[#1f1a16] dark:text-[#f5f0eb] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Câu trước</span>
            </button>

            {/* In Exam Mode: Submit Test button */}
            {mode === "exam" && !isSubmitted && (
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2.5 rounded-[14px] bg-[#df6e53] hover:bg-[#c95d43] active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-[#df6e53]/25 flex items-center gap-1.5"
              >
                <FileCheck size={16} />
                <span>Nộp bài thi</span>
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={currentIndex === totalQuestions - 1}
              className="px-4 py-2.5 rounded-[14px] bg-[#df6e53] hover:bg-[#c95d43] active:scale-95 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shadow-sm shadow-[#df6e53]/20"
            >
              <span>Câu sau</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Submitted Score Summary Banner */}
      {isSubmitted && (
        <div className="p-6 rounded-[24px] bg-white dark:bg-[#1a1714] ios-glass border border-black/[0.06] dark:border-white/[0.08] shadow-md space-y-5 animate-fade-in text-center">
          <div className="w-16 h-16 rounded-full bg-[#df6e53]/15 text-[#df6e53] dark:text-[#f39882] flex items-center justify-center mx-auto shadow-inner">
            <Award size={36} />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#df6e53] dark:text-[#f39882]">
              Kết quả bài thi thử
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#1f1a16] dark:text-[#f5f0eb] mt-1">
              {scoreStats.correct} / {totalQuestions} câu đúng ({scoreStats.percent}%)
            </h2>
            <p className="text-xs sm:text-sm text-[#70665a] dark:text-[#aaa094] mt-1">
              {scoreStats.percent >= 80
                ? "🎉 Xuất sắc! Bạn đã nắm rất vững ngữ pháp N2."
                : scoreStats.percent >= 60
                ? "👍 Khá tốt! Đạt mức yêu cầu đỗ phần ngữ pháp JLPT N2."
                : "💪 Cần luyện tập thêm các cấu trúc dễ nhầm lẫn."}
            </p>
          </div>

          {/* Score breakdown pills */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="px-3 py-1.5 rounded-xl bg-[#2e7d58]/15 text-[#2e7d58] dark:text-[#52c28d] text-xs font-bold">
              ✓ {scoreStats.correct} Đúng
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#c0392b]/15 text-[#c0392b] dark:text-[#e74c3c] text-xs font-bold">
              ✕ {scoreStats.wrong} Sai
            </div>
            {scoreStats.unattempted > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] text-[#8a8074] text-xs font-bold">
                ⚪ {scoreStats.unattempted} Chưa làm
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-[14px] bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw size={15} />
              <span>Làm lại bài thi</span>
            </button>
            <Link
              href="/exercise"
              className="px-5 py-2.5 rounded-[14px] bg-[#df6e53] hover:bg-[#c95d43] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-[#df6e53]/25 flex items-center gap-1.5"
            >
              <span>Xem danh sách bài tập</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}

      {/* Floating or Modal Question Navigator Grid */}
      {isGridOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#1a1714] rounded-[24px] p-6 shadow-2xl border border-black/10 dark:border-white/10 relative max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.07]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1f1a16] dark:text-[#f5f0eb]">
                  Danh sách câu hỏi ({totalQuestions})
                </h3>
                <p className="text-xs text-[#8a8074]">
                  Chạm vào số câu để chuyển đến nhanh câu đó
                </p>
              </div>

              <button
                onClick={() => setIsGridOpen(false)}
                className="w-8 h-8 rounded-full bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center text-[#8a8074] hover:text-[#1f1a16] dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Filter buttons if submitted */}
            {isSubmitted && (
              <div className="flex items-center gap-1.5 pt-3 select-none overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setReviewFilter("all")}
                  className={`px-3 py-1 rounded-[10px] text-xs font-semibold cursor-pointer ${
                    reviewFilter === "all"
                      ? "bg-[#1f1a16] text-white dark:bg-[#f5f0eb] dark:text-[#1f1a16]"
                      : "bg-black/[0.04] dark:bg-white/[0.06] text-[#70665a]"
                  }`}
                >
                  Tất cả ({totalQuestions})
                </button>
                <button
                  onClick={() => setReviewFilter("wrong")}
                  className={`px-3 py-1 rounded-[10px] text-xs font-semibold cursor-pointer ${
                    reviewFilter === "wrong"
                      ? "bg-[#c0392b] text-white"
                      : "bg-[#c0392b]/15 text-[#c0392b]"
                  }`}
                >
                  Sai ({scoreStats.wrong})
                </button>
                <button
                  onClick={() => setReviewFilter("correct")}
                  className={`px-3 py-1 rounded-[10px] text-xs font-semibold cursor-pointer ${
                    reviewFilter === "correct"
                      ? "bg-[#2e7d58] text-white"
                      : "bg-[#2e7d58]/15 text-[#2e7d58]"
                  }`}
                >
                  Đúng ({scoreStats.correct})
                </button>
              </div>
            )}

            {/* Grid 1 to 50 */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {exercise.questions.map((q, qIndex) => {
                  const userAns = selectedAnswers[q.id];
                  const isCurrent = currentIndex === qIndex;
                  const isFlag = !!flagged[q.id];

                  let btnStyle =
                    "bg-black/[0.04] dark:bg-white/[0.06] text-[#70665a] dark:text-[#a09486] border-transparent";

                  if (isSubmitted || (mode === "practice" && userAns)) {
                    const isCorr = isAnswerCorrect(userAns, q.answer);
                    if (isCorr) {
                      btnStyle =
                        "bg-[#2e7d58] text-white border-[#2e7d58] font-bold shadow-2xs";
                    } else {
                      btnStyle =
                        "bg-[#c0392b] text-white border-[#c0392b] font-bold shadow-2xs";
                    }
                  } else if (userAns) {
                    btnStyle =
                      "bg-[#df6e53] text-white border-[#df6e53] font-bold shadow-2xs";
                  }

                  if (isCurrent) {
                    btnStyle += " ring-2 ring-black dark:ring-white ring-offset-2";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(qIndex);
                        setIsGridOpen(false);
                      }}
                      className={`h-9 rounded-[10px] border text-xs font-bold relative flex items-center justify-center cursor-pointer transition-all active:scale-95 ${btnStyle}`}
                    >
                      <span>{q.id}</span>
                      {isFlag && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#e67e22] ring-1 ring-white dark:ring-[#1a1714]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend footer */}
            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.07] flex flex-wrap items-center justify-between text-[11px] text-[#8a8074]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#df6e53]" />
                <span>Đã làm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/20" />
                <span>Chưa làm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e67e22]" />
                <span>Đã đánh dấu 🚩</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
