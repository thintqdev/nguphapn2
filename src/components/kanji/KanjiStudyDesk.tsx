"use client";

import type { KanjiItem } from "@/lib/kanjiTypes";
import { parseKanjiExamples } from "@/lib/kanjiUtils";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
} from "lucide-react";

interface KanjiStudyDeskProps {
  items: KanjiItem[];
  index: number;
  knownIds: Set<number>;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  onMarkKnown: (stt: number) => void;
  onMarkReview: (stt: number) => void;
}

export default function KanjiStudyDesk({
  items,
  index,
  knownIds,
  onClose,
  onIndexChange,
  onMarkKnown,
  onMarkReview,
}: KanjiStudyDeskProps) {
  const item = items[index];
  if (!item) return null;

  const examples = parseKanjiExamples(item.vi_du);
  const isKnown = knownIds.has(item.stt);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-[2px] p-0 sm:p-6">
      <div
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] bg-[#faf7f2] dark:bg-[#171410] border border-black/[0.08] dark:border-white/[0.1] shadow-2xl animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#faf7f2]/95 dark:bg-[#171410]/95 backdrop-blur-sm">
          <span className="text-xs font-semibold text-[#8a8074] dark:text-[#9e9285]">
            {index + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.1] active:scale-90 transition-all cursor-pointer"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 sm:px-7 pt-6 pb-8 space-y-5">
          {/* Kanji hero */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-[28px] bg-gradient-to-br from-white to-[#f0ebe4] dark:from-[#221e1a] dark:to-[#1a1612] border border-black/[0.06] dark:border-white/[0.1] shadow-sm mb-4">
              <span className="font-serif text-6xl sm:text-7xl text-[#1f1a16] dark:text-[#f5f0eb] leading-none">
                {item.kanji}
              </span>
            </div>
            <p className="text-lg font-bold text-[#5b8fad] dark:text-[#8ec4e0] tracking-wide">
              {item.han_viet}
            </p>
            {isKnown && (
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-[#2e7d58] dark:text-[#52c28d] bg-[#2e7d58]/10 px-2.5 py-1 rounded-full">
                <Check size={12} /> Đã biết
              </span>
            )}
          </div>

          {/* Meaning */}
          <section className="rounded-[18px] bg-[#e8f0f6]/70 dark:bg-[#1a242c]/60 border border-[#5b8fad]/15 dark:border-[#6ba3c4]/20 p-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#5b8fad] dark:text-[#8ec4e0] mb-1.5">
              Ý nghĩa
            </h3>
            <p className="text-sm text-[#3d3630] dark:text-[#d4c8bc] leading-relaxed">
              {item.giai_thich}
            </p>
          </section>

          {/* Examples */}
          <section className="rounded-[18px] bg-white/60 dark:bg-[#1e1a16]/70 border border-black/[0.06] dark:border-white/[0.08] p-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] dark:text-[#9e9285] mb-3">
              Ví dụ
            </h3>
            {examples.length > 0 ? (
              <ul className="space-y-3">
                {examples.map((ex, i) => (
                  <li key={i} className="flex flex-col gap-0.5">
                    <span className="font-serif text-base text-[#1f1a16] dark:text-[#f5f0eb]">
                      {ex.compound}
                      {ex.reading && (
                        <span className="text-sm text-[#8a8074] dark:text-[#9e9285] font-sans ml-1.5">
                          （{ex.reading}）
                        </span>
                      )}
                    </span>
                    {ex.meaning && (
                      <span className="text-xs text-[#70665a] dark:text-[#b8aba0]">
                        {ex.meaning}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#70665a] dark:text-[#b8aba0]">
                {item.vi_du}
              </p>
            )}
          </section>

          {/* Actions */}
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => onMarkReview(item.stt)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-[14px] text-sm font-semibold bg-black/[0.05] dark:bg-white/[0.08] text-[#5e554c] dark:text-[#c4b7a8] hover:bg-black/[0.08] active:scale-[0.98] transition-all cursor-pointer"
            >
              <RotateCcw size={15} />
              Học lại
            </button>
            <button
              type="button"
              onClick={() => onMarkKnown(item.stt)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-[14px] text-sm font-semibold bg-[#2e7d58] text-white hover:bg-[#276d4c] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
            >
              <Check size={15} />
              Biết rồi
            </button>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              disabled={index <= 0}
              onClick={() => onIndexChange(index - 1)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-[12px] text-sm font-semibold text-[#5b8fad] dark:text-[#8ec4e0] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#5b8fad]/10 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft size={18} />
              Trước
            </button>
            <button
              type="button"
              disabled={index >= items.length - 1}
              onClick={() => onIndexChange(index + 1)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-[12px] text-sm font-semibold text-[#5b8fad] dark:text-[#8ec4e0] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#5b8fad]/10 active:scale-95 transition-all cursor-pointer"
            >
              Tiếp
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
