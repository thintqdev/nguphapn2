"use client";

import { useState } from "react";
import type { KeigoData } from "@/lib/keigoTypes";
import KeigoOverviewCards from "./KeigoOverviewCards";
import SpecialVerbsTable from "./SpecialVerbsTable";
import ConjugationRulesSection from "./ConjugationRulesSection";
import BusinessPhrasesSection from "./BusinessPhrasesSection";
import JlptTrapsSection from "./JlptTrapsSection";
import KeigoQuizModal from "./KeigoQuizModal";
import { HelpCircle, Layers, Table2, BookOpenCheck, Briefcase, AlertOctagon } from "lucide-react";

export default function KeigoView({
  data,
}: {
  data: KeigoData;
}) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"all" | "verbs" | "rules" | "business" | "traps">("all");

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb]">
            敬語・謙譲語
          </h2>
          <p className="text-sm text-[#70665a] dark:text-[#b8aba0] mt-1.5">
            19 động từ · Công thức · Bẫy đề thi N2
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsQuizOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-accent hover:bg-accent-hover text-white text-sm font-semibold active:scale-95 cursor-pointer shrink-0"
        >
          <HelpCircle size={15} />
          Quiz 10 câu
        </button>
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
              ? "bg-accent text-white shadow-sm font-semibold"
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
              ? "bg-accent text-white shadow-sm font-semibold"
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
              ? "bg-accent text-white shadow-sm font-semibold"
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
              ? "bg-accent text-white shadow-sm font-semibold"
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
