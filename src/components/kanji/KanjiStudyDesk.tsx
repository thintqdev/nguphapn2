"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const item = items[index];

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
      if (e.key === "ArrowRight" && index < items.length - 1)
        onIndexChange(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onIndexChange]);

  if (!item || !mounted) return null;

  const examples = parseKanjiExamples(item.vi_du).slice(0, 2);
  const isKnown = knownIds.has(item.stt);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/45 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-[min(100%,340px)] max-h-[78vh] flex flex-col bg-white dark:bg-[#1a1714] rounded-[20px] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] overflow-hidden animate-fade-in"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-3.5 pt-3 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={index <= 0}
              onClick={() => onIndexChange(index - 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-accent disabled:opacity-25 disabled:cursor-not-allowed hover:bg-accent/10 active:scale-90 transition-all cursor-pointer"
              aria-label="Trước"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[11px] font-semibold text-[#8a8074] tabular-nums">
              {index + 1}/{items.length}
            </span>
            <button
              type="button"
              disabled={index >= items.length - 1}
              onClick={() => onIndexChange(index + 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-accent disabled:opacity-25 disabled:cursor-not-allowed hover:bg-accent/10 active:scale-90 transition-all cursor-pointer"
              aria-label="Tiếp"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.08] text-[#8a8074] hover:bg-black/[0.1] active:scale-90 transition-all cursor-pointer"
            aria-label="Đóng"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-3" key={item.stt}>
          <div className="text-center py-1 mb-3">
            <p className="font-serif text-[52px] leading-none text-[#1f1a16] dark:text-[#f5f0eb]">
              {item.kanji}
            </p>
            <p className="mt-1.5 text-[15px] font-semibold text-accent">
              {item.han_viet}
              {isKnown && (
                <span className="ml-1.5 align-middle text-[10px] font-bold text-accent-muted">
                  · đã biết
                </span>
              )}
            </p>
          </div>

          <p className="text-[13px] text-[#3d3630] dark:text-[#d4c8bc] leading-snug text-center mb-3">
            {item.giai_thich}
          </p>

          {(examples.length > 0 || item.vi_du) && (
            <div className="rounded-[12px] bg-black/[0.03] dark:bg-white/[0.04] px-3 py-2 space-y-1.5">
              {examples.length > 0 ? (
                examples.map((ex, i) => (
                  <p
                    key={i}
                    className="text-[12.5px] leading-snug text-[#1f1a16] dark:text-[#f5f0eb]"
                  >
                    <span className="font-serif">{ex.compound}</span>
                    {ex.reading && (
                      <span className="text-[#8a8074] dark:text-[#9e9285]">
                        （{ex.reading}）
                      </span>
                    )}
                    {ex.meaning && (
                      <span className="text-[#70665a] dark:text-[#b8aba0]">
                        {" · "}
                        {ex.meaning}
                      </span>
                    )}
                  </p>
                ))
              ) : (
                <p className="text-[12px] text-[#70665a] dark:text-[#b8aba0] leading-snug">
                  {item.vi_du}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="shrink-0 px-3.5 pt-2 pb-3.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onMarkReview(item.stt)}
            className="inline-flex items-center justify-center gap-1 py-2.5 rounded-[12px] text-[13px] font-semibold bg-black/[0.05] dark:bg-white/[0.08] text-[#5e554c] dark:text-[#c4b7a8] active:scale-[0.98] transition-all cursor-pointer"
          >
            <RotateCcw size={13} />
            Học lại
          </button>
          <button
            type="button"
            onClick={() => {
              onMarkKnown(item.stt);
              if (index < items.length - 1) onIndexChange(index + 1);
            }}
            className="inline-flex items-center justify-center gap-1 py-2.5 rounded-[12px] text-[13px] font-bold bg-accent hover:bg-accent-hover text-white active:scale-[0.98] transition-all cursor-pointer"
          >
            <Check size={13} />
            Biết rồi
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
