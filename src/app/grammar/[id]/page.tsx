import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PageBackLink from "@/components/PageBackLink";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  FavoriteButton,
  AudioPlayButton,
} from "@/components/GrammarClientActions";
import { findGrammarByRelatedLabel } from "@/lib/grammar";
import grammarDataRaw from "../../../../public/data/grammar.json";
import type { GrammarData, Grammar, Category } from "@/lib/types";

const data = grammarDataRaw as GrammarData;

export async function generateStaticParams() {
  return data.grammar.map((g) => ({ id: g.id }));
}

export default async function GrammarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const decodedId = decodeURIComponent(rawId);

  const grammar: Grammar =
    data.grammar.find((g) => g.id === decodedId || g.id === rawId) ||
    data.grammar[0];

  const category: Category =
    data.categories.find((c) => c.id === grammar.categoryId) ||
    data.categories[0];

  const currentIndex = data.grammar.findIndex((g) => g.id === grammar.id);
  const prevGrammar =
    currentIndex > 0 ? data.grammar[currentIndex - 1] : null;
  const nextGrammar =
    currentIndex >= 0 && currentIndex < data.grammar.length - 1
      ? data.grammar[currentIndex + 1]
      : null;

  const relatedItems = (grammar.related || []).map((label) => ({
    label,
    hit: findGrammarByRelatedLabel(label),
  }));

  const examples = (grammar.examples || []).slice(0, 2);
  const notes = (grammar.notes || []).slice(0, 3);
  const showDetailMeaning =
    grammar.meaningDetail &&
    grammar.meaningDetail.trim() !== grammar.meaning.trim();

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto animate-fade-in">
          <PageBackLink href="/" label="Danh sách ngữ pháp" />

          {/* One-screen detail panel */}
          <article className="rounded-[20px] border border-black/[0.07] dark:border-white/[0.09] bg-white/95 dark:bg-[#1a1714]/95 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 space-y-4">
              {/* Top meta */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-accent">
                    {category.roman}. {category.nameVn || category.name}
                  </p>
                  {grammar.furigana ? (
                    <h1 className="mt-1 font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb] tracking-tight leading-tight">
                      <span>{grammar.prefix || "〜"}</span>
                      <ruby>
                        {grammar.mainWord || grammar.title}
                        <rt className="text-[10px] font-sans font-normal text-[#8a8074]">
                          {grammar.furigana}
                        </rt>
                      </ruby>
                      <span>{grammar.suffix || ""}</span>
                    </h1>
                  ) : (
                    <h1 className="mt-1 font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb] tracking-tight">
                      {grammar.title}
                    </h1>
                  )}
                  <p className="mt-1.5 text-[13px] sm:text-sm text-[#5e554c] dark:text-[#c4b7a8] leading-snug">
                    {grammar.meaning}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#8a8074]">
                    {grammar.level}
                  </span>
                  <FavoriteButton grammarId={grammar.id} />
                </div>
              </div>

              {showDetailMeaning && (
                <p className="text-[12px] sm:text-[13px] text-[#70665a] dark:text-[#b8aba0] leading-relaxed">
                  {grammar.meaningDetail}
                </p>
              )}

              {/* Pattern + primary example */}
              <div className="rounded-[14px] bg-accent-soft border border-accent-border px-3.5 py-3 space-y-2.5">
                <p className="font-serif text-center text-[15px] sm:text-base font-bold text-accent">
                  {grammar.usage.pattern}
                </p>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-serif text-[14px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                      {grammar.usage.exampleJp}
                    </p>
                    <p className="text-[11px] text-[#8a8074] mt-0.5">
                      {grammar.usage.exampleReading}
                    </p>
                    <p className="text-[12px] text-[#70665a] dark:text-[#b8aba0]">
                      {grammar.usage.exampleVn}
                    </p>
                  </div>
                  <AudioPlayButton text={grammar.usage.exampleJp} size="sm" />
                </div>
              </div>

              {/* Extra examples — compact */}
              {examples.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a8074]">
                    Ví dụ
                  </p>
                  {examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-serif text-[13px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                          {ex.jp}
                        </p>
                        <p className="text-[11px] text-[#8a8074]">
                          {ex.reading}
                          {ex.vn ? ` · ${ex.vn}` : ""}
                        </p>
                      </div>
                      <AudioPlayButton text={ex.jp} size="sm" />
                    </div>
                  ))}
                </div>
              )}

              {/* Notes + memo — one block */}
              {(notes.length > 0 || grammar.memo) && (
                <div className="space-y-1.5 pt-1 border-t border-black/[0.05] dark:border-white/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a8074]">
                    Lưu ý
                  </p>
                  {notes.map((note, index) => (
                    <p
                      key={index}
                      className="text-[12px] sm:text-[13px] text-[#3d3630] dark:text-[#d4c8bc] leading-snug pl-2.5 border-l-2 border-accent-border"
                    >
                      {note}
                    </p>
                  ))}
                  {grammar.memo && (
                    <p className="text-[12px] text-[#5e554c] dark:text-[#c4b7a8] leading-snug whitespace-pre-line">
                      {grammar.memo}
                    </p>
                  )}
                </div>
              )}

              {/* Related */}
              {relatedItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {relatedItems.map(({ label, hit }) =>
                    hit ? (
                      <Link
                        key={label}
                        href={`/grammar/${hit.id}`}
                        className="inline-flex items-center px-2.5 py-1 rounded-[8px] border border-accent-border bg-accent/10 text-[12px] font-medium text-accent-muted hover:bg-accent/15 active:scale-95 transition-all"
                      >
                        {label}
                      </Link>
                    ) : (
                      <span
                        key={label}
                        className="px-2.5 py-1 rounded-[8px] bg-black/[0.04] dark:bg-white/[0.06] text-[12px] font-medium text-[#8a8074]"
                      >
                        {label}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-black/[0.05] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.02]">
              {prevGrammar ? (
                <Link
                  href={`/grammar/${prevGrammar.id}`}
                  className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-accent"
                >
                  <ChevronLeft size={16} />
                  Trước
                </Link>
              ) : (
                <span />
              )}
              {nextGrammar ? (
                <Link
                  href={`/grammar/${nextGrammar.id}`}
                  className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-accent"
                >
                  Tiếp
                  <ChevronRight size={16} />
                </Link>
              ) : (
                <span />
              )}
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
