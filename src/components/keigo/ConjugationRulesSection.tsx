"use client";

import { useState } from "react";
import type { ConjugationRulesData } from "@/lib/keigoTypes";
import KeigoAudioButton from "./KeigoAudioButton";
import { Sparkles, ArrowUpRight, ArrowDownRight, Info } from "lucide-react";

export default function ConjugationRulesSection({
  rules,
}: {
  rules: ConjugationRulesData;
}) {
  const [activeTab, setActiveTab] = useState<"all" | "sonkeigo" | "kenjougo">("all");

  return (
    <div className="space-y-4">
      {/* Title & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#1f1a16] dark:text-[#f5f0eb] flex items-center gap-2">
            <span>規則的な変形パターン</span>
            <span className="text-xs font-normal text-[#8a8074] dark:text-[#9e9285] font-sans">
              (Quy tắc biến đổi thông thường)
            </span>
          </h3>
          <p className="text-xs text-[#70665a] dark:text-[#aaa094] mt-0.5">
            Khi động từ không có dạng bất quy tắc riêng, dùng các công thức chuẩn sau:
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-[14px] select-none self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white dark:bg-[#2b2723] text-[#1f1a16] dark:text-[#f5f0eb] shadow-2xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486]"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("sonkeigo")}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all cursor-pointer ${
              activeTab === "sonkeigo"
                ? "bg-[#df6e53] text-white shadow-2xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486]"
            }`}
          >
            Tôn kính ngữ ({rules.sonkeigo?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("kenjougo")}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all cursor-pointer ${
              activeTab === "kenjougo"
                ? "bg-[#2e7d58] text-white shadow-2xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486]"
            }`}
          >
            Khiêm nhường ngữ ({rules.kenjougo?.length || 0})
          </button>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sonkeigo Rules */}
        {(activeTab === "all" || activeTab === "sonkeigo") && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-[#df6e53]" />
              <h4 className="font-serif font-bold text-sm text-[#df6e53] dark:text-[#f39882] uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpRight size={15} />
                <span>尊敬語 (Tôn kính ngữ - Nâng đối phương)</span>
              </h4>
            </div>

            <div className="space-y-3">
              {rules.sonkeigo?.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[18px] bg-white/90 dark:bg-[#1a1714]/90 ios-glass border border-[#df6e53]/20 dark:border-[#df6e53]/30 shadow-xs space-y-2.5"
                >
                  {/* Pattern Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-[8px] bg-[#df6e53]/10 dark:bg-[#df6e53]/20 text-[#c24a2e] dark:text-[#f7a08c] border border-[#df6e53]/20">
                      {rule.pattern}
                    </span>
                    <span className="text-[11px] font-semibold text-[#8a8074]">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Example */}
                  <div className="p-3 rounded-[12px] bg-[#fbf9f6] dark:bg-[#201d19] border border-black/[0.04] dark:border-white/[0.05] space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-serif font-semibold text-sm text-[#1f1a16] dark:text-[#f5f0eb]">
                        {rule.exampleJp}
                      </span>
                      <KeigoAudioButton text={rule.exampleJp} size="xs" />
                    </div>
                    <p className="text-xs text-[#70665a] dark:text-[#aaa094]">
                      {rule.exampleVn}
                    </p>
                  </div>

                  {/* Note */}
                  {rule.note && (
                    <div className="flex items-start gap-1.5 text-[11px] text-[#8a8074] dark:text-[#9e9285] pt-0.5">
                      <Info size={13} className="shrink-0 mt-0.5 text-[#df6e53]" />
                      <span>{rule.note}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kenjougo Rules */}
        {(activeTab === "all" || activeTab === "kenjougo") && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-[#2e7d58]" />
              <h4 className="font-serif font-bold text-sm text-[#2e7d58] dark:text-[#52c28d] uppercase tracking-wider flex items-center gap-1.5">
                <ArrowDownRight size={15} />
                <span>謙譲語 (Khiêm nhường ngữ - Hạ mình)</span>
              </h4>
            </div>

            <div className="space-y-3">
              {rules.kenjougo?.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[18px] bg-white/90 dark:bg-[#1a1714]/90 ios-glass border border-[#2e7d58]/20 dark:border-[#2e7d58]/30 shadow-xs space-y-2.5"
                >
                  {/* Pattern Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-[8px] bg-[#2e7d58]/10 dark:bg-[#2e7d58]/20 text-[#246346] dark:text-[#67cf9d] border border-[#2e7d58]/20">
                      {rule.pattern}
                    </span>
                    <span className="text-[11px] font-semibold text-[#8a8074]">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Example */}
                  <div className="p-3 rounded-[12px] bg-[#fbf9f6] dark:bg-[#201d19] border border-black/[0.04] dark:border-white/[0.05] space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-serif font-semibold text-sm text-[#1f1a16] dark:text-[#f5f0eb]">
                        {rule.exampleJp}
                      </span>
                      <KeigoAudioButton text={rule.exampleJp} size="xs" />
                    </div>
                    <p className="text-xs text-[#70665a] dark:text-[#aaa094]">
                      {rule.exampleVn}
                    </p>
                  </div>

                  {/* Note */}
                  {rule.note && (
                    <div className="flex items-start gap-1.5 text-[11px] text-[#8a8074] dark:text-[#9e9285] pt-0.5">
                      <Info size={13} className="shrink-0 mt-0.5 text-[#2e7d58]" />
                      <span>{rule.note}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
