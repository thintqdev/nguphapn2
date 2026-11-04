"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Moon, Sun, CalendarDays, Palette } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { SKINS, type SkinId } from "@/lib/skins";
import {
  daysUntilExam,
  formatExamDateJa,
  getStoredExamDate,
  setStoredExamDate,
} from "@/lib/jlptSettings";

export default function SettingsPage() {
  const { isDark, toggleTheme, skin, setSkin } = useTheme();
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
  const activeSkin = mounted ? skin : "terracotta";

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
            {/* Color skin */}
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-accent-soft flex items-center justify-center shrink-0">
                  <Palette size={16} className="text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#1f1a16] dark:text-[#f5f0eb]">
                    カラー · Màu giao diện
                  </p>
                  <p className="text-[12px] text-[#8a8074] mt-0.5">
                    Accent washi · nền giấy giữ nguyên
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:pl-12">
                {SKINS.map((s) => {
                  const selected = activeSkin === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSkin(s.id as SkinId)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-[14px] transition-all cursor-pointer active:scale-95 ${
                        selected
                          ? "bg-accent-soft ring-2 ring-accent-ring"
                          : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                      }`}
                      title={`${s.labelJa} · ${s.labelVn}`}
                    >
                      <span
                        className="w-8 h-8 rounded-full shadow-sm ring-1 ring-black/10 dark:ring-white/15"
                        style={{ backgroundColor: s.swatch }}
                      />
                      <span
                        className={`text-[11px] font-semibold ${
                          selected
                            ? "text-accent-muted"
                            : "text-[#8a8074]"
                        }`}
                      >
                        {s.labelJa}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-accent-soft flex items-center justify-center shrink-0">
                  <CalendarDays size={16} className="text-accent" />
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
                  className="px-3 py-2 rounded-[12px] text-sm bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb] outline-none focus:border-accent-border focus:ring-2 focus:ring-accent-ring"
                />
                <p className="text-[12px] text-[#5e554c] dark:text-[#b8aba0]">
                  {formatExamDateJa(examDate)}
                  {days != null && (
                    <span className="ml-2 font-bold text-accent-muted">
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
