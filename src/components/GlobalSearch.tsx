"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Clock, Sparkles, BookOpen, ChevronRight, CornerDownLeft } from "lucide-react";
import { searchAllGrammar, type SearchResultItem } from "@/lib/grammarSearch";

interface GlobalSearchProps {
  initialQuery?: string;
  onQueryChange?: (val: string) => void;
  className?: string;
}

const QUICK_SUGGESTIONS = [
  { label: "～際（に）", query: "際" },
  { label: "～たとたん", query: "たとたん" },
  { label: "～わけではない", query: "わけではない" },
  { label: "～をはじめ", query: "はじめ" },
  { label: "敬語 (Keigo)", query: "keigo" },
  { label: "～にしては", query: "にしては" },
];

export default function GlobalSearch({
  initialQuery = "",
  onQueryChange,
  className = "",
}: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<SearchResultItem[]>([]);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Sync initialQuery
  useEffect(() => {
    if (initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("n2_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Keyboard shortcut: Cmd + K / Ctrl + K or '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (window.innerWidth < 768) {
          setIsMobileModalOpen(true);
        } else {
          desktopInputRef.current?.focus();
          setIsOpen(true);
        }
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setIsMobileModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener for desktop dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute search results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchAllGrammar(query.trim(), 8);
  }, [query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleInputChange = (val: string) => {
    setQuery(val);
    onQueryChange?.(val);
    setIsOpen(true);
  };

  const handleClear = () => {
    setQuery("");
    onQueryChange?.("");
    desktopInputRef.current?.focus();
  };

  const handleSelectItem = (item: SearchResultItem) => {
    // Save to recent searches
    try {
      const updated = [item, ...recentSearches.filter((r) => r.id !== item.id)].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem("n2_recent_searches", JSON.stringify(updated));
    } catch {
      // Ignore localStorage error
    }

    setIsOpen(false);
    setIsMobileModalOpen(false);
    router.push(item.href);
  };

  const removeRecentItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((r) => r.id !== id);
    setRecentSearches(updated);
    try {
      localStorage.setItem("n2_recent_searches", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Keyboard navigation for results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (results.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectItem(results[selectedIndex]);
        }
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 1. Desktop & Tablet Search Input Bar */}
      <div className="relative group">
        <Search
          size={14}
          strokeWidth={2.2}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 group-focus-within:text-[#df6e53] dark:group-focus-within:text-[#f39882] transition-colors pointer-events-none"
        />

        <input
          ref={desktopInputRef}
          type="text"
          value={query}
          onFocus={() => {
            if (window.innerWidth < 640) {
              setIsMobileModalOpen(true);
            } else {
              setIsOpen(true);
            }
          }}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="文法を検索 (VD: 際, totan, khi...)"
          className="w-full bg-black/[0.05] dark:bg-white/[0.09] hover:bg-black/[0.07] dark:hover:bg-white/[0.12] focus:bg-white dark:focus:bg-[#201c19] text-xs sm:text-[13px] text-[#1d1b19] dark:text-[#f5f0eb] placeholder-black/40 dark:placeholder-white/40 pl-8 pr-12 py-1.5 rounded-[12px] border border-transparent focus:border-[#df6e53]/35 dark:focus:border-[#df6e53]/40 focus:outline-hidden transition-all shadow-2xs"
        />

        {/* Clear or Keyboard shortcut badge */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-black/40 hover:text-black/80 dark:text-white/40 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-black/35 dark:text-white/35 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.05] dark:border-white/[0.08] select-none">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* 2. Desktop Dropdown Results (Visible on >= sm screen when open) */}
      {isOpen && (
        <div className="hidden sm:block absolute right-0 mt-2 w-[420px] max-h-[440px] overflow-hidden rounded-[20px] bg-white/95 dark:bg-[#1c1815]/95 ios-glass border border-black/[0.08] dark:border-white/[0.1] shadow-2xl z-50 animate-fade-in flex flex-col">
          {/* Header info */}
          <div className="p-3 border-b border-black/[0.06] dark:border-white/[0.07] flex items-center justify-between text-[11px] text-[#8a8074] dark:text-[#9e9285]">
            <span className="font-semibold uppercase tracking-wider">
              {query ? `Kết quả cho "${query}" (${results.length})` : "Gợi ý tìm kiếm"}
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft size={11} />
              <span>chọn xem chi tiết</span>
            </span>
          </div>

          <div className="overflow-y-auto max-h-[380px] p-2 space-y-1">
            {/* If query has results */}
            {query.trim() && results.length > 0 && (
              <div>
                {results.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-[14px] cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-[#df6e53]/10 dark:bg-[#df6e53]/20 border border-[#df6e53]/25"
                          : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05] border border-transparent"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-serif font-bold text-[14.5px] text-[#1f1a16] dark:text-[#f5f0eb] truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#df6e53]/15 text-[#df6e53] dark:text-[#f39882] shrink-0">
                            {item.badge}
                          </span>
                        </div>

                        <div className="text-[11px] font-medium text-[#df6e53] dark:text-[#f39882] mb-0.5 truncate">
                          {item.reading}
                        </div>

                        <p className="text-[12px] text-[#70665a] dark:text-[#aaa094] line-clamp-1 leading-snug">
                          {item.meaning}
                        </p>
                      </div>

                      <div className="shrink-0 pt-1 text-[#8a8074] dark:text-[#9e9285]">
                        <ChevronRight
                          size={15}
                          className={isSelected ? "text-[#df6e53] dark:text-[#f39882] translate-x-0.5 transition-transform" : ""}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* If query has NO results */}
            {query.trim() && results.length === 0 && (
              <div className="py-8 px-4 text-center">
                <p className="text-xs font-medium text-[#70665a] dark:text-[#aaa094] mb-3">
                  Không tìm thấy ngữ pháp nào khớp với &ldquo;{query}&rdquo;
                </p>
                <div className="text-[11px] text-[#8a8074] dark:text-[#9e9285] mb-2 font-semibold">
                  Thử tìm theo gợi ý:
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {QUICK_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug.label}
                      onClick={() => handleInputChange(sug.query)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/[0.05] dark:bg-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb] hover:bg-[#df6e53] hover:text-white transition-colors cursor-pointer"
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* When input is empty: Show recent searches + quick suggestions */}
            {!query.trim() && (
              <div className="space-y-3 p-1">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#9d9387] dark:text-[#7f7468] px-2 mb-1.5 flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>Đã xem gần đây</span>
                    </div>

                    <div className="space-y-1">
                      {recentSearches.map((rec) => (
                        <div
                          key={rec.id}
                          onClick={() => handleSelectItem(rec)}
                          className="group flex items-center justify-between p-2.5 rounded-[12px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <BookOpen size={14} className="text-[#8a8074] shrink-0" />
                            <div className="truncate">
                              <span className="font-serif font-bold text-xs text-[#1f1a16] dark:text-[#f5f0eb] mr-2">
                                {rec.title}
                              </span>
                              <span className="text-[11px] text-[#8a8074] dark:text-[#9e9285]">
                                {rec.meaning}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => removeRecentItem(e, rec.id)}
                            title="Xóa khỏi lịch sử"
                            className="opacity-0 group-hover:opacity-100 p-1 text-[#8a8074] hover:text-red-500 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick suggestions */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#9d9387] dark:text-[#7f7468] px-2 mb-2 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>Cấu trúc phổ biến N2</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 px-2">
                    {QUICK_SUGGESTIONS.map((sug) => (
                      <button
                        key={sug.label}
                        onClick={() => handleInputChange(sug.query)}
                        className="px-2.5 py-1 rounded-[10px] text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.07] text-[#554d45] dark:text-[#c7bbb0] hover:bg-[#df6e53] hover:text-white transition-colors cursor-pointer"
                      >
                        {sug.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Mobile Fullscreen Search Sheet Modal */}
      {isMobileModalOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-[#faf7f2] dark:bg-[#120f0d] flex flex-col animate-fade-in">
          {/* Mobile Search Header */}
          <div className="p-3 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center gap-2.5 ios-glass bg-white/90 dark:bg-[#1a1714]/90">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"
              />
              <input
                ref={mobileInputRef}
                autoFocus
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Tìm ngữ pháp N2, romaji, ý nghĩa..."
                className="w-full bg-black/[0.05] dark:bg-white/[0.08] text-sm text-[#1f1a16] dark:text-[#f5f0eb] placeholder-black/40 dark:placeholder-white/40 pl-9 pr-9 py-2 rounded-[14px] border border-transparent focus:border-[#df6e53]/30 focus:outline-hidden"
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black/40 dark:text-white/40"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsMobileModalOpen(false)}
              className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] px-2 py-1.5 active:scale-95 cursor-pointer"
            >
              Hủy
            </button>
          </div>

          {/* Mobile Results Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-24">
            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none select-none">
              {QUICK_SUGGESTIONS.map((sug) => (
                <button
                  key={sug.label}
                  onClick={() => handleInputChange(sug.query)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-black/[0.04] dark:bg-white/[0.07] text-[#554d45] dark:text-[#c7bbb0] shrink-0 active:scale-95"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Results list */}
            {query.trim() && results.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] dark:text-[#9e9285] px-1">
                  Kết quả tìm kiếm ({results.length})
                </div>

                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="p-3.5 rounded-[18px] bg-white dark:bg-[#1d1916] ios-glass border border-black/[0.06] dark:border-white/[0.08] active:scale-[0.98] transition-transform shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-serif font-bold text-base text-[#1f1a16] dark:text-[#f5f0eb]">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#df6e53]/15 text-[#df6e53] dark:text-[#f39882]">
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#df6e53] dark:text-[#f39882] mb-1">
                        {item.reading}
                      </div>
                      <p className="text-xs text-[#70665a] dark:text-[#aaa094] line-clamp-2">
                        {item.meaning}
                      </p>
                    </div>

                    <ChevronRight size={18} className="text-[#8a8074] shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {/* If no match */}
            {query.trim() && results.length === 0 && (
              <div className="py-12 text-center text-xs text-[#8a8074]">
                Không tìm thấy ngữ pháp phù hợp với &ldquo;{query}&rdquo;.
              </div>
            )}

            {/* Empty state: Recent searches */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8a8074] dark:text-[#9e9285] px-1 flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>Đã xem gần đây</span>
                </div>

                {recentSearches.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => handleSelectItem(rec)}
                    className="p-3 rounded-[16px] bg-white dark:bg-[#1d1916] border border-black/[0.05] dark:border-white/[0.07] flex items-center justify-between gap-2 active:scale-98"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-serif font-bold text-sm text-[#1f1a16] dark:text-[#f5f0eb]">
                        {rec.title}
                      </div>
                      <p className="text-xs text-[#70665a] dark:text-[#aaa094] line-clamp-1">
                        {rec.meaning}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-[#8a8074] shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
