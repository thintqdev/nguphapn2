"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "keigo" || params.get("mode") === "keigo") {
        setMainMode("keigo");
      }
    }
  }, []);

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
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <HomeHeroBanner />

          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <div className="inline-flex p-1 rounded-[14px] bg-black/[0.04] dark:bg-white/[0.06] select-none">
              <button
                type="button"
                onClick={() => setMainMode("grammar")}
                className={`px-3.5 sm:px-4 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  mainMode === "grammar"
                    ? "bg-white dark:bg-[#201d19] text-[#1f1a16] dark:text-[#f5f0eb] shadow-xs"
                    : "text-[#70665a] dark:text-[#a09486]"
                }`}
              >
                <BookOpen size={14} />
                Ngữ pháp
              </button>
              <button
                type="button"
                onClick={() => setMainMode("keigo")}
                className={`px-3.5 sm:px-4 py-1.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  mainMode === "keigo"
                    ? "bg-white dark:bg-[#201d19] text-[#1f1a16] dark:text-[#f5f0eb] shadow-xs"
                    : "text-[#70665a] dark:text-[#a09486]"
                }`}
              >
                <Sparkles size={14} />
                Kính ngữ
              </button>
            </div>
            <Link
              href="/exercise"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent"
            >
              Luyện tập
              <ArrowRight size={13} />
            </Link>
          </div>

          {mainMode === "grammar" ? (
            <div>
              <CategoryTabs
                categories={data.categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />

              <div className="space-y-2.5 mb-8">
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
                  <div className="text-center py-12 text-[#8a8074] text-sm">
                    <p>Không tìm thấy ngữ pháp phù hợp.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId("all");
                        setSearchQuery("");
                      }}
                      className="mt-2 text-accent font-semibold cursor-pointer"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <KeigoView data={keigoData} />
          )}
        </main>
      </div>
    </div>
  );
}
