"use client";

import { useEffect, useMemo, useState } from "react";
import type { AffixKind, AffixWithKind } from "@/lib/affixTypes";
import {
  loadAffixProgress,
  saveAffixProgress,
  shortMeaning,
} from "@/lib/affixQuiz";
import AffixStudyDesk from "./AffixStudyDesk";
import AffixQuizSession from "./AffixQuizSession";
import { Search, GraduationCap, BookOpen, Check } from "lucide-react";

interface AffixClientProps {
  items: AffixWithKind[];
  title: string;
}

const TABS: { id: AffixKind; label: string; sub: string }[] = [
  { id: "prefix", label: "接頭語", sub: "Tiền tố" },
  { id: "suffix", label: "接尾語", sub: "Hậu tố" },
];

export default function AffixClient({ items }: AffixClientProps) {
  const [tab, setTab] = useState<AffixKind>("prefix");
  const [query, setQuery] = useState("");
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [deskIndex, setDeskIndex] = useState<number | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizBest, setQuizBest] = useState<Partial<Record<AffixKind, number>>>(
    {}
  );

  useEffect(() => {
    const rec = loadAffixProgress();
    setKnownIds(new Set(rec.knownIds ?? []));
    setQuizBest(rec.quizBest ?? {});
  }, []);

  const tabItems = useMemo(
    () => items.filter((a) => a.kind === tab),
    [items, tab]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tabItems;
    return tabItems.filter(
      (item) =>
        item.kanji.includes(q) ||
        item.hiragana.includes(q) ||
        item.romaji.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.examples.some(
          (ex) =>
            ex.word.includes(q) ||
            ex.reading.includes(q) ||
            ex.meaning.toLowerCase().includes(q)
        )
    );
  }, [tabItems, query]);

  const knownInTab = tabItems.filter((a) => knownIds.has(a.id)).length;
  const pct =
    tabItems.length > 0
      ? Math.round((knownInTab / tabItems.length) * 100)
      : 0;
  const best = quizBest[tab];

  function openDesk(item: AffixWithKind) {
    const idx = filtered.findIndex((i) => i.id === item.id);
    setDeskIndex(idx >= 0 ? idx : 0);
  }

  function markKnown(id: string) {
    setKnownIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveAffixProgress({ knownIds: Array.from(next) });
      return next;
    });
  }

  function markReview(id: string) {
    setKnownIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      saveAffixProgress({ knownIds: Array.from(next) });
      return next;
    });
  }

  function handleQuizFinished(score: number, total: number) {
    const pctScore = total > 0 ? Math.round((score / total) * 100) : 0;
    setQuizBest((prev) => {
      const cur = prev[tab];
      const nextBest = cur == null ? pctScore : Math.max(cur, pctScore);
      const next = { ...prev, [tab]: nextBest };
      saveAffixProgress({ quizBest: next });
      return next;
    });
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb]">
            接辞 · Tiền & Hậu tố
          </h1>
          <p className="text-sm text-[#8a8074] mt-1">
            {tabItems.length} mục
            {knownInTab > 0 ? ` · Đã biết ${knownInTab} (${pct}%)` : ""}
            {best != null ? ` · Quiz ${best}%` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setQuizOpen(true)}
          disabled={tabItems.length < 4}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-accent hover:bg-accent-hover disabled:opacity-40 text-white text-sm font-bold active:scale-[0.98] cursor-pointer shrink-0"
        >
          <GraduationCap size={16} />
          Học bài này
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 rounded-[14px] bg-black/[0.04] dark:bg-white/[0.06]">
        {TABS.map((t) => {
          const active = tab === t.id;
          const count = items.filter((a) => a.kind === t.id).length;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setQuery("");
                setDeskIndex(null);
              }}
              className={`flex-1 py-2.5 rounded-[11px] text-center transition-all cursor-pointer ${
                active
                  ? "bg-white dark:bg-[#1a1714] shadow-sm text-accent"
                  : "text-[#8a8074] hover:text-[#5e554c]"
              }`}
            >
              <span className="block font-serif font-bold text-[14px]">
                {t.label}
              </span>
              <span className="block text-[10px] font-semibold mt-0.5 opacity-80">
                {t.sub} · {count}
              </span>
            </button>
          );
        })}
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
            placeholder="Tìm 接辞, nghĩa, ví dụ..."
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
          {filtered.length}/{tabItems.length}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-2.5">
        {filtered.map((item, i) => {
          const known = knownIds.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => openDesk(item)}
              style={{ animationDelay: `${Math.min(i, 24) * 18}ms` }}
              className={`kanji-tile-enter relative aspect-square rounded-[16px] flex flex-col items-center justify-center gap-1 border transition-all duration-200 active:scale-95 cursor-pointer group ${
                known
                  ? "bg-accent/12 border-accent-border shadow-sm"
                  : "bg-white/95 dark:bg-[#1a1714]/95 ios-glass border-black/[0.06] dark:border-white/[0.08] hover:border-accent-border hover:-translate-y-0.5 hover:shadow-md"
              }`}
              title={`${item.kanji} — ${item.meaning}`}
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
                {shortMeaning(item.meaning, 10)}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-[#8a8074] py-10">
          Không tìm thấy 接辞 phù hợp.
        </p>
      )}

      {deskIndex !== null && (
        <AffixStudyDesk
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
        <AffixQuizSession
          items={tabItems}
          onClose={() => setQuizOpen(false)}
          onFinished={handleQuizFinished}
        />
      )}
    </div>
  );
}
