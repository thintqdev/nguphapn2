"use client";

import { useEffect, useMemo, useState } from "react";
import type { KanjiItem, KanjiLesson, KanjiProgressRecord } from "@/lib/kanjiTypes";
import { KANJI_PROGRESS_KEY } from "@/lib/kanjiQuiz";
import KanjiStudyDesk from "./KanjiStudyDesk";
import KanjiQuizSession from "./KanjiQuizSession";
import { Search, GraduationCap, BookOpen, Check } from "lucide-react";

interface KanjiLessonClientProps {
  lesson: KanjiLesson;
}

function loadAllProgress(): Record<string, KanjiProgressRecord> {
  try {
    const raw = localStorage.getItem(KANJI_PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {};
}

function saveProgress(
  lessonId: string,
  patch: Partial<KanjiProgressRecord>
) {
  const all = loadAllProgress();
  const prev = all[lessonId] ?? {
    lessonId,
    knownIds: [],
    reviewIds: [],
    updatedAt: new Date().toISOString(),
  };
  all[lessonId] = {
    ...prev,
    ...patch,
    lessonId,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KANJI_PROGRESS_KEY, JSON.stringify(all));
  return all[lessonId];
}

export default function KanjiLessonClient({ lesson }: KanjiLessonClientProps) {
  const [query, setQuery] = useState("");
  const [knownIds, setKnownIds] = useState<Set<number>>(new Set());
  const [deskIndex, setDeskIndex] = useState<number | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizBest, setQuizBest] = useState<number | undefined>();

  useEffect(() => {
    const rec = loadAllProgress()[lesson.id];
    if (rec) {
      setKnownIds(new Set(rec.knownIds ?? []));
      setQuizBest(rec.quizBest);
    }
  }, [lesson.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lesson.items;
    return lesson.items.filter(
      (item) =>
        item.kanji.includes(q) ||
        item.han_viet.toLowerCase().includes(q) ||
        item.giai_thich.toLowerCase().includes(q) ||
        item.vi_du.toLowerCase().includes(q)
    );
  }, [lesson.items, query]);

  function openDesk(item: KanjiItem) {
    const idx = filtered.findIndex((i) => i.stt === item.stt);
    setDeskIndex(idx >= 0 ? idx : 0);
  }

  function markKnown(stt: number) {
    setKnownIds((prev) => {
      const next = new Set(prev);
      next.add(stt);
      saveProgress(lesson.id, {
        knownIds: Array.from(next),
        reviewIds: [],
      });
      return next;
    });
  }

  function markReview(stt: number) {
    setKnownIds((prev) => {
      const next = new Set(prev);
      next.delete(stt);
      saveProgress(lesson.id, {
        knownIds: Array.from(next),
      });
      return next;
    });
  }

  function handleQuizFinished(score: number, total: number) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    setQuizBest((prev) => {
      const best = prev == null ? pct : Math.max(prev, pct);
      saveProgress(lesson.id, { quizBest: best });
      return best;
    });
  }

  const knownCount = knownIds.size;
  const pct =
    lesson.count > 0 ? Math.round((knownCount / lesson.count) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb]">
            {lesson.title}
          </h1>
          <p className="text-sm text-[#8a8074] mt-1">
            {lesson.count} chữ
            {knownCount > 0 ? ` · Đã biết ${knownCount} (${pct}%)` : ""}
            {quizBest != null ? ` · Quiz ${quizBest}%` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setQuizOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-accent hover:bg-accent-hover text-white text-sm font-bold active:scale-[0.98] cursor-pointer shrink-0"
        >
          <GraduationCap size={16} />
          Học bài này
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8074]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kanji, Hán Việt, nghĩa..."
            className="w-full pl-10 pr-4 py-3 rounded-[16px] bg-white/90 dark:bg-[#1a1714]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] text-sm outline-none focus:border-accent-border focus:ring-2 focus:ring-accent-ring transition-all"
          />
        </div>
        <p className="text-[11px] text-[#8a8074] dark:text-[#9e9285] flex items-center gap-1.5 px-1 sm:px-0 shrink-0">
          <BookOpen size={12} className="text-accent" />
          Chạm chữ → study desk
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-[#8a8074] dark:text-[#9e9285]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[4px] bg-white dark:bg-[#1a1714] border border-black/10 dark:border-white/15" />
          Chưa học
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[4px] bg-accent/20 border border-accent-border" />
          Đã biết
        </span>
        <span className="ml-auto font-medium">
          {filtered.length}/{lesson.count}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-2.5">
        {filtered.map((item, i) => {
          const known = knownIds.has(item.stt);
          return (
            <button
              key={item.stt}
              type="button"
              onClick={() => openDesk(item)}
              style={{ animationDelay: `${Math.min(i, 24) * 18}ms` }}
              className={`kanji-tile-enter relative aspect-square rounded-[16px] flex flex-col items-center justify-center gap-1 border transition-all duration-200 active:scale-95 cursor-pointer group ${
                known
                  ? "bg-accent/12 border-accent-border shadow-sm"
                  : "bg-white/95 dark:bg-[#1a1714]/95 ios-glass border-black/[0.06] dark:border-white/[0.08] hover:border-accent-border hover:-translate-y-0.5 hover:shadow-md"
              }`}
              title={`${item.kanji} — ${item.han_viet}`}
            >
              {known && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-accent text-white flex items-center justify-center">
                  <Check size={9} strokeWidth={3} />
                </span>
              )}
              <span className="font-serif text-[26px] sm:text-[28px] leading-none text-[#1f1a16] dark:text-[#f5f0eb] group-hover:scale-105 transition-transform">
                {item.kanji}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-[#8a8074] dark:text-[#9e9285] truncate max-w-[88%]">
                {item.han_viet}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-[#8a8074] py-10">
          Không tìm thấy chữ phù hợp.
        </p>
      )}

      {deskIndex !== null && (
        <KanjiStudyDesk
          items={filtered}
          index={deskIndex}
          knownIds={knownIds}
          onClose={() => setDeskIndex(null)}
          onIndexChange={setDeskIndex}
          onMarkKnown={markKnown}
          onMarkReview={markReview}
        />
      )}

      {quizOpen && (
        <KanjiQuizSession
          items={lesson.items}
          onClose={() => setQuizOpen(false)}
          onFinished={handleQuizFinished}
        />
      )}
    </div>
  );
}
