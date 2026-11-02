"use client";

import { useEffect, useMemo, useState } from "react";
import type { KanjiItem, KanjiLesson, KanjiProgressRecord } from "@/lib/kanjiTypes";
import { KANJI_PROGRESS_KEY } from "@/lib/kanjiQuiz";
import KanjiStudyDesk from "./KanjiStudyDesk";
import KanjiQuizSession from "./KanjiQuizSession";
import { Search, GraduationCap, BookOpen } from "lucide-react";

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

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5b8fad] dark:text-[#8ec4e0] mb-1">
            Kanji N2
          </p>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb]">
            {lesson.title}
          </h1>
          <p className="text-xs text-[#8a8074] dark:text-[#9e9285] mt-1">
            {lesson.count} chữ
            {knownCount > 0 ? ` · Đã biết ${knownCount}` : ""}
            {quizBest != null ? ` · Quiz tốt nhất ${quizBest}%` : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setQuizOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[14px] bg-[#5b8fad] hover:bg-[#4a7a96] text-white text-sm font-bold shadow-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          <GraduationCap size={18} />
          Học bài này
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8074]"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kanji, Hán Việt, nghĩa..."
          className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-white/70 dark:bg-[#1a1714]/80 border border-black/[0.06] dark:border-white/[0.08] text-sm outline-none focus:border-[#5b8fad]/50 transition-colors"
        />
      </div>

      {/* Hint */}
      <p className="text-[11px] text-[#8a8074] dark:text-[#9e9285] flex items-center gap-1.5">
        <BookOpen size={12} />
        Chạm chữ để mở study desk · Nút Học để làm quiz 15 câu
      </p>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-2.5">
        {filtered.map((item) => {
          const known = knownIds.has(item.stt);
          return (
            <button
              key={item.stt}
              type="button"
              onClick={() => openDesk(item)}
              className={`aspect-square rounded-[14px] flex flex-col items-center justify-center gap-0.5 border transition-all active:scale-95 cursor-pointer ${
                known
                  ? "bg-[#2e7d58]/10 border-[#2e7d58]/30 dark:bg-[#2e7d58]/15"
                  : "bg-white/70 dark:bg-[#1a1714]/80 border-black/[0.06] dark:border-white/[0.08] hover:border-[#5b8fad]/40"
              }`}
              title={`${item.kanji} — ${item.han_viet}`}
            >
              <span className="font-serif text-2xl sm:text-[26px] leading-none text-[#1f1a16] dark:text-[#f5f0eb]">
                {item.kanji}
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium text-[#8a8074] dark:text-[#9e9285] truncate max-w-[90%]">
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
