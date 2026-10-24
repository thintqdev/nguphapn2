"use client";

import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HomeHeroBanner from "@/components/HomeHeroBanner";
import CategoryTabs from "@/components/CategoryTabs";
import CategoryCard from "@/components/CategoryCard";
import KeigoView from "@/components/keigo/KeigoView";
import grammarDataRaw from "../../public/data/grammar.json";
import { keigoData } from "@/lib/keigo";
import type { GrammarData } from "@/lib/types";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";

const data = grammarDataRaw as GrammarData;

export default function HomePage() {
  const [mainMode, setMainMode] = useState<"grammar" | "keigo">("grammar");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Safely check query params on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "keigo" || params.get("mode") === "keigo") {
        setMainMode("keigo");
      }
    }
  }, []);

  // Filter categories and grammar
  const filteredCategories = useMemo(() => {
    let cats = data.categories;

    if (selectedCategoryId !== "all") {
      cats = cats.filter((c) => c.id === selectedCategoryId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      cats = cats.filter((c) => {
        const matchCat =
          c.name.toLowerCase().includes(q) ||
          c.preview.toLowerCase().includes(q) ||
          c.nameVn.toLowerCase().includes(q);

        const hasMatchingGrammar = data.grammar.some(
          (g) =>
            g.categoryId === c.id &&
            (g.title.toLowerCase().includes(q) ||
              g.reading.toLowerCase().includes(q) ||
              g.meaning.toLowerCase().includes(q) ||
              g.meaningDetail.toLowerCase().includes(q))
        );

        return matchCat || hasMatchingGrammar;
      });
    }

    return cats;
  }, [selectedCategoryId, searchQuery]);

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* iOS Translucent Navigation Bar */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {/* Hero Banner with Mt. Fuji & Cherry Blossoms */}
          <HomeHeroBanner />

          {/* Primary Mode Switcher: Grammar vs Keigo */}
          <div className="flex items-center justify-center mb-5 sm:mb-6">
            <div className="inline-flex p-1 rounded-[18px] bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] shadow-xs select-none">
              <button
                type="button"
                onClick={() => setMainMode("grammar")}
                className={`px-4 sm:px-6 py-2 rounded-[14px] text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  mainMode === "grammar"
                    ? "bg-white dark:bg-[#201d19] text-[#1f1a16] dark:text-[#f5f0eb] shadow-xs"
                    : "text-[#70665a] dark:text-[#a09486] hover:text-[#1f1a16] dark:hover:text-[#f5f0eb]"
                }`}
              >
                <BookOpen
                  size={16}
                  className={
                    mainMode === "grammar"
                      ? "text-[#df6e53] dark:text-[#f39882]"
                      : ""
                  }
                />
                <span>N2 文法一覧 (99)</span>
              </button>

              <button
                type="button"
                onClick={() => setMainMode("keigo")}
                className={`px-4 sm:px-6 py-2 rounded-[14px] text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  mainMode === "keigo"
                    ? "bg-[#df6e53] text-white shadow-xs"
                    : "text-[#70665a] dark:text-[#a09486] hover:text-[#1f1a16] dark:hover:text-[#f5f0eb]"
                }`}
              >
                <Sparkles size={16} />
                <span>敬語・謙譲語 (19+)</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    mainMode === "keigo"
                      ? "bg-white/20 text-white"
                      : "bg-[#df6e53]/15 text-[#df6e53] dark:text-[#f39882]"
                  }`}
                >
                  Mới
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Rendering: Grammar list OR Keigo view */}
          {mainMode === "grammar" ? (
            <div>
              {/* Quick Prompt Banner to Keigo */}
              <div
                onClick={() => setMainMode("keigo")}
                className="mb-5 p-3.5 sm:p-4 rounded-[18px] bg-gradient-to-r from-[#df6e53]/10 via-[#df6e53]/5 to-transparent dark:from-[#df6e53]/20 dark:via-[#df6e53]/10 border border-[#df6e53]/20 dark:border-[#df6e53]/30 flex items-center justify-between gap-3 cursor-pointer hover:border-[#df6e53]/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[12px] bg-[#df6e53] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[13.5px] text-[#1f1a16] dark:text-[#f5f0eb] flex items-center gap-1.5">
                      <span>Chuyên đề Kính ngữ N2 (敬語・謙譲語)</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#df6e53]/15 text-[#df6e53] dark:text-[#f39882] font-sans font-bold">
                        19 Động từ
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#70665a] dark:text-[#a09486] line-clamp-1">
                      Bảng tra cứu Tôn kính ngữ, Khiêm nhường ngữ Ⅰ & Ⅱ, công thức biến đổi và bẫy đề thi.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#df6e53] dark:text-[#f39882] shrink-0">
                  <span className="hidden sm:inline">Học ngay</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </div>
              </div>

              {/* iOS Segmented Control Category Tabs */}
              <CategoryTabs
                categories={data.categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />

              {/* iOS Inset Grouped Grammar Categories List */}
              <div className="space-y-3.5 mb-10">
                {filteredCategories.map((category) => {
                  const catGrammar = data.grammar.filter(
                    (g) => g.categoryId === category.id
                  );
                  return (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      grammarList={catGrammar}
                    />
                  );
                })}

                {filteredCategories.length === 0 && (
                  <div className="text-center py-14 bg-white/90 dark:bg-[#1f1b18]/90 ios-glass rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] text-[#8e8478] dark:text-[#9e9285] ios-card-shadow">
                    <p className="text-sm font-medium">
                      該当する文法が見つかりませんでした。
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategoryId("all");
                        setSearchQuery("");
                      }}
                      className="mt-3 text-xs text-[#0071e3] dark:text-[#2997ff] font-semibold hover:underline cursor-pointer"
                    >
                      条件をリセット
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Keigo Interactive View */
            <KeigoView data={keigoData} />
          )}

          {/* Footer Zen Proverb */}
          <div className="text-center py-8 text-[#988e83] dark:text-[#7f7468] font-serif text-xs tracking-widest border-t border-black/[0.06] dark:border-white/[0.07] mt-8">
            ― 「継続は力なり」 ―
          </div>
        </main>
      </div>
    </div>
  );
}
