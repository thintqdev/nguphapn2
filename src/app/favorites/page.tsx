"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Star, ChevronRight, BookOpen, Trash2 } from "lucide-react";
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
        <Header backHref="/" backLabel="文法一覧へ" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {/* iOS Card Banner */}
          <div className="bg-gradient-to-r from-[#fae7e1] to-[#f8ede8] dark:from-[#38231d] dark:to-[#2b1c18] border border-black/[0.06] dark:border-white/[0.09] rounded-[24px] p-6 sm:p-8 mb-6 ios-card-shadow transition-colors">
            <div className="flex items-center gap-3 text-[#df6e53] dark:text-[#f39882] mb-2">
              <Star size={26} className="fill-[#df6e53] dark:fill-[#f39882]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-black">
                お気に入り文法
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#73655a] dark:text-[#b5a799] font-serif">
              復習したい大切な文法ポイントを保存しています（{favoriteList.length}項目）
            </p>
          </div>

          {/* List of Favorites - iOS Inset Group */}
          <div className="space-y-3">
            {favoriteList.map((g) => {
              const category = data.categories.find(
                (c) => c.id === g.categoryId
              );
              return (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-4 sm:p-5 rounded-[20px] bg-white/90 dark:bg-[#1f1b18]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.14] ios-card-shadow active:scale-[0.99] transition-all group"
                >
                  <Link
                    href={`/grammar/${g.id}`}
                    className="flex items-center gap-3.5 min-w-0 pr-4 flex-1"
                  >
                    {category && (
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-serif font-bold shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: category.bgColor,
                          color: category.textColor,
                        }}
                      >
                        {category.roman}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-sm sm:text-base text-[#1e1915] dark:text-[#f5f0eb] group-hover:text-[#a44d36] dark:group-hover:text-[#f39882] transition-colors">
                        {g.title}
                      </div>
                      <div className="text-xs text-[#7e7367] dark:text-[#9e9285] mt-0.5 truncate">
                        {g.meaning}
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#786c5f] dark:text-[#b3a596]">
                      {g.level}
                    </span>

                    {/* Quick remove from favorites button */}
                    <button
                      onClick={() => toggleFavorite(g.id)}
                      title="お気に入りから削除"
                      type="button"
                      className="p-2 rounded-full text-black/30 dark:text-white/30 hover:text-[#ff3b30] dark:hover:text-[#ff453a] hover:bg-[#ff3b30]/10 active:scale-90 transition-all cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>

                    <Link
                      href={`/grammar/${g.id}`}
                      className="p-1.5 rounded-lg text-black/30 dark:text-white/30 group-hover:text-[#a44d36] dark:group-hover:text-[#f39882] transition-colors"
                    >
                      <ChevronRight size={18} strokeWidth={2.3} />
                    </Link>
                  </div>
                </div>
              );
            })}

            {favoriteList.length === 0 && (
              <div className="text-center py-16 bg-white/90 dark:bg-[#1f1b18]/90 ios-glass rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] text-[#8e8478] dark:text-[#9e9285] px-4 ios-card-shadow transition-colors">
                <Star
                  size={42}
                  className="mx-auto mb-3 text-black/20 dark:text-white/20 stroke-1"
                />
                <p className="text-sm font-semibold mb-1 dark:text-[#f5f0eb]">
                  お気に入りに登録された文法はまだありません。
                </p>
                <p className="text-xs text-[#9d9285] dark:text-[#887c70] mb-5">
                  文法詳細ページの「☆ お気に入り」ボタンを押して登録できます。
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold shadow-sm shadow-[#0071e3]/30 hover:bg-[#0062c4] active:scale-95 transition-all"
                >
                  <BookOpen size={15} />
                  <span>文法一覧へ戻る</span>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
