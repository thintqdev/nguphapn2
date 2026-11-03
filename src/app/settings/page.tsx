"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Moon, Sun, CalendarDays } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import {
  daysUntilExam,
  formatExamDateJa,
  getStoredExamDate,
  setStoredExamDate,
} from "@/lib/jlptSettings";

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const [examDate, setExamDate] = useState(getStoredExamDate);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExamDate(getStoredExamDate());
  }, []);

  function onDateChange(value: string) {
    setExamDate(value);
    setStoredExamDate(value);
  }

  const days = mounted ? daysUntilExam(examDate) : null;

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-5 animate-fade-in">
          <div>
            <h1 className="font-serif font-bold text-2xl text-[#1f1a16] dark:text-[#f5f0eb]">
              設定
            </h1>
            <p className="text-sm text-[#70665a] dark:text-[#b8aba0] mt-1">
              Tuỳ chọn hiển thị &amp; ngày thi
            </p>
          </div>

          <div className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90 divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#df6e53]/12 flex items-center justify-center shrink-0">
                  <CalendarDays
                    size={16}
                    className="text-[#df6e53] dark:text-[#f39882]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#1f1a16] dark:text-[#f5f0eb]">
                    Ngày thi JLPT
                  </p>
                  <p className="text-[12px] text-[#8a8074] mt-0.5">
                    Hiện trên header · đếm ngược tới kỳ thi
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between pl-0 sm:pl-12">
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="px-3 py-2 rounded-[12px] text-sm bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb] outline-none focus:border-[#df6e53]/45 focus:ring-2 focus:ring-[#df6e53]/15"
                />
                <p className="text-[12px] text-[#5e554c] dark:text-[#b8aba0]">
                  {formatExamDateJa(examDate)}
                  {days != null && (
                    <span className="ml-2 font-bold text-[#a44d36] dark:text-[#f39882]">
                      {days > 0
                        ? `あと${days}日`
                        : days === 0
                          ? "今日！"
                          : "Đã qua"}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-[#1f1a16] dark:text-[#f5f0eb]">
                  Đọc audio (TTS)
                </p>
                <p className="text-[12px] text-[#8a8074] mt-0.5">
                  Web Speech API · tiếng Nhật
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#2e7d58]">Bật</span>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-[#1f1a16] dark:text-[#f5f0eb]">
                  Ngôn ngữ giải thích
                </p>
                <p className="text-[12px] text-[#8a8074] mt-0.5">
                  Tiếng Việt + 日本語
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#8a8074]">
                JP / VN
              </span>
            </div>

            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-[#1f1a16] dark:text-[#f5f0eb]">
                  Giao diện
                </p>
                <p className="text-[12px] text-[#8a8074] mt-0.5">
                  {isDark ? "Chế độ tối" : "Chế độ sáng"}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-semibold bg-black/[0.05] dark:bg-white/[0.08] cursor-pointer active:scale-95"
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
                {isDark ? "Sáng" : "Tối"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
