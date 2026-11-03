"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { KanjiLessonMeta, KanjiProgressRecord } from "@/lib/kanjiTypes";
import { KANJI_PROGRESS_KEY } from "@/lib/kanjiQuiz";
import { PenLine, ArrowRight, BookOpen, Sparkles } from "lucide-react";

interface KanjiListClientProps {
  lessons: KanjiLessonMeta[];
}

export default function KanjiListClient({ lessons }: KanjiListClientProps) {
  const [progress, setProgress] = useState<Record<string, KanjiProgressRecord>>(
    {}
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KANJI_PROGRESS_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const totalChars = lessons.reduce((s, l) => s + l.count, 0);
  const knownTotal = lessons.reduce(
    (s, l) => s + (progress[l.id]?.knownIds?.length ?? 0),
    0
  );

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[26px] border border-black/[0.06] dark:border-white/[0.09] ios-card-shadow kanji-washi bg-gradient-to-br from-[#f8ede8] via-[#fbf6f1] to-[#e8eef4] dark:from-[#2a1d18] dark:via-[#1a1612] dark:to-[#1a242c]">
        <div className="absolute inset-0 opacity-[0.35] dark:opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1400&q=70"
            alt=""
            className="w-full h-full object-cover object-center mix-blend-multiply dark:mix-blend-luminosity"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f5]/94 dark:from-[#14110f]/94 via-[#fbf8f5]/75 dark:via-[#14110f]/75 to-transparent" />

        <div
          className="absolute -right-2 -bottom-8 font-serif font-black text-[9rem] sm:text-[11rem] leading-none text-[#df6e53]/12 dark:text-[#f39882]/10 select-none pointer-events-none"
          aria-hidden
        >
          漢
        </div>

        <div className="relative z-10 p-5 sm:p-8 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#df6e53]/12 dark:bg-[#df6e53]/20 text-[#a44d36] dark:text-[#f39882] text-[11px] font-bold tracking-wide mb-3">
            <PenLine size={13} />
            <span>JLPT N2 漢字</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1f1a16] dark:text-[#f5f0eb] tracking-tight leading-none mb-2">
            漢字学習
          </h1>
          <p className="text-sm text-[#6f6458] dark:text-[#b8aba0] leading-relaxed mb-5 max-w-md">
            Học từng chữ trên bàn học, rồi luyện quiz theo ngữ cảnh — nhớ lâu hơn
            flashcard đơn thuần.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-[14px] bg-white/70 dark:bg-black/30 border border-black/[0.05] dark:border-white/[0.08] text-[#5e554c] dark:text-[#d4c8bc]">
              <BookOpen size={13} className="text-[#df6e53]" />
              {lessons.length} bài
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-[14px] bg-white/70 dark:bg-black/30 border border-black/[0.05] dark:border-white/[0.08] text-[#5e554c] dark:text-[#d4c8bc]">
              <Sparkles size={13} className="text-[#5b8fad]" />
              {totalChars} chữ
            </span>
            {knownTotal > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-[14px] bg-[#2e7d58]/12 text-[#2e7d58] dark:text-[#52c28d] border border-[#2e7d58]/15">
                Đã biết {knownTotal}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lesson grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {lessons.map((lesson, i) => {
          const known = progress[lesson.id]?.knownIds?.length ?? 0;
          const quizBest = progress[lesson.id]?.quizBest;
          const pct =
            lesson.count > 0 ? Math.round((known / lesson.count) * 100) : 0;
          const previewChars = lesson.preview.split(" · ").slice(0, 5);

          return (
            <Link
              key={lesson.id}
              href={`/kanji/${lesson.id}`}
              className="group relative overflow-hidden rounded-[22px] bg-white/90 dark:bg-[#1a1714]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-5 ios-card-shadow hover:border-[#df6e53]/35 dark:hover:border-[#f39882]/35 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99] kanji-tile-enter"
              style={{ animationDelay: `${Math.min(i, 9) * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#df6e53] to-[#ef927c] dark:from-[#c4563c] dark:to-[#df6e53] flex items-center justify-center text-white font-serif font-black text-xl shadow-md shadow-[#df6e53]/25 ring-1 ring-black/5">
                      {lesson.id}
                    </div>
                    {pct > 0 && (
                      <span className="absolute -bottom-1 -right-1 min-w-[22px] h-[18px] px-1 rounded-full bg-[#1f1a16] dark:bg-[#f5f0eb] text-white dark:text-[#1f1a16] text-[9px] font-bold flex items-center justify-center">
                        {pct}%
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif font-bold text-lg text-[#1f1a16] dark:text-[#f5f0eb] group-hover:text-[#a44d36] dark:group-hover:text-[#f39882] transition-colors">
                      {lesson.title}
                    </h2>
                    <p className="text-[11px] text-[#8a8074] dark:text-[#9e9285] font-medium mt-0.5">
                      {lesson.count} chữ
                      {known > 0 ? ` · ${known} đã biết` : ""}
                      {quizBest != null ? ` · Quiz ${quizBest}%` : ""}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.06] text-[#c4b7a8] group-hover:bg-[#df6e53]/15 group-hover:text-[#df6e53] transition-all shrink-0">
                  <ArrowRight size={15} />
                </div>
              </div>

              {/* Preview tiles */}
              <div className="flex gap-1.5 mb-3">
                {previewChars.map((ch) => (
                  <span
                    key={ch}
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center font-serif text-lg bg-[#f5f1eb] dark:bg-[#241f1b] text-[#1f1a16] dark:text-[#f5f0eb] border border-black/[0.04] dark:border-white/[0.06]"
                  >
                    {ch}
                  </span>
                ))}
                {lesson.count > 5 && (
                  <span className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[10px] font-bold text-[#8a8074] bg-black/[0.03] dark:bg-white/[0.05]">
                    +{lesson.count - 5}
                  </span>
                )}
              </div>

              <div className="h-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#df6e53] to-[#ef927c] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-16 text-[#8a8074]">
          <BookOpen className="mx-auto mb-3 opacity-40" size={32} />
          <p className="text-sm">Chưa có dữ liệu kanji.</p>
        </div>
      )}
    </div>
  );
}
