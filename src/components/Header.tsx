"use client";

import { Moon, Sun, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import GlobalSearch from "./GlobalSearch";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  backHref?: string;
  backLabel?: string;
}

export default function Header({
  searchQuery = "",
  onSearchChange,
  backHref,
  backLabel = "一覧に戻る",
}: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 ios-glass bg-[#faf7f2]/85 dark:bg-[#14110f]/85 border-b border-black/[0.06] dark:border-white/[0.08] px-3.5 sm:px-7 py-2.5 sm:py-3 transition-all duration-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Back button or Mobile Logo / Subtitle */}
        <div className="shrink-0">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 text-[13px] sm:text-sm font-semibold text-[#df6e53] dark:text-[#f39882] hover:opacity-75 active:scale-95 transition-all py-1 px-2 -ml-1 rounded-xl"
            >
              <ChevronLeft size={18} strokeWidth={2.5} className="-ml-1" />
              <span>{backLabel}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              {/* Mobile tiny logo icon */}
              <div className="md:hidden w-7 h-7 rounded-[8px] bg-gradient-to-tr from-[#df6e53] to-[#ef927c] flex items-center justify-center text-white font-serif font-black text-xs shadow-xs">
                文
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#1e1915] dark:text-[#f5f0eb] md:text-[#867d74] md:dark:text-[#9e9387]">
                  N2 文法
                </span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#c4b7a8] dark:bg-[#52473e]" />
                <span className="text-xs text-[#867d74] dark:text-[#9e9285] font-medium hidden sm:inline">
                  日本語文法学習
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right controls: Universal Search Bar + Capsule Theme Switcher */}
        <div className="flex items-center gap-2 flex-1 justify-end max-w-xs sm:max-w-none">
          {/* Universal Search across all pages */}
          <div className="flex-1 sm:w-72 max-w-[210px] sm:max-w-none">
            <GlobalSearch
              initialQuery={searchQuery}
              onQueryChange={onSearchChange}
            />
          </div>

          {/* iOS Capsule Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] active:scale-90 text-[#554d45] dark:text-[#d1c5b8] transition-all cursor-pointer shadow-2xs"
            title={isDark ? "ライトモード" : "ダークモード"}
            type="button"
          >
            {isDark ? (
              <Sun size={15} strokeWidth={2.2} className="text-[#ff9f0a]" />
            ) : (
              <Moon size={15} strokeWidth={2.2} className="text-[#5856d6]" />
            )}
          </button>

          {/* User Avatar */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 overflow-hidden ring-1.5 ring-black/10 dark:ring-white/20 shadow-xs cursor-pointer active:scale-95 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
