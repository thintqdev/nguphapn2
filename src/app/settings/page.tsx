"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Settings, Volume2, Globe, Palette, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header backHref="/" backLabel="文法一覧へ" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {/* iOS Card Banner */}
          <div className="bg-gradient-to-r from-[#ece7de] to-[#f4f0e9] dark:from-[#26201b] dark:to-[#312a24] border border-black/[0.06] dark:border-white/[0.09] rounded-[24px] p-6 sm:p-8 mb-6 ios-card-shadow transition-colors">
            <div className="flex items-center gap-3 text-[#524941] dark:text-[#dfd0c1] mb-2">
              <Settings size={26} strokeWidth={2.3} />
              <h2 className="font-serif text-2xl sm:text-3xl font-black">
                設定
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#73685f] dark:text-[#ab9d8f] font-serif">
              学習環境および表示設定
            </p>
          </div>

          {/* iOS Settings Inset Grouped Table */}
          <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass rounded-[24px] p-6 border border-black/[0.06] dark:border-white/[0.08] ios-card-shadow space-y-6 transition-colors">
            {/* Setting Item 1 */}
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.05] dark:border-white/[0.06]">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#df6e53] text-white flex items-center justify-center shadow-xs">
                  <Volume2 size={18} strokeWidth={2.3} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1e1915] dark:text-[#f5f0eb]">
                    音声読み上げ (TTS)
                  </div>
                  <div className="text-xs text-[#8c8175] dark:text-[#9e9285]">
                    例文のネイティブ発音をWeb Speech APIで自動再生
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#df6e53]/15 text-[#df6e53]">
                有効
              </span>
            </div>

            {/* Setting Item 2 */}
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.05] dark:border-white/[0.06]">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#34c759] text-white flex items-center justify-center shadow-xs">
                  <Globe size={18} strokeWidth={2.3} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1e1915] dark:text-[#f5f0eb]">
                    解説言語
                  </div>
                  <div className="text-xs text-[#8c8175] dark:text-[#9e9285]">
                    ベトナム語 (Tiếng Việt) + 日本語 (Tiếng Nhật)
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#34c759]/15 text-[#34c759]">
                JP / VN
              </span>
            </div>

            {/* Setting Item 3 - Theme Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#5856d6] text-white flex items-center justify-center shadow-xs">
                  <Palette size={18} strokeWidth={2.3} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1e1915] dark:text-[#f5f0eb]">
                    外観モード (テーマ)
                  </div>
                  <div className="text-xs text-[#8c8175] dark:text-[#9e9285]">
                    {isDark
                      ? "ダークモード適用中（和紙漆黒エディション）"
                      : "ライトモード適用中（和風レトロ・桜と富士山）"}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                type="button"
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-black/[0.05] dark:bg-white/[0.1] hover:bg-black/[0.08] dark:hover:bg-white/[0.16] text-[#1e1915] dark:text-[#f5f0eb] active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                {isDark ? (
                  <>
                    <Sun size={14} className="text-[#ff9f0a]" strokeWidth={2.4} />
                    <span>ライトへ切替</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} className="text-[#5856d6]" strokeWidth={2.4} />
                    <span>ダークへ切替</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
