import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { BarChart3, CheckCircle2, Clock, BookOpen } from "lucide-react";
import grammarDataRaw from "../../../public/data/grammar.json";
import type { GrammarData } from "@/lib/types";

const data = grammarDataRaw as GrammarData;

export default function HistoryPage() {
  const totalCategories = data.categories.length;
  const totalGrammar = data.grammar.length;

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header backHref="/" backLabel="文法一覧へ" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {/* iOS Card Banner */}
          <div className="bg-gradient-to-r from-[#e7eef4] to-[#f4f7fa] dark:from-[#1b2b36] dark:to-[#223644] border border-black/[0.06] dark:border-white/[0.09] rounded-[24px] p-6 sm:p-8 mb-6 ios-card-shadow transition-colors">
            <div className="flex items-center gap-3 text-[#0071e3] dark:text-[#2997ff] mb-2">
              <BarChart3 size={26} strokeWidth={2.3} />
              <h2 className="font-serif text-2xl sm:text-3xl font-black">
                学習記録
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5d738c] dark:text-[#a5b9ce] font-serif">
              JLPT N2 文法学習の達成度と進捗レポート
            </p>
          </div>

          {/* Stats Overview - iOS Widget Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass rounded-[20px] p-5 border border-black/[0.06] dark:border-white/[0.08] ios-card-shadow transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#867d74] dark:text-[#9e9285] mb-1.5">
                <div className="w-6 h-6 rounded-full bg-[#df6e53]/15 text-[#df6e53] flex items-center justify-center">
                  <BookOpen size={13} strokeWidth={2.2} />
                </div>
                <span>総文法項目数</span>
              </div>
              <div className="text-3xl font-black text-[#1e1915] dark:text-[#f5f0eb] tracking-tight">
                {totalGrammar} <span className="text-sm font-semibold text-[#8b7f73] dark:text-[#9e9285]">項目</span>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass rounded-[20px] p-5 border border-black/[0.06] dark:border-white/[0.08] ios-card-shadow transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#867d74] dark:text-[#9e9285] mb-1.5">
                <div className="w-6 h-6 rounded-full bg-[#34c759]/15 text-[#34c759] flex items-center justify-center">
                  <CheckCircle2 size={13} strokeWidth={2.2} />
                </div>
                <span>学習カテゴリー</span>
              </div>
              <div className="text-3xl font-black text-[#1e1915] dark:text-[#f5f0eb] tracking-tight">
                {totalCategories} <span className="text-sm font-semibold text-[#8b7f73] dark:text-[#9e9285]">分類</span>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass rounded-[20px] p-5 border border-black/[0.06] dark:border-white/[0.08] ios-card-shadow transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#867d74] dark:text-[#9e9285] mb-1.5">
                <div className="w-6 h-6 rounded-full bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center">
                  <Clock size={13} strokeWidth={2.2} />
                </div>
                <span>目標レベル</span>
              </div>
              <div className="text-3xl font-black text-[#1e1915] dark:text-[#f5f0eb] tracking-tight">
                JLPT N2
              </div>
            </div>
          </div>

          {/* Categories Progress list - iOS Inset Grouped Table */}
          <div className="bg-white/90 dark:bg-[#1f1b18]/90 ios-glass rounded-[24px] p-6 border border-black/[0.06] dark:border-white/[0.08] ios-card-shadow transition-colors">
            <h3 className="font-serif font-bold text-base text-[#1e1915] dark:text-[#f5f0eb] mb-5">
              分野別進捗状況
            </h3>
            <div className="space-y-4.5">
              {data.categories.map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#3d342d] dark:text-[#dfd4c7]">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-2xs"
                        style={{
                          backgroundColor: cat.bgColor,
                          color: cat.textColor,
                        }}
                      >
                        {cat.roman}
                      </span>
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-[#8e8376] dark:text-[#9e9285] font-mono">{cat.count}項目</span>
                  </div>
                  <div className="w-full bg-black/[0.05] dark:bg-white/[0.08] rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: "100%",
                        backgroundColor: cat.color,
                        opacity: 0.9,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
