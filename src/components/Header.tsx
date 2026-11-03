"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun, CalendarDays } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import GlobalSearch from "./GlobalSearch";
import BrandLogo from "./BrandLogo";
import { JP_QUOTES } from "@/lib/quotes";
import {
  daysUntilExam,
  formatExamDateJa,
  getStoredExamDate,
} from "@/lib/jlptSettings";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

const QUOTE_MS = 9000;

export default function Header({
  searchQuery = "",
  onSearchChange,
}: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const [examDate, setExamDate] = useState(getStoredExamDate);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExamDate(getStoredExamDate());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setExamDate(detail);
      else setExamDate(getStoredExamDate());
    };
    window.addEventListener("n2-jlpt-date-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("n2-jlpt-date-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setQuoteVisible(false);
      window.setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % JP_QUOTES.length);
        setQuoteVisible(true);
      }, 320);
    }, QUOTE_MS);
    return () => window.clearInterval(id);
  }, []);

  const days = mounted ? daysUntilExam(examDate) : null;
  const quote = JP_QUOTES[quoteIdx];

  let countdownLabel = "—";
  let countdownTone = "text-[#8a8074] dark:text-[#9e9285]";
  if (days != null) {
    if (days > 0) {
      countdownLabel = `あと${days}日`;
      countdownTone =
        days <= 30
          ? "text-[#a44d36] dark:text-[#f39882]"
          : "text-[#1f1a16] dark:text-[#f5f0eb]";
    } else if (days === 0) {
      countdownLabel = "今日！";
      countdownTone = "text-[#a44d36] dark:text-[#f39882]";
    } else {
      countdownLabel = "終了";
      countdownTone = "text-[#8a8074]";
    }
  }

  return (
    <header className="sticky top-0 z-30 ios-glass bg-[#faf7f2]/85 dark:bg-[#14110f]/85 border-b border-black/[0.06] dark:border-white/[0.08] transition-all duration-200">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2.5 sm:gap-4">
        {/* Mobile logo */}
        <span className="md:hidden shrink-0">
          <BrandLogo variant="compact" />
        </span>

        {/* Quote ticker */}
        <div className="hidden sm:flex flex-col min-w-0 flex-1 max-w-[280px] lg:max-w-md">
          <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-[#b0a59a] dark:text-[#7a7066]">
            今日の言葉
          </p>
          <p
            className={`font-serif text-[13px] lg:text-[14px] text-[#3d3630] dark:text-[#d4c8bc] truncate transition-opacity duration-300 ${
              quoteVisible ? "opacity-100" : "opacity-0"
            }`}
            title={quote.reading ? `${quote.jp}（${quote.reading}）` : quote.jp}
          >
            {quote.jp}
          </p>
        </div>

        {/* JLPT countdown */}
        <Link
          href="/settings"
          title={`JLPT · ${formatExamDateJa(examDate)} · 設定で変更`}
          className="shrink-0 inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-[12px] bg-[#df6e53]/10 dark:bg-[#df6e53]/12 border border-[#df6e53]/18 hover:border-[#df6e53]/35 active:scale-[0.98] transition-all"
        >
          <CalendarDays
            size={14}
            className="text-[#df6e53] dark:text-[#f39882] shrink-0"
          />
          <div className="leading-tight">
            <p className="text-[9px] font-bold tracking-wide text-[#a44d36]/80 dark:text-[#f39882]/80">
              JLPT N2
            </p>
            <p className={`text-[12px] sm:text-[13px] font-bold tabular-nums ${countdownTone}`}>
              {countdownLabel}
            </p>
          </div>
        </Link>

        {/* Search + theme */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end min-w-0">
          <div className="flex-1 sm:w-56 lg:w-72 max-w-[200px] sm:max-w-none min-w-0">
            <GlobalSearch
              initialQuery={searchQuery}
              onQueryChange={onSearchChange}
            />
          </div>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] active:scale-90 text-[#554d45] dark:text-[#d1c5b8] transition-all cursor-pointer"
            title={isDark ? "ライトモード" : "ダークモード"}
            type="button"
          >
            {isDark ? (
              <Sun size={15} strokeWidth={2.2} className="text-[#ff9f0a]" />
            ) : (
              <Moon size={15} strokeWidth={2.2} className="text-[#5856d6]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile quote row */}
      <div className="sm:hidden mt-1.5 min-w-0">
        <p
          className={`font-serif text-[12px] text-[#5e554c] dark:text-[#b8aba0] truncate transition-opacity duration-300 ${
            quoteVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {quote.jp}
        </p>
      </div>
    </header>
  );
}
