"use client";

import { Search, Moon, Sun, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

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
              className="inline-flex items-center gap-1 text-[13px] sm:text-sm font-semibold text-[#0071e3] dark:text-[#2997ff] hover:opacity-75 active:scale-95 transition-all py-1 px-2 -ml-1 rounded-xl"
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

        {/* Right controls: iOS Search Bar + Capsule Theme Switcher */}
        <div className="flex items-center gap-2 flex-1 justify-end max-w-xs sm:max-w-none">
          {/* iOS Styled Search Field */}
          <div className="relative flex-1 sm:w-64 max-w-[200px] sm:max-w-none group">
            <Search
              size={14}
              strokeWidth={2.2}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 group-focus-within:text-[#0071e3] dark:group-focus-within:text-[#2997ff] transition-colors"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="文法を検索..."
              className="w-full bg-black/[0.05] dark:bg-white/[0.09] hover:bg-black/[0.07] dark:hover:bg-white/[0.12] focus:bg-white dark:focus:bg-[#201c19] text-xs sm:text-[13px] text-[#1d1b19] dark:text-[#f5f0eb] placeholder-black/40 dark:placeholder-white/40 pl-7.5 pr-2.5 py-1.5 rounded-[10px] sm:rounded-[12px] border border-transparent focus:border-black/10 dark:focus:border-white/15 focus:outline-hidden transition-all shadow-2xs"
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
