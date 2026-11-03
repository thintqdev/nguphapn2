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

const box =
  "rounded-[16px] border border-black/[0.07] dark:border-white/[0.09] bg-white/90 dark:bg-[#1a1714]/90 p-4 sm:p-5";

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

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-3.5 animate-fade-in">
          <PageBackLink href="/" label="Danh sách ngữ pháp" />

          {/* Header card */}
          <header className={`${box} space-y-3`}>
            <p className="text-[11px] font-bold text-[#df6e53] dark:text-[#f39882]">
              {category.roman}. {category.nameVn || category.name}
            </p>

            {grammar.furigana ? (
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#1f1a16] dark:text-[#f5f0eb] tracking-tight">
                <span>{grammar.prefix || "〜"}</span>
                <ruby>
                  {grammar.mainWord || grammar.title}
                  <rt className="text-xs font-sans font-normal text-[#8a8074]">
                    {grammar.furigana}
                  </rt>
                </ruby>
                <span>{grammar.suffix || ""}</span>
              </h1>
            ) : (
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#1f1a16] dark:text-[#f5f0eb] tracking-tight">
                {grammar.title}
              </h1>
            )}

            <p className="text-sm sm:text-base text-[#5e554c] dark:text-[#c4b7a8] leading-relaxed">
              {grammar.meaning}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#8a8074]">
                {grammar.level}
              </span>
              <FavoriteButton grammarId={grammar.id} />
            </div>
          </header>

          {/* Meaning */}
          <section className={box}>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] mb-2">
              Ý nghĩa
            </h2>
            <p className="text-sm text-[#3d3630] dark:text-[#d4c8bc] leading-relaxed">
              {grammar.meaningDetail}
            </p>
          </section>

          {/* Usage */}
          <section className={`${box} space-y-3`}>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074]">
              Cách dùng
            </h2>
            <p className="font-serif text-center text-base sm:text-lg font-bold text-[#df6e53] dark:text-[#f39882] py-2.5 px-3 rounded-[12px] bg-[#df6e53]/08 dark:bg-[#df6e53]/12">
              {grammar.usage.pattern}
            </p>
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-serif text-[15px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                  {grammar.usage.exampleJp}
                </p>
                <AudioPlayButton text={grammar.usage.exampleJp} size="sm" />
              </div>
              <p className="text-[12px] text-[#8a8074]">
                {grammar.usage.exampleReading}
              </p>
              <p className="text-[13px] text-[#70665a] dark:text-[#b8aba0]">
                {grammar.usage.exampleVn}
              </p>
            </div>
          </section>

          {/* Notes */}
          {grammar.notes && grammar.notes.length > 0 && (
            <section className={box}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] mb-2">
                Lưu ý
              </h2>
              <ul className="space-y-1.5">
                {grammar.notes.map((note, index) => (
                  <li
                    key={index}
                    className="text-sm text-[#3d3630] dark:text-[#d4c8bc] leading-relaxed pl-3 border-l-2 border-[#df6e53]/35"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Examples */}
          {grammar.examples && grammar.examples.length > 0 && (
            <section className={box}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] mb-3">
                Ví dụ
              </h2>
              <div className="space-y-3.5">
                {grammar.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className={
                      idx > 0
                        ? "pt-3.5 border-t border-black/[0.05] dark:border-white/[0.06]"
                        : ""
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-serif text-[14px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                        {ex.jp}
                      </p>
                      <AudioPlayButton text={ex.jp} size="sm" />
                    </div>
                    <p className="text-[12px] text-[#8a8074] mt-0.5">
                      {ex.reading}
                    </p>
                    <p className="text-[13px] text-[#70665a] dark:text-[#b8aba0]">
                      {ex.vn}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Memo */}
          {grammar.memo && (
            <section className={box}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] mb-2">
                Ghi nhớ
              </h2>
              <p className="text-sm text-[#5e554c] dark:text-[#c4b7a8] leading-relaxed whitespace-pre-line">
                {grammar.memo}
              </p>
            </section>
          )}

          {/* Related */}
          {relatedItems.length > 0 && (
            <section className={box}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] mb-2.5">
                Liên quan
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedItems.map(({ label, hit }) =>
                  hit ? (
                    <Link
                      key={label}
                      href={`/grammar/${hit.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-[10px] border border-[#df6e53]/25 bg-[#df6e53]/08 text-[13px] font-medium text-[#a44d36] dark:text-[#f39882] hover:bg-[#df6e53]/15 active:scale-95 transition-all"
                    >
                      {label}
                    </Link>
                  ) : (
                    <span
                      key={label}
                      className="px-3 py-1.5 rounded-[10px] bg-black/[0.04] dark:bg-white/[0.06] text-[13px] font-medium text-[#8a8074]"
                    >
                      {label}
                    </span>
                  )
                )}
              </div>
            </section>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between pt-1 pb-2">
            {prevGrammar ? (
              <Link
                href={`/grammar/${prevGrammar.id}`}
                className="inline-flex items-center gap-0.5 text-sm font-semibold text-[#df6e53] dark:text-[#f39882]"
              >
                <ChevronLeft size={17} />
                Trước
              </Link>
            ) : (
              <span />
            )}
            {nextGrammar ? (
              <Link
                href={`/grammar/${nextGrammar.id}`}
                className="inline-flex items-center gap-0.5 text-sm font-semibold text-[#df6e53] dark:text-[#f39882]"
              >
                Tiếp
                <ChevronRight size={17} />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
