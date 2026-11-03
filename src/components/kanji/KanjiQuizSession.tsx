"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { KanjiItem, KanjiQuizQuestion } from "@/lib/kanjiTypes";
import { buildKanjiQuizSession } from "@/lib/kanjiQuiz";
import { X, CheckCircle2, XCircle, Sparkles } from "lucide-react";

interface KanjiQuizSessionProps {
  items: KanjiItem[];
  onClose: () => void;
  onFinished: (score: number, total: number) => void;
}

export default function KanjiQuizSession({
  items,
  onClose,
  onFinished,
}: KanjiQuizSessionProps) {
  const [mounted, setMounted] = useState(false);
  const [questions] = useState<KanjiQuizQuestion[]>(() =>
    buildKanjiQuizSession(items, Math.min(15, items.length))
  );
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[qi];
  const revealed = selected !== null;
  const isCorrect = selected === q?.answer;
  const correctCount = results.filter(Boolean).length;

  const progressPct = useMemo(() => {
    if (questions.length === 0) return 0;
    const step = done ? questions.length : qi + (revealed ? 1 : 0);
    return Math.round((step / questions.length) * 100);
  }, [qi, done, questions.length, revealed]);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  function handleSelect(option: string) {
    if (revealed || !q) return;
    setSelected(option);
  }

  function handleNext() {
    if (!q || selected === null) return;
    const ok = selected === q.answer;
    const nextResults = [...results, ok];
    setResults(nextResults);

    if (qi >= questions.length - 1) {
      setDone(true);
      onFinished(nextResults.filter(Boolean).length, questions.length);
      return;
    }

    setSelected(null);
    setQi((i) => i + 1);
  }

  if (!mounted) return null;

  const shell =
    "fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/45 backdrop-blur-[2px]";
  const card =
    "w-[min(100%,340px)] bg-white dark:bg-[#1a1714] rounded-[20px] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] animate-fade-in";

  let content: React.ReactNode;

  if (questions.length === 0) {
    content = (
      <div className={shell} onClick={onClose}>
        <div
          className={`${card} p-5 text-center`}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm mb-3">Không đủ dữ liệu để tạo quiz.</p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[12px] bg-[#df6e53] text-white text-[13px] font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  } else if (done) {
    const pct = Math.round((correctCount / questions.length) * 100);
    content = (
      <div className={shell} onClick={onClose}>
        <div
          className={`${card} p-5 text-center`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-10 mx-auto mb-2.5 rounded-full bg-[#df6e53]/12 text-[#df6e53] flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <h2 className="font-serif font-bold text-lg mb-0.5 text-[#1f1a16] dark:text-[#f5f0eb]">
            {pct >= 80 ? "Xuất sắc!" : pct >= 50 ? "Tốt lắm!" : "Cố lên nhé!"}
          </h2>
          <p className="text-xs text-[#70665a] dark:text-[#b8aba0]">
            Đúng {correctCount}/{questions.length}
          </p>
          <p className="font-serif font-bold text-2xl text-[#df6e53] dark:text-[#f39882] my-3">
            {pct}%
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-[12px] text-[13px] font-bold bg-[#df6e53] text-white cursor-pointer active:scale-[0.98]"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  } else {
    const isKanjiOptions = q.kind !== "kanji_to_hanviet";
    content = (
      <div className={`${shell} select-none`} onClick={onClose}>
        <div
          className={`${card} max-h-[78vh] flex flex-col overflow-hidden relative`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.08] text-[#8a8074] active:scale-90 cursor-pointer"
            aria-label="Đóng"
          >
            <X size={14} />
          </button>

          <div className="px-3.5 pt-3.5 pb-2 pr-10 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#df6e53] dark:text-[#f39882] flex items-center gap-1">
                <Sparkles size={12} />
                Quiz
              </span>
              <span className="text-[11px] font-semibold text-[#8a8074] tabular-nums">
                {qi + 1}/{questions.length}
              </span>
            </div>
            <div className="h-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#df6e53] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3.5 pb-3.5 space-y-3" key={q.id}>
            <div className="text-center pt-1">
              <p className="text-[10px] font-medium text-[#8a8074] mb-2">
                {q.promptSub}
              </p>
              <p
                className={`font-serif text-[#1f1a16] dark:text-[#f5f0eb] leading-snug ${
                  q.kind === "kanji_to_hanviet" ? "text-[44px]" : "text-[13px]"
                }`}
              >
                {q.prompt}
              </p>
            </div>

            <div
              className={`grid gap-1.5 ${
                isKanjiOptions ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {q.options.map((opt) => {
                let style =
                  "bg-black/[0.03] dark:bg-white/[0.05] border-black/[0.06] dark:border-white/[0.08]";
                if (revealed) {
                  if (opt === q.answer) {
                    style =
                      "bg-[#2e7d58]/15 border-[#2e7d58] text-[#2e7d58] dark:text-[#52c28d] font-bold";
                  } else if (opt === selected) {
                    style =
                      "bg-[#c0392b]/12 border-[#c0392b] text-[#c0392b]";
                  } else {
                    style = "opacity-40 border-transparent";
                  }
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={revealed}
                    onClick={() => handleSelect(opt)}
                    className={`w-full px-2.5 py-2.5 rounded-[12px] border transition-all cursor-pointer active:scale-[0.98] disabled:cursor-default ${
                      isKanjiOptions
                        ? "font-serif text-xl text-center"
                        : "text-[13px] text-left font-medium"
                    } ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div
                className={`flex items-start gap-1.5 rounded-[12px] p-2.5 text-[12px] ${
                  isCorrect
                    ? "bg-[#2e7d58]/10 text-[#2e7d58] dark:text-[#52c28d]"
                    : "bg-[#df6e53]/10 text-[#c4563c]"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={15} className="shrink-0 mt-0.5" />
                )}
                <p className="leading-snug">
                  <span className="font-semibold">
                    {isCorrect ? "Đúng!" : "Sai."}
                  </span>{" "}
                  <span className="font-serif">{q.item.kanji}</span> ·{" "}
                  {q.item.han_viet}
                </p>
              </div>
            )}

            {revealed && (
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-2.5 rounded-[12px] text-[13px] font-bold bg-[#df6e53] text-white active:scale-[0.98] cursor-pointer"
              >
                {qi >= questions.length - 1 ? "Kết quả" : "Tiếp →"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return createPortal(content, document.body);
}
