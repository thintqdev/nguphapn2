"use client";

import { useMemo, useState } from "react";
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
    const step = done ? questions.length : qi;
    return Math.round((step / questions.length) * 100);
  }, [qi, done, questions.length]);

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

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
        <div className="bg-[#faf7f2] dark:bg-[#171410] rounded-[20px] p-6 max-w-sm w-full text-center">
          <p className="text-sm mb-4">Không đủ dữ liệu để tạo quiz.</p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[12px] bg-[#5b8fad] text-white text-sm font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-[2px] p-0 sm:p-6">
        <div className="w-full sm:max-w-md rounded-t-[24px] sm:rounded-[24px] bg-[#faf7f2] dark:bg-[#171410] border border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-6 sm:p-8 text-center animate-fade-in">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#5b8fad]/15 dark:bg-[#6ba3c4]/20 flex items-center justify-center text-[#5b8fad] dark:text-[#8ec4e0]">
            <Sparkles size={28} />
          </div>
          <h2 className="font-serif font-bold text-xl mb-1">Hoàn thành!</h2>
          <p className="text-sm text-[#70665a] dark:text-[#b8aba0] mb-5">
            Bạn đúng {correctCount}/{questions.length} câu ({pct}%)
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-[14px] text-sm font-semibold bg-[#5b8fad] text-white cursor-pointer active:scale-[0.98]"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-[2px] p-0 sm:p-6">
      <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] bg-[#faf7f2] dark:bg-[#171410] border border-black/[0.08] dark:border-white/[0.1] shadow-2xl animate-fade-in">
        <div className="sticky top-0 z-10 px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#faf7f2]/95 dark:bg-[#171410]/95">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#8a8074]">
              Câu {qi + 1}/{questions.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.08] active:scale-90 cursor-pointer"
              aria-label="Đóng"
            >
              <X size={16} />
            </button>
          </div>
          <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#5b8fad] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="px-5 sm:px-7 py-6 space-y-5">
          <div className="text-center space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5b8fad] dark:text-[#8ec4e0]">
              {q.promptSub}
            </p>
            <p
              className={`font-serif text-[#1f1a16] dark:text-[#f5f0eb] leading-snug ${
                q.kind === "kanji_to_hanviet"
                  ? "text-6xl"
                  : q.kind === "meaning_to_kanji"
                    ? "text-base sm:text-lg"
                    : "text-sm sm:text-base"
              }`}
            >
              {q.prompt}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {q.options.map((opt) => {
              let style =
                "bg-white/70 dark:bg-[#221e1a] border-black/[0.08] dark:border-white/[0.1] hover:border-[#5b8fad]/40";
              if (revealed) {
                if (opt === q.answer) {
                  style =
                    "bg-[#2e7d58]/12 border-[#2e7d58]/50 text-[#2e7d58] dark:text-[#52c28d]";
                } else if (opt === selected) {
                  style =
                    "bg-[#df6e53]/12 border-[#df6e53]/50 text-[#c4563c]";
                } else {
                  style =
                    "bg-black/[0.02] dark:bg-white/[0.03] border-transparent opacity-50";
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={revealed}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-4 py-3.5 rounded-[14px] border text-base font-medium transition-all cursor-pointer active:scale-[0.99] disabled:cursor-default ${
                    q.kind !== "kanji_to_hanviet" ? "font-serif text-2xl" : ""
                  } ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div
              className={`flex items-start gap-2 rounded-[14px] p-3 text-sm ${
                isCorrect
                  ? "bg-[#2e7d58]/10 text-[#2e7d58] dark:text-[#52c28d]"
                  : "bg-[#df6e53]/10 text-[#c4563c]"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              ) : (
                <XCircle size={18} className="shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">
                  {isCorrect ? "Đúng rồi!" : "Chưa đúng"}
                </p>
                <p className="text-xs mt-0.5 opacity-90">
                  {q.item.kanji} · {q.item.han_viet} — {q.item.giai_thich}
                </p>
              </div>
            </div>
          )}

          {revealed && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 rounded-[14px] text-sm font-bold bg-[#5b8fad] text-white hover:bg-[#4a7a96] active:scale-[0.98] transition-all cursor-pointer"
            >
              {qi >= questions.length - 1 ? "Xem kết quả" : "Câu tiếp →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
