import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Lightbulb,
  BookOpen,
  AlertTriangle,
  FileText,
  Link2,
  ChevronRight,
  PenTool,
} from "lucide-react";
import { FavoriteButton, AudioPlayButton } from "@/components/GrammarClientActions";
import grammarDataRaw from "../../../../public/data/grammar.json";
import type { GrammarData, Grammar, Category } from "@/lib/types";

const data = grammarDataRaw as GrammarData;

export async function generateStaticParams() {
  return data.grammar.map((g) => ({
    id: g.id,
  }));
}

export default async function GrammarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const decodedId = decodeURIComponent(rawId);

  // Find grammar item and category
  const grammar: Grammar =
    data.grammar.find((g) => g.id === decodedId || g.id === rawId) ||
    data.grammar[0];

  const category: Category =
    data.categories.find((c) => c.id === grammar.categoryId) ||
    data.categories[0];

  // Find next grammar in list
  const currentIndex = data.grammar.findIndex((g) => g.id === grammar.id);
  const nextGrammar =
    currentIndex >= 0 && currentIndex < data.grammar.length - 1
      ? data.grammar[currentIndex + 1]
      : data.grammar[0];

  return (
    <div
      suppressHydrationWarning
      className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8"
    >
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with back button */}
        <Header backHref="/" backLabel="一覧に戻る" />

        {/* Content Body */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {/* Hero Banner with Cherry Blossoms & Mt. Fuji */}
          <div className="relative overflow-hidden rounded-[20px] sm:rounded-[26px] bg-gradient-to-r from-[#d9e8ef] via-[#f3e8e2] to-[#faeee8] dark:from-[#1b2b36] dark:via-[#2b2220] dark:to-[#382321] border border-black/[0.06] dark:border-white/[0.09] ios-card-shadow mb-4 sm:mb-6 p-5 sm:p-8 transition-colors">
            {/* Background art */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80"
                alt="Cherry blossoms and Fuji"
                className="w-full h-full object-cover object-[center_35%] opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f5]/92 dark:from-[#14110f]/92 via-[#fbf8f5]/65 dark:via-[#14110f]/65 to-transparent" />
            </div>

            {/* Vertical calligraphy poem on the right */}
            <div className="absolute right-4 sm:right-12 top-5 sm:top-8 hidden sm:flex flex-col text-[12px] sm:text-[13px] text-[#786c5e] dark:text-[#a39789] font-serif tracking-widest writing-vertical-lr select-none space-y-2 pointer-events-none">
              <span className="leading-relaxed">その青い景色が</span>
              <span className="leading-relaxed">見える。</span>
              <span className="text-xl">🌸</span>
            </div>

            {/* Banner Content */}
            <div className="relative z-10 max-w-xl">
              {/* Category tag - iOS Pill */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-black/[0.05] dark:bg-white/[0.1] backdrop-blur-md text-[#a44d36] dark:text-[#f39882] text-[11px] font-semibold tracking-wider mb-3 sm:mb-4 shadow-2xs">
                <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#df6e53] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-bold shadow-xs">
                  {category.roman}
                </span>
                <span>{category.name}</span>
              </div>

              {/* Title with Furigana */}
              <div className="mb-1.5 sm:mb-2">
                {grammar.furigana ? (
                  <h1 className="font-serif font-black text-2xl sm:text-4xl lg:text-5xl text-[#1e1915] dark:text-[#f5ede5] tracking-tight flex items-baseline gap-1">
                    <span>{grammar.prefix || "〜"}</span>
                    <ruby className="ruby-position-over">
                      {grammar.mainWord || grammar.title}
                      <rt className="text-xs sm:text-sm font-sans font-normal text-[#7b6f63] dark:text-[#aaa093] tracking-normal">
                        {grammar.furigana}
                      </rt>
                    </ruby>
                    <span>{grammar.suffix || ""}</span>
                  </h1>
                ) : (
                  <h1 className="font-serif font-black text-2xl sm:text-4xl lg:text-5xl text-[#1e1915] dark:text-[#f5ede5] tracking-tight">
                    {grammar.title}
                  </h1>
                )}
              </div>

              {/* Meaning Subtitle */}
              <p className="font-sans font-medium text-sm sm:text-lg text-[#52473c] dark:text-[#c4b7a8] mb-3.5 sm:mb-4.5 leading-relaxed">
                {grammar.meaning}
              </p>

              {/* Badges: JLPT N2 + Favorite Client Button */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-white/[0.12] backdrop-blur-md border border-black/[0.06] dark:border-white/[0.12] text-xs font-bold text-[#554a3e] dark:text-[#ded2c3] shadow-xs">
                  {grammar.level}
                </span>

                <FavoriteButton grammarId={grammar.id} />
              </div>
            </div>
          </div>

          {/* Main Grid: Left Column + Right Column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left 2 Columns */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              {/* 1. Ý nghĩa */}
              <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] rounded-[20px] sm:rounded-[22px] p-4.5 sm:p-6 ios-card-shadow">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1f1a16] dark:text-[#f5f0eb] mb-2">
                  <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#ff9f0a]/15 text-[#d48222] dark:text-[#ff9f0a] flex items-center justify-center">
                    <Lightbulb size={15} strokeWidth={2.2} />
                  </div>
                  <span>Ý nghĩa</span>
                </div>
                <p className="text-[13px] sm:text-sm text-[#4d433a] dark:text-[#cfc2b4] leading-relaxed pl-1">
                  {grammar.meaningDetail}
                </p>
              </div>

              {/* 2. Cách dùng */}
              <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] rounded-[20px] sm:rounded-[22px] p-4.5 sm:p-6 ios-card-shadow">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1f1a16] dark:text-[#f5f0eb] mb-3">
                  <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#0071e3]/12 text-[#0071e3] dark:text-[#2997ff] flex items-center justify-center">
                    <BookOpen size={15} strokeWidth={2.2} />
                  </div>
                  <span>Cách dùng</span>
                </div>

                {/* Pattern Box */}
                <div className="bg-gradient-to-r from-[#faeee8] to-[#fbf3ed] dark:from-[#352520] dark:to-[#3d2720] border border-[#f0ded3] dark:border-[#523830] rounded-[14px] sm:rounded-[16px] p-3.5 sm:p-4 mb-3.5 text-center shadow-2xs">
                  <span className="font-serif font-bold text-sm sm:text-lg text-[#ad4d36] dark:text-[#f39882] tracking-wide break-words">
                    {grammar.usage.pattern}
                  </span>
                </div>

                {/* Primary Example sentence */}
                <div className="bg-black/[0.025] dark:bg-black/[0.3] rounded-[14px] sm:rounded-[16px] p-3.5 sm:p-4.5 border border-black/[0.04] dark:border-white/[0.06]">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="text-[11px] font-semibold text-[#8e8275] dark:text-[#9e9285] uppercase tracking-wider">
                      Ví dụ chính:
                    </div>
                    <AudioPlayButton text={grammar.usage.exampleJp} />
                  </div>
                  <div className="font-bold text-[14px] sm:text-base text-[#1e1915] dark:text-[#f5f0eb] mb-1 leading-snug">
                    {grammar.usage.exampleJp}
                  </div>
                  <div className="text-[11px] text-[#8c8072] dark:text-[#9e9285] font-mono mb-1 leading-tight">
                    {grammar.usage.exampleReading}
                  </div>
                  <div className="text-xs sm:text-sm text-[#5a4f44] dark:text-[#baa998] leading-relaxed">
                    {grammar.usage.exampleVn}
                  </div>
                </div>
              </div>

              {/* 3. Lưu ý */}
              {grammar.notes && grammar.notes.length > 0 && (
                <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] rounded-[20px] sm:rounded-[22px] p-4.5 sm:p-6 ios-card-shadow">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1f1a16] dark:text-[#f5f0eb] mb-2.5">
                    <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#ff3b30]/12 text-[#ff3b30] flex items-center justify-center">
                      <AlertTriangle size={15} strokeWidth={2.2} />
                    </div>
                    <span>Lưu ý</span>
                  </div>
                  <ul className="space-y-2 pl-1">
                    {grammar.notes.map((note, index) => (
                      <li
                        key={index}
                        className="text-xs sm:text-sm text-[#4e443b] dark:text-[#cfc2b4] flex items-start gap-2 leading-relaxed"
                      >
                        <span className="text-[#ff9f0a] font-bold text-sm shrink-0">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 4. Ví dụ khác */}
              {grammar.examples && grammar.examples.length > 0 && (
                <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] rounded-[20px] sm:rounded-[22px] p-4.5 sm:p-6 ios-card-shadow">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1f1a16] dark:text-[#f5f0eb] mb-3">
                    <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#34c759]/12 text-[#34c759] flex items-center justify-center">
                      <FileText size={15} strokeWidth={2.2} />
                    </div>
                    <span>Ví dụ khác</span>
                  </div>

                  <div className="space-y-3.5 divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                    {grammar.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`${idx > 0 ? "pt-3.5" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="text-[13px] sm:text-sm font-bold text-[#221c18] dark:text-[#f5f0eb] flex items-start gap-1.5 leading-snug">
                            <span className="text-[#968a7d] text-xs mt-0.5">•</span>
                            <span>{ex.jp}</span>
                          </div>
                          <AudioPlayButton text={ex.jp} size="sm" />
                        </div>
                        <div className="text-[11px] text-[#8c8072] dark:text-[#9e9285] font-mono pl-3 mb-0.5 leading-tight">
                          {ex.reading}
                        </div>
                        <div className="text-xs text-[#5e5348] dark:text-[#c4b7a8] pl-3 leading-relaxed">
                          {ex.vn}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Liên quan */}
              {grammar.related && grammar.related.length > 0 && (
                <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] rounded-[20px] sm:rounded-[22px] p-4.5 sm:p-6 ios-card-shadow">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1f1a16] dark:text-[#f5f0eb] mb-2.5">
                    <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#5856d6]/12 text-[#5856d6] flex items-center justify-center">
                      <Link2 size={15} strokeWidth={2.2} />
                    </div>
                    <span>Liên quan</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {grammar.related.map((rel, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#3e5f7e] dark:text-[#9ec4eb] text-xs font-semibold border border-black/[0.04] dark:border-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] active:scale-95 transition-all cursor-pointer"
                      >
                        {rel}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer navigation */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/"
                  className="px-4 py-2.5 rounded-full bg-white dark:bg-[#231e1b] border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-xs sm:text-sm font-semibold text-[#5a5044] dark:text-[#c4b7a8] active:scale-95 transition-all shadow-2xs"
                >
                  ← 文法一覧
                </Link>

                <Link
                  href={`/grammar/${nextGrammar.id}`}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0062c4] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-[#0071e3]/30 transition-all"
                >
                  <span>次の文法</span>
                  <ChevronRight size={16} strokeWidth={2.3} />
                </Link>
              </div>
            </div>

            {/* Right Column (iOS Widgets on Mobile stack naturally) */}
            <div className="space-y-4 sm:space-y-5">
              {/* Widget 1: Ví dụ minh họa */}
              <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] rounded-[20px] sm:rounded-[22px] p-4.5 sm:p-5 ios-card-shadow overflow-hidden">
                <h3 className="font-serif font-bold text-sm text-[#1f1a16] dark:text-[#f5f0eb] mb-2.5">
                  Ví dụ minh họa
                </h3>
                <div className="relative h-40 sm:h-44 rounded-[14px] sm:rounded-[16px] overflow-hidden bg-black/[0.05] dark:bg-white/[0.05] mb-2.5 shadow-xs group">
                  <img
                    src={
                      grammar.illustrationImage ||
                      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80"
                    }
                    alt="Illustration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <AudioPlayButton
                    text={grammar.usage.exampleJp}
                    size="lg"
                    className="absolute inset-0 m-auto"
                  />
                </div>
                <div className="text-xs text-[#221c18] dark:text-[#f5f0eb] font-semibold leading-relaxed mb-0.5">
                  {grammar.usage.exampleJp}
                </div>
                <div className="text-[11px] text-[#8c8072] dark:text-[#9e9285] font-mono leading-relaxed mb-1">
                  {grammar.usage.exampleReading}
                </div>
                <div className="text-xs text-[#63574c] dark:text-[#c4b7a8] leading-relaxed">
                  {grammar.usage.exampleVn}
                </div>
              </div>

              {/* Widget 2: Ghi nhớ */}
              <div className="bg-[#fcf7ee]/95 dark:bg-[#2c2217]/90 ios-glass border border-[#eddabf] dark:border-[#4d3923] rounded-[20px] sm:rounded-[22px] p-4.5 sm:p-5 ios-card-shadow">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#b56e1b] dark:text-[#f3b567] mb-2">
                  <PenTool size={14} />
                  <span>Ghi nhớ</span>
                </div>
                <div className="text-xs text-[#524129] dark:text-[#dfcaa7] leading-relaxed whitespace-pre-line font-serif">
                  {grammar.memo ||
                    `「${grammar.title}」は、特別な時、機会、状況を表すときに使われます。\n\nDùng để diễn tả thời điểm, cơ hội, tình huống đặc biệt.`}
                </div>
              </div>

              {/* Widget 3: Sleeping cat & Zen proverb quote */}
              <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] rounded-[20px] sm:rounded-[22px] p-4.5 sm:p-5 ios-card-shadow overflow-hidden text-center">
                <div className="relative h-32 sm:h-36 rounded-[14px] sm:rounded-[16px] overflow-hidden bg-black/[0.04] dark:bg-white/[0.05] mb-3.5 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80"
                    alt="Sleeping cat"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-serif text-[#65594e] dark:text-[#b3a596] text-xs sm:text-sm tracking-widest leading-loose">
                  <p>少しずつでいい。</p>
                  <p>続けることが、</p>
                  <p className="flex items-center justify-center gap-1.5 mt-0.5">
                    <span>力になる。</span>
                    <span className="w-4 h-4 rounded-xs border border-[#cf5e4f] text-[#cf5e4f] text-[9px] flex items-center justify-center font-serif shadow-2xs">
                      印
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
