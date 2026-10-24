"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Sparkles, Star } from "lucide-react";
import { useFavorites } from "./FavoritesContext";
import type { Category, Grammar } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  grammarList: Grammar[];
}

export default function CategoryCard({
  category,
  grammarList,
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const firstGrammarId = grammarList[0]?.id || "sai-ni";

  return (
    <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.16] rounded-[18px] sm:rounded-[22px] overflow-hidden ios-card-shadow transition-all duration-200">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4.5 cursor-pointer select-none group active:bg-black/[0.02] dark:active:bg-white/[0.02] transition-colors"
      >
        {/* iOS App Icon Style Thumbnail */}
        <div className="w-13 h-13 sm:w-20 sm:h-16 rounded-[12px] sm:rounded-[15px] overflow-hidden shrink-0 bg-black/[0.05] dark:bg-white/[0.06] relative shadow-xs ring-1 ring-black/5 dark:ring-white/10">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
          />
        </div>

        {/* Roman Numeral circle badge */}
        <div
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center font-serif font-bold text-[11px] sm:text-sm shadow-xs ring-1 ring-black/5"
          style={{
            backgroundColor: category.bgColor,
            color: category.textColor,
          }}
        >
          {category.roman}
        </div>

        {/* Category info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
            <h3 className="font-serif font-bold text-[13px] sm:text-base text-[#1e1915] dark:text-[#f5f0eb] group-hover:text-[#a04b34] dark:group-hover:text-[#f39882] transition-colors leading-tight">
              {category.name}
            </h3>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#7c7165] dark:text-[#a89d91] bg-black/[0.04] dark:bg-white/[0.08] px-1.5 sm:px-2 py-0.5 rounded-full">
              {category.count}個
            </span>
          </div>

          {/* Preview list */}
          <p className="text-[11px] sm:text-xs text-[#8a7f72] dark:text-[#9e9285] truncate font-sans">
            {category.preview}
          </p>
        </div>

        {/* Action arrow button */}
        <div className="shrink-0 pl-1 text-black/30 dark:text-white/30 group-hover:text-black/60 dark:group-hover:text-white/70 transition-colors">
          {isExpanded ? (
            <ChevronDown size={18} strokeWidth={2.3} />
          ) : (
            <ChevronRight size={18} strokeWidth={2.3} />
          )}
        </div>
      </div>

      {/* Expanded iOS Grouped List */}
      {isExpanded && (
        <div className="bg-black/[0.02] dark:bg-black/[0.25] border-t border-black/[0.05] dark:border-white/[0.06] px-3 py-3 sm:px-6 sm:py-4 transition-colors">
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#8b7f71] dark:text-[#a69b8f] mb-2 sm:mb-2.5 flex items-center gap-1.5 px-1">
            <Sparkles size={12} className="text-[#a44d36] dark:text-[#f2947e]" />
            <span>収録文法ポイント（タップで学習）</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {grammarList.map((g, idx) => {
              const fav = isFavorite(g.id);
              return (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-[12px] sm:rounded-[14px] bg-white dark:bg-[#25201c] hover:bg-[#faf6f1] dark:hover:bg-[#2e2722] active:scale-[0.985] border border-black/[0.05] dark:border-white/[0.07] hover:border-black/[0.1] dark:hover:border-white/[0.14] text-xs transition-all shadow-2xs group/item min-h-[50px]"
                >
                  <Link
                    href={`/grammar/${g.id}`}
                    className="min-w-0 pr-2 flex-1"
                  >
                    <div className="font-bold text-[13px] sm:text-xs text-[#1f1a16] dark:text-[#f5f0eb] group-hover/item:text-[#a44d36] dark:group-hover/item:text-[#f2947e]">
                      {idx + 1}. {g.title}
                    </div>
                    <div className="text-[11px] text-[#7f7468] dark:text-[#9e9285] truncate mt-0.5">
                      {g.meaning}
                    </div>
                  </Link>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Quick favorite star toggle with good touch target */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(g.id);
                      }}
                      title={fav ? "お気に入り解除" : "お気に入りに追加"}
                      type="button"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-black/25 dark:text-white/25 hover:text-[#d48c3b] dark:hover:text-[#f5be58] active:scale-90 transition-all cursor-pointer"
                    >
                      <Star
                        size={16}
                        className={
                          fav
                            ? "fill-[#d48c3b] text-[#d48c3b] dark:fill-[#f5be58] dark:text-[#f5be58]"
                            : ""
                        }
                      />
                    </button>

                    <Link
                      href={`/grammar/${g.id}`}
                      className="w-6 h-6 flex items-center justify-center text-black/25 dark:text-white/25 group-hover/item:text-[#a44d36] dark:group-hover/item:text-[#f2947e]"
                    >
                      <ChevronRight size={16} strokeWidth={2.3} />
                    </Link>
                  </div>
                </div>
              );
            })}

            {grammarList.length === 0 && (
              <Link
                href={`/grammar/${firstGrammarId}`}
                className="col-span-full py-2.5 px-3 rounded-[12px] bg-white dark:bg-[#25201c] border border-black/[0.05] dark:border-white/[0.07] text-xs text-[#7f7468] dark:text-[#9e9285] hover:text-[#a44d36] dark:hover:text-[#f2947e] flex items-center justify-between"
              >
                <span>〜際（に）等の解説を見る</span>
                <ChevronRight size={15} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
