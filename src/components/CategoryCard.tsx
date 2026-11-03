"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Star } from "lucide-react";
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

  return (
    <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3.5 sm:p-4 text-left cursor-pointer active:bg-black/[0.02] dark:active:bg-white/[0.03] transition-colors"
      >
        <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-serif font-bold text-sm bg-[#df6e53]/12 text-[#a44d36] dark:text-[#f39882]">
          {category.roman}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#1f1a16] dark:text-[#f5f0eb]">
              {category.nameVn || category.name}
            </h3>
            <span className="text-[11px] font-semibold text-[#8a8074]">
              {category.count}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#8a8074] dark:text-[#9e9285] truncate mt-0.5">
            {category.preview}
          </p>
        </div>

        <span className="text-[#c4b7a8] shrink-0">
          {isExpanded ? (
            <ChevronDown size={18} strokeWidth={2.2} />
          ) : (
            <ChevronRight size={18} strokeWidth={2.2} />
          )}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-black/[0.05] dark:border-white/[0.06] px-3 py-2.5 sm:px-4 space-y-1">
          {grammarList.map((g, idx) => {
            const fav = isFavorite(g.id);
            return (
              <div
                key={g.id}
                className="flex items-center gap-2 py-2 px-1.5 rounded-[10px] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              >
                <Link href={`/grammar/${g.id}`} className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#1f1a16] dark:text-[#f5f0eb]">
                    {idx + 1}. {g.title}
                  </p>
                  <p className="text-[11px] text-[#8a8074] truncate">
                    {g.meaning}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(g.id);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#c4b7a8] hover:text-[#df6e53] cursor-pointer"
                  aria-label="Favorite"
                >
                  <Star
                    size={15}
                    className={
                      fav ? "fill-[#df6e53] text-[#df6e53]" : ""
                    }
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
