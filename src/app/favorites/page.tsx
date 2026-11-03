"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Star, Trash2 } from "lucide-react";
import { useFavorites } from "@/components/FavoritesContext";
import grammarDataRaw from "../../../public/data/grammar.json";
import type { GrammarData, Grammar } from "@/lib/types";

const data = grammarDataRaw as GrammarData;

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteList: Grammar[] = data.grammar.filter((g) =>
    favorites.includes(g.id)
  );

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-5 animate-fade-in">
          <div>
            <h1 className="font-serif font-bold text-2xl text-[#1f1a16] dark:text-[#f5f0eb]">
              お気に入り
            </h1>
            <p className="text-sm text-[#70665a] dark:text-[#b8aba0] mt-1">
              {favoriteList.length} ngữ pháp đã lưu
            </p>
          </div>

          <div className="space-y-2">
            {favoriteList.map((g) => {
              const category = data.categories.find(
                (c) => c.id === g.categoryId
              );
              return (
                <div
                  key={g.id}
                  className="flex items-center gap-3 p-3.5 rounded-[14px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90"
                >
                  <Link href={`/grammar/${g.id}`} className="min-w-0 flex-1">
                    {category && (
                      <p className="text-[10px] font-bold text-[#df6e53] dark:text-[#f39882] mb-0.5">
                        {category.roman}. {category.nameVn || category.name}
                      </p>
                    )}
                    <p className="font-semibold text-sm text-[#1f1a16] dark:text-[#f5f0eb]">
                      {g.title}
                    </p>
                    <p className="text-[12px] text-[#8a8074] truncate">
                      {g.meaning}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(g.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#df6e53] hover:bg-[#df6e53]/10 cursor-pointer"
                    aria-label="Bỏ yêu thích"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>

          {favoriteList.length === 0 && (
            <div className="text-center py-14 text-[#8a8074]">
              <Star size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Chưa có mục yêu thích.</p>
              <Link
                href="/"
                className="inline-block mt-3 text-sm font-semibold text-[#df6e53]"
              >
                Xem danh sách ngữ pháp
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
