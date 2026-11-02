"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { KanjiLessonMeta, KanjiProgressRecord } from "@/lib/kanjiTypes";
import { KANJI_PROGRESS_KEY } from "@/lib/kanjiQuiz";
import { PenLine, ArrowRight, BookOpen } from "lucide-react";

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

  return (
    <div className="space-y-7 animate-fade-in">
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#e8f0f6] via-[#f4f7fa] to-[#ebe4dc] dark:from-[#1a242c] dark:via-[#151a1e] dark:to-[#1e1814] p-5 sm:p-7 border border-[#5b8fad]/20 dark:border-[#6ba3c4]/25 shadow-sm">
        <div className="absolute right-3 -bottom-4 font-serif font-black text-8xl sm:text-9xl text-[#5b8fad]/12 dark:text-[#6ba3c4]/12 pointer-events-none select-none">
          漢
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5b8fad]/15 dark:bg-[#6ba3c4]/25 text-[#3d6d8a] dark:text-[#8ec4e0] text-[11px] font-bold tracking-wide uppercase mb-3">
            <PenLine size={13} />
            <span>Kanji JLPT N2</span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb] tracking-tight leading-tight mb-2">
            N2 漢字学習
          </h1>
          <p className="text-xs sm:text-sm text-[#70665a] dark:text-[#b8aba0] leading-relaxed mb-4">
            Học kanji theo bài: xem từng chữ (study desk) hoặc luyện quiz nhận diện
            Hán Việt, nghĩa và ví dụ trong ngữ cảnh.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[#5e554c] dark:text-[#9e9285] font-medium bg-black/[0.04] dark:bg-white/[0.06] px-3.5 py-2.5 rounded-[14px]">
              <span>{lessons.length} bài</span>
              <span>•</span>
              <span>{totalChars} chữ</span>
              <span>•</span>
              <span>Study desk + Quiz</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {lessons.map((lesson) => {
          const known = progress[lesson.id]?.knownIds?.length ?? 0;
          const pct =
            lesson.count > 0 ? Math.round((known / lesson.count) * 100) : 0;

          return (
            <Link
              key={lesson.id}
              href={`/kanji/${lesson.id}`}
              className="group relative overflow-hidden rounded-[20px] bg-white/70 dark:bg-[#1a1714]/80 border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#5b8fad]/35 dark:hover:border-[#6ba3c4]/35 transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#5b8fad]/20 to-[#df6e53]/15 dark:from-[#6ba3c4]/25 dark:to-[#f39882]/15 flex items-center justify-center text-[#3d6d8a] dark:text-[#8ec4e0] font-serif font-bold text-lg">
                    {lesson.id}
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base text-[#1f1a16] dark:text-[#f5f0eb]">
                      {lesson.title}
                    </h2>
                    <p className="text-[11px] text-[#8a8074] dark:text-[#9e9285] font-medium">
                      {lesson.count} chữ
                      {known > 0 ? ` · Đã biết ${known}` : ""}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-[#c4b7a8] group-hover:text-[#5b8fad] dark:group-hover:text-[#8ec4e0] transition-colors mt-1"
                />
              </div>

              <p className="text-sm font-serif text-[#5e554c] dark:text-[#c4b7a8] tracking-wide mb-3 line-clamp-1">
                {lesson.preview}
              </p>

              {known > 0 && (
                <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#5b8fad] dark:bg-[#6ba3c4] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
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
