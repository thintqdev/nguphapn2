"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReadingTopicVocab } from "@/lib/readingGuideTypes";
import {
  flattenTopicWords,
  loadVocabProgress,
  saveVocabProgress,
  type VocabItem,
} from "@/lib/readingVocab";
import ReadingVocabStudyDesk from "./ReadingVocabStudyDesk";
import ReadingVocabQuiz from "./ReadingVocabQuiz";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
} from "lucide-react";

interface Props {
  topics: ReadingTopicVocab[];
}

function shortTopicName(name: string): string {
  const before = name.split(/[–—(-（]/)[0]?.trim();
  return before || name;
}

function jpHint(name: string): string | null {
  const m = name.match(/[（(]([^）)]+)[）)]/);
  return m?.[1]?.split(/[：:]/)[0]?.trim() || null;
}

export default function ReadingVocabLearner({ topics }: Props) {
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [quizBest, setQuizBest] = useState<Record<string, number>>({});
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);
  const [deskIndex, setDeskIndex] = useState<number | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    const rec = loadVocabProgress();
    setKnownIds(new Set(rec.knownIds));
    setQuizBest(rec.quizBest ?? {});
  }, []);

  const activeTopic = useMemo(
    () => topics.find((t) => t.topic_id === activeTopicId) ?? null,
    [topics, activeTopicId]
  );

  const activeWords: VocabItem[] = useMemo(
    () => (activeTopic ? flattenTopicWords(activeTopic) : []),
    [activeTopic]
  );

  const totalWords = useMemo(
    () => topics.reduce((n, t) => n + t.words.length, 0),
    [topics]
  );

  const totalKnown = useMemo(() => {
    let n = 0;
    for (const t of topics) {
      for (const w of flattenTopicWords(t)) {
        if (knownIds.has(w.id)) n++;
      }
    }
    return n;
  }, [topics, knownIds]);

  const overallPct =
    totalWords > 0 ? Math.round((totalKnown / totalWords) * 100) : 0;

  function markKnown(id: string) {
    setKnownIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveVocabProgress({ knownIds: Array.from(next) });
      return next;
    });
  }

  function markReview(id: string) {
    setKnownIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      saveVocabProgress({ knownIds: Array.from(next) });
      return next;
    });
  }

  function handleQuizFinished(score: number, total: number) {
    if (activeTopicId == null) return;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const key = String(activeTopicId);
    setQuizBest((prev) => {
      const cur = prev[key];
      const nextBest = cur == null ? pct : Math.max(cur, pct);
      const next = { ...prev, [key]: nextBest };
      saveVocabProgress({ quizBest: next });
      return next;
    });
  }

  function openTopic(topicId: number) {
    setActiveTopicId(topicId);
    setDeskIndex(null);
    setQuizOpen(false);
  }

  if (activeTopic) {
    const knownInTopic = activeWords.filter((w) => knownIds.has(w.id)).length;
    const pct =
      activeWords.length > 0
        ? Math.round((knownInTopic / activeWords.length) * 100)
        : 0;
    const best = quizBest[String(activeTopic.topic_id)];
    const hint = jpHint(activeTopic.topic_name);
    const previews = activeWords.slice(0, 4);

    return (
      <div className="space-y-5 animate-fade-in">
        <button
          type="button"
          onClick={() => {
            setActiveTopicId(null);
            setDeskIndex(null);
            setQuizOpen(false);
          }}
          className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-accent cursor-pointer"
        >
          <ChevronLeft size={16} strokeWidth={2.4} />
          Tất cả chủ đề
        </button>

        {/* Topic hero */}
        <div className="relative overflow-hidden rounded-[22px] border border-accent/20 bg-gradient-to-br from-accent/[0.14] via-white/80 to-[#f5f3ee] dark:via-[#1a1714]/90 dark:to-[#12100e] px-5 py-5 sm:px-6 sm:py-6">
          <div
            className="pointer-events-none absolute -right-6 -top-8 font-serif text-[96px] leading-none text-accent/[0.08] select-none"
            aria-hidden
          >
            語
          </div>
          {hint && (
            <p className="text-[11px] font-bold tracking-[0.08em] text-accent-muted mb-1.5">
              {hint}
            </p>
          )}
          <h3 className="relative font-serif font-bold text-[1.35rem] sm:text-2xl text-[#1f1a16] dark:text-[#f5f0eb] leading-snug max-w-[20em]">
            {shortTopicName(activeTopic.topic_name)}
          </h3>
          <p className="relative text-[12px] text-[#70665a] dark:text-[#b8aba0] mt-2">
            {activeWords.length} từ
            {knownInTopic > 0 ? ` · đã thuộc ${knownInTopic}` : " · chưa học"}
            {best != null ? ` · quiz cao nhất ${best}%` : ""}
          </p>

          <div className="relative mt-4 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.1] overflow-hidden max-w-xs">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="relative mt-1.5 text-[11px] font-semibold text-accent-muted tabular-nums">
            {pct}% hoàn thành
          </p>

          <div className="relative mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDeskIndex(0)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-[13px] font-bold bg-accent hover:bg-accent-hover text-white shadow-[0_8px_20px_var(--accent-shadow)] cursor-pointer active:scale-[0.98]"
            >
              <Layers size={15} />
              Học thẻ
            </button>
            <button
              type="button"
              disabled={activeWords.length < 4}
              onClick={() => setQuizOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-[13px] font-bold border border-black/[0.08] dark:border-white/[0.12] bg-white/70 dark:bg-[#1a1714]/70 text-[#1f1a16] dark:text-[#f5f0eb] disabled:opacity-40 cursor-pointer active:scale-[0.98]"
            >
              <GraduationCap size={15} />
              Quiz
            </button>
          </div>

          {previews.length > 0 && (
            <div className="relative mt-5 flex flex-wrap gap-2">
              {previews.map((w) => (
                <span
                  key={w.id}
                  className="font-serif text-[15px] px-2.5 py-1 rounded-[10px] bg-white/70 dark:bg-black/20 text-[#1f1a16] dark:text-[#f5f0eb] border border-black/[0.05] dark:border-white/[0.08]"
                >
                  {w.word}
                </span>
              ))}
              {activeWords.length > 4 && (
                <span className="text-[12px] self-center text-[#8a8074]">
                  +{activeWords.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Word list */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] px-0.5">
            Danh sách từ · chạm để học
          </p>
          <ul className="space-y-1.5">
            {activeWords.map((w, i) => {
              const known = knownIds.has(w.id);
              return (
                <li key={w.id}>
                  <button
                    type="button"
                    onClick={() => setDeskIndex(i)}
                    style={{ animationDelay: `${Math.min(i, 16) * 20}ms` }}
                    className={`kanji-tile-enter w-full flex items-center gap-3 rounded-[16px] px-3.5 py-3 text-left border transition-all cursor-pointer active:scale-[0.99] group ${
                      known
                        ? "border-accent/30 bg-accent/[0.09]"
                        : "border-black/[0.05] dark:border-white/[0.07] bg-white/90 dark:bg-[#1a1714]/85 hover:border-accent-border hover:bg-accent/[0.04]"
                    }`}
                  >
                    <span
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] flex items-center justify-center font-serif text-[20px] sm:text-[22px] shrink-0 transition-transform group-hover:scale-105 ${
                        known
                          ? "bg-accent text-white"
                          : "bg-[#f0ebe3] dark:bg-[#241f1b] text-[#1f1a16] dark:text-[#f5f0eb]"
                      }`}
                    >
                      {w.word.length > 2 ? w.word.slice(0, 2) : w.word}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-serif text-[17px] sm:text-[18px] text-[#1f1a16] dark:text-[#f5f0eb] leading-none">
                          {w.word}
                        </span>
                        <span className="text-[12px] text-[#8a8074]">
                          {w.reading}
                        </span>
                      </span>
                      <span className="block text-[12px] sm:text-[13px] text-[#70665a] dark:text-[#b8aba0] mt-1 leading-snug truncate">
                        {w.meaning}
                      </span>
                    </span>
                    <span className="shrink-0 flex flex-col items-end gap-1">
                      {known ? (
                        <span className="text-[10px] font-bold text-accent-muted">
                          thuộc
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-[#b0a59a]">
                          học
                        </span>
                      )}
                      <ChevronRight
                        size={14}
                        className="text-[#c4b7a8] group-hover:text-accent transition-colors"
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {deskIndex !== null && (
          <ReadingVocabStudyDesk
            items={activeWords}
            index={deskIndex}
            knownIds={knownIds}
            topicName={shortTopicName(activeTopic.topic_name)}
            onClose={() => setDeskIndex(null)}
            onIndexChange={setDeskIndex}
            onMarkKnown={markKnown}
            onMarkReview={markReview}
          />
        )}

        {quizOpen && (
          <ReadingVocabQuiz
            items={activeWords}
            topicName={shortTopicName(activeTopic.topic_name)}
            onClose={() => setQuizOpen(false)}
            onFinished={handleQuizFinished}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Section intro */}
      <div className="relative overflow-hidden rounded-[22px] px-5 py-5 sm:px-6 border border-black/[0.05] dark:border-white/[0.07] bg-[#ebe4d8]/55 dark:bg-[#1a1714]/60">
        <div
          className="pointer-events-none absolute right-3 bottom-[-18px] font-serif text-[88px] leading-none text-[#1f1a16]/[0.05] dark:text-white/[0.05] select-none"
          aria-hidden
        >
          語彙
        </div>
        <p className="text-[10px] font-bold tracking-[0.16em] text-accent uppercase">
          語彙レッスン
        </p>
        <h2 className="font-serif font-bold text-[1.4rem] sm:text-2xl text-[#1f1a16] dark:text-[#f5f0eb] mt-1 leading-tight">
          Từ vựng theo chủ đề
        </h2>
        <p className="text-[13px] text-[#70665a] dark:text-[#b8aba0] mt-2 max-w-md leading-relaxed">
          {topics.length} chủ đề đọc hiểu · {totalWords} từ. Chọn nhóm → học thẻ
          hoặc quiz.
        </p>
        <div className="mt-4 flex items-end gap-3">
          <div className="flex-1 max-w-[200px]">
            <div className="h-1.5 rounded-full bg-black/[0.07] dark:bg-white/[0.1] overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
          <p className="text-[12px] font-bold text-accent-muted tabular-nums">
            {totalKnown}/{totalWords}
            <span className="font-semibold text-[#8a8074]"> · {overallPct}%</span>
          </p>
        </div>
      </div>

      {/* Topics */}
      <ol className="space-y-2.5">
        {topics.map((topic, i) => {
          const words = flattenTopicWords(topic);
          const known = words.filter((w) => knownIds.has(w.id)).length;
          const pct =
            words.length > 0 ? Math.round((known / words.length) * 100) : 0;
          const best = quizBest[String(topic.topic_id)];
          const samples = words.slice(0, 3).map((w) => w.word);
          const hint = jpHint(topic.topic_name);

          return (
            <li key={topic.topic_id}>
              <button
                type="button"
                onClick={() => openTopic(topic.topic_id)}
                style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
                className="kanji-tile-enter group w-full text-left rounded-[18px] border border-black/[0.05] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/88 px-4 py-3.5 sm:px-5 hover:border-accent-border hover:shadow-[0_10px_28px_rgba(0,0,0,0.05)] transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex gap-3.5">
                  <span className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] bg-accent/10 text-accent font-serif font-bold text-[15px] flex items-center justify-center tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {hint && (
                          <p className="text-[10px] font-bold text-accent/80 mb-0.5 truncate">
                            {hint}
                          </p>
                        )}
                        <p className="font-serif font-bold text-[15px] sm:text-[16px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                          {shortTopicName(topic.topic_name)}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="shrink-0 mt-1 text-[#c4b7a8] group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                      />
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#8a8074]">
                      <span className="font-semibold tabular-nums">
                        {words.length} từ
                      </span>
                      {known > 0 && (
                        <>
                          <span className="opacity-40">·</span>
                          <span className="text-accent-muted font-semibold">
                            {known} thuộc
                          </span>
                        </>
                      )}
                      {best != null && (
                        <>
                          <span className="opacity-40">·</span>
                          <span>Quiz {best}%</span>
                        </>
                      )}
                    </div>

                    <div className="mt-2.5 flex items-center gap-3">
                      <div className="flex-1 h-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent/80"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-accent-muted tabular-nums w-8 text-right">
                        {pct}%
                      </span>
                    </div>

                    {samples.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {samples.map((s) => (
                          <span
                            key={s}
                            className="font-serif text-[13px] px-2 py-0.5 rounded-[8px] bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#5e554c] dark:text-[#c4b7a8]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
