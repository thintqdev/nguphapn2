"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { KanjiLessonMeta, KanjiProgressRecord } from "@/lib/kanjiTypes";
import { KANJI_PROGRESS_KEY } from "@/lib/kanjiQuiz";
import { ArrowRight, BookOpen } from "lucide-react";

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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb]">
          漢字学習
        </h1>
        <p className="text-sm text-[#70665a] dark:text-[#b8aba0] mt-1.5">
          {lessons.length} bài · {totalChars} chữ
          {knownTotal > 0 ? ` · Đã biết ${knownTotal}` : ""}
          {" · "}Study desk + Quiz
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {lessons.map((lesson) => {
          const known = progress[lesson.id]?.knownIds?.length ?? 0;
          const quizBest = progress[lesson.id]?.quizBest;
          const pct =
            lesson.count > 0 ? Math.round((known / lesson.count) * 100) : 0;
          const previewChars = lesson.preview.split(" · ").slice(0, 5);

          return (
            <Link
              key={lesson.id}
              href={`/kanji/${lesson.id}`}
              className="group rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90 p-4 hover:border-[#df6e53]/35 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-[12px] bg-[#df6e53]/12 text-[#a44d36] dark:text-[#f39882] font-serif font-bold text-base flex items-center justify-center">
                    {lesson.id}
                  </span>
                  <div>
                    <h2 className="font-serif font-bold text-base text-[#1f1a16] dark:text-[#f5f0eb]">
                      {lesson.title}
                    </h2>
                    <p className="text-[11px] text-[#8a8074]">
                      {lesson.count} chữ
                      {known > 0 ? ` · ${known} đã biết` : ""}
                      {quizBest != null ? ` · Quiz ${quizBest}%` : ""}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={15}
                  className="text-[#c4b7a8] group-hover:text-[#df6e53] mt-1"
                />
              </div>

              <p className="text-sm font-serif text-[#5e554c] dark:text-[#c4b7a8] tracking-wide mb-2.5">
                {previewChars.join(" · ")}
              </p>

              {known > 0 && (
                <div className="h-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#df6e53]"
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
