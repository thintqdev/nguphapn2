"use client";

import type { Category } from "@/lib/types";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-2 scrollbar-none mb-4 sm:mb-6 p-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-xl sm:rounded-2xl border border-black/[0.03] dark:border-white/[0.05] max-w-full -mx-1 px-1 sm:mx-0">
      {/* "すべて" Tab */}
      <button
        onClick={() => onSelectCategory("all")}
        type="button"
        className={`shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap min-h-[36px] flex items-center justify-center ${
          selectedCategoryId === "all"
            ? "bg-white dark:bg-[#28221e] text-[#1f1a16] dark:text-[#f5f0eb] font-semibold shadow-xs ring-1 ring-black/5 dark:ring-white/10"
            : "text-[#6b6257] dark:text-[#9e9387] hover:text-[#1f1a16] dark:hover:text-white"
        }`}
      >
        すべて
      </button>

      {/* Individual Category Tabs */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            type="button"
            className={`shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap min-h-[36px] flex items-center justify-center ${
              isSelected
                ? "bg-white dark:bg-[#28221e] text-[#1f1a16] dark:text-[#f5f0eb] font-semibold shadow-xs ring-1 ring-black/5 dark:ring-white/10"
                : "text-[#6b6257] dark:text-[#9e9285] hover:text-[#1f1a16] dark:hover:text-white"
            }`}
          >
            {cat.shortName || cat.name}
          </button>
        );
      })}
    </div>
  );
}
