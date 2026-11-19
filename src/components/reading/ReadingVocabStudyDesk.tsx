"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { VocabItem } from "@/lib/readingVocab";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
} from "lucide-react";

interface Props {
  items: VocabItem[];
  index: number;
  knownIds: Set<string>;
  topicName: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  onMarkKnown: (id: string) => void;
  onMarkReview: (id: string) => void;
}

export default function ReadingVocabStudyDesk({
  items,
  index,
  knownIds,
  topicName,
  onClose,
  onIndexChange,
  onMarkKnown,
  onMarkReview,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [flipped, setFlipped] = useState(false);
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
    setFlipped(false);
  }, [index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
      if (e.key === "ArrowRight" && index < items.length - 1)
        onIndexChange(index + 1);
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onIndexChange]);

  if (!item || !mounted) return null;
  const isKnown = knownIds.has(item.id);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/45 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-[min(100%,360px)] max-h-[78vh] flex flex-col bg-gradient-to-b from-white to-[#faf7f2] dark:from-[#1f1a16] dark:to-[#1a1714] rounded-[24px] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] overflow-hidden animate-fade-in"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-3.5 pt-3 pb-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={index <= 0}
              onClick={() => onIndexChange(index - 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-accent disabled:opacity-25 cursor-pointer hover:bg-accent/10"
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
              className="w-7 h-7 rounded-full flex items-center justify-center text-accent disabled:opacity-25 cursor-pointer hover:bg-accent/10"
              aria-label="Tiếp"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.08] text-[#8a8074] cursor-pointer"
            aria-label="Đóng"
          >
            <X size={14} />
          </button>
        </div>

        <p className="px-4 text-[10px] font-bold text-accent truncate">
          {topicName}
        </p>

        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="flex-1 overflow-y-auto px-5 py-6 text-center cursor-pointer min-h-[220px] flex flex-col items-center justify-center gap-2"
          key={item.id}
        >
          {!flipped ? (
            <>
              <span className="w-16 h-16 rounded-[18px] bg-accent/12 text-accent font-serif text-[28px] flex items-center justify-center mb-1">
                {item.word.length > 2 ? item.word.slice(0, 2) : item.word}
              </span>
              <p className="font-serif text-[36px] sm:text-[40px] leading-none text-[#1f1a16] dark:text-[#f5f0eb]">
                {item.word}
              </p>
              <p className="text-[14px] text-[#8a8074] tracking-wide">{item.reading}</p>
              {isKnown && (
                <span className="text-[10px] font-bold text-accent-muted mt-1">
                  đã thuộc
                </span>
              )}
              <p className="text-[11px] text-[#b0a59a] mt-5">Chạm xem nghĩa</p>
            </>
          ) : (
            <>
              <p className="font-serif text-[26px] text-[#1f1a16] dark:text-[#f5f0eb]">
                {item.word}
              </p>
              <p className="text-[13px] text-[#8a8074]">{item.reading}</p>
              <div className="mt-3 mx-1 rounded-[16px] bg-accent/10 px-4 py-3">
                <p className="text-[15px] font-semibold text-accent-muted leading-snug">
                  {item.meaning}
                </p>
              </div>
              <p className="text-[11px] text-[#b0a59a] mt-5">Chạm để lật lại</p>
            </>
          )}
        </button>

        <div className="shrink-0 px-3.5 pt-2 pb-3.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onMarkReview(item.id)}
            className="inline-flex items-center justify-center gap-1 py-2.5 rounded-[12px] text-[13px] font-semibold bg-black/[0.05] dark:bg-white/[0.08] text-[#5e554c] dark:text-[#c4b7a8] cursor-pointer active:scale-[0.98]"
          >
            <RotateCcw size={13} />
            Học lại
          </button>
          <button
            type="button"
            onClick={() => {
              onMarkKnown(item.id);
              if (index < items.length - 1) onIndexChange(index + 1);
            }}
            className="inline-flex items-center justify-center gap-1 py-2.5 rounded-[12px] text-[13px] font-bold bg-accent text-white cursor-pointer active:scale-[0.98]"
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
