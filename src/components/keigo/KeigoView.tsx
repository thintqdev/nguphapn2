"use client";

import { useState } from "react";
import type { KeigoData } from "@/lib/keigoTypes";
import KeigoOverviewCards from "./KeigoOverviewCards";
import SpecialVerbsTable from "./SpecialVerbsTable";
import ConjugationRulesSection from "./ConjugationRulesSection";
import BusinessPhrasesSection from "./BusinessPhrasesSection";
import JlptTrapsSection from "./JlptTrapsSection";
import KeigoQuizModal from "./KeigoQuizModal";
import { Sparkles, HelpCircle, Layers, Table2, BookOpenCheck, Briefcase, AlertOctagon } from "lucide-react";

export default function KeigoView({
  data,
}: {
  data: KeigoData;
}) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"all" | "verbs" | "rules" | "business" | "traps">("all");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Keigo Hero Banner */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#f8ede8] via-[#fbf5f2] to-[#f4ebe6] dark:from-[#2a1d18] dark:via-[#1e1714] dark:to-[#171210] p-5 sm:p-7 border border-[#df6e53]/20 dark:border-[#df6e53]/25 shadow-sm">
        {/* Subtle background calligraphy watermark */}
        <div className="absolute right-4 -bottom-6 font-serif font-black text-8xl sm:text-9xl text-[#df6e53]/10 dark:text-[#df6e53]/10 pointer-events-none select-none">
          敬
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#df6e53]/15 dark:bg-[#df6e53]/25 text-[#df6e53] dark:text-[#f39882] text-[11px] font-bold tracking-wide uppercase mb-3">
            <Sparkles size={13} />
            <span>Chuyên đề trọng điểm JLPT N2 & Business Japanese</span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb] tracking-tight leading-tight mb-2">
            敬語・謙譲語マスター
          </h2>
          <p className="text-xs sm:text-sm text-[#70665a] dark:text-[#b8aba0] leading-relaxed mb-5">
            Tổng hợp toàn diện 19 động từ biến đổi đặc biệt, quy tắc tiếp đầu ngữ お／ご, các mẫu câu hội thoại thương mại và những bẫy ngữ pháp thường xuất hiện trong đề thi N2.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsQuizOpen(true)}
              className="px-4 py-2.5 rounded-[14px] bg-[#df6e53] hover:bg-[#c95d43] active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-[#df6e53]/25 flex items-center gap-2"
            >
              <HelpCircle size={16} />
              <span>Luyện trắc nghiệm 10 câu</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-[#8a8074] dark:text-[#9e9285] font-medium bg-black/[0.04] dark:bg-white/[0.06] px-3.5 py-2.5 rounded-[14px]">
              <span>19 Động từ</span>
              <span>•</span>
              <span>8 Công thức</span>
              <span>•</span>
              <span>4 Bẫy đề thi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        <button
          onClick={() => setActiveSection("all")}
          className={`px-3.5 py-2 rounded-[14px] text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === "all"
              ? "bg-[#1f1a16] text-white dark:bg-[#f5f0eb] dark:text-[#1f1a16] shadow-sm font-semibold"
              : "bg-white/80 dark:bg-[#1a1714]/80 text-[#70665a] dark:text-[#a09486] hover:bg-white dark:hover:bg-[#201d19] border border-black/[0.06] dark:border-white/[0.08]"
          }`}
        >
          <Layers size={14} />
          <span>Tất cả nội dung</span>
        </button>

        <button
          onClick={() => setActiveSection("verbs")}
          className={`px-3.5 py-2 rounded-[14px] text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === "verbs"
              ? "bg-[#df6e53] text-white shadow-sm font-semibold"
              : "bg-white/80 dark:bg-[#1a1714]/80 text-[#70665a] dark:text-[#a09486] hover:bg-white dark:hover:bg-[#201d19] border border-black/[0.06] dark:border-white/[0.08]"
          }`}
        >
          <Table2 size={14} />
          <span>19 Động từ đặc biệt</span>
        </button>

        <button
          onClick={() => setActiveSection("rules")}
          className={`px-3.5 py-2 rounded-[14px] text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === "rules"
              ? "bg-[#2e7d58] text-white shadow-sm font-semibold"
              : "bg-white/80 dark:bg-[#1a1714]/80 text-[#70665a] dark:text-[#a09486] hover:bg-white dark:hover:bg-[#201d19] border border-black/[0.06] dark:border-white/[0.08]"
          }`}
        >
          <BookOpenCheck size={14} />
          <span>Quy tắc biến đổi</span>
        </button>

        <button
          onClick={() => setActiveSection("business")}
          className={`px-3.5 py-2 rounded-[14px] text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === "business"
              ? "bg-[#8e44ad] text-white shadow-sm font-semibold"
              : "bg-white/80 dark:bg-[#1a1714]/80 text-[#70665a] dark:text-[#a09486] hover:bg-white dark:hover:bg-[#201d19] border border-black/[0.06] dark:border-white/[0.08]"
          }`}
        >
          <Briefcase size={14} />
          <span>Hội thoại thương mại</span>
        </button>

        <button
          onClick={() => setActiveSection("traps")}
          className={`px-3.5 py-2 rounded-[14px] text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === "traps"
              ? "bg-[#e67e22] text-white shadow-sm font-semibold"
              : "bg-white/80 dark:bg-[#1a1714]/80 text-[#70665a] dark:text-[#a09486] hover:bg-white dark:hover:bg-[#201d19] border border-black/[0.06] dark:border-white/[0.08]"
          }`}
        >
          <AlertOctagon size={14} />
          <span>Bẫy đề thi JLPT</span>
        </button>
      </div>

      {/* 1. Overview Categories */}
      {(activeSection === "all" || activeSection === "rules") && (
        <section>
          <KeigoOverviewCards categories={data.categories} />
        </section>
      )}

      {/* 2. Special Verbs Table */}
      {(activeSection === "all" || activeSection === "verbs") && (
        <section className="space-y-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1f1a16] dark:text-[#f5f0eb] flex items-center gap-2">
              <span>特別な敬語動詞の対照表</span>
              <span className="text-xs font-normal text-[#8a8074] dark:text-[#9e9285] font-sans">
                (Bảng đối chiếu 19 động từ đặc biệt)
              </span>
            </h3>
            <p className="text-xs text-[#70665a] dark:text-[#aaa094] mt-0.5">
              Tra cứu nhanh thể thông thường, Tôn kính ngữ, Khiêm nhường ngữ Ⅰ và Đinh trọng ngữ Ⅱ:
            </p>
          </div>

          <SpecialVerbsTable verbs={data.specialVerbs} />
        </section>
      )}

      {/* 3. Conjugation Rules */}
      {(activeSection === "all" || activeSection === "rules") && (
        <section>
          <ConjugationRulesSection rules={data.conjugationRules} />
        </section>
      )}

      {/* 4. Business Japanese Phrases */}
      {(activeSection === "all" || activeSection === "business") && (
        <section>
          <BusinessPhrasesSection phrases={data.businessPhrases} />
        </section>
      )}

      {/* 5. JLPT Traps and Exam Warnings */}
      {(activeSection === "all" || activeSection === "traps") && (
        <section>
          <JlptTrapsSection traps={data.jlptTrapsAndRules} />
        </section>
      )}

      {/* Quiz Modal */}
      <KeigoQuizModal
        verbs={data.specialVerbs}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </div>
  );
}
