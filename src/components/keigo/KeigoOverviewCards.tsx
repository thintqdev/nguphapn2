"use client";

import { useState } from "react";
import type { KeigoCategory } from "@/lib/keigoTypes";
import { ArrowUpRight, ArrowDownRight, Sparkles, MessageCircle, ShieldCheck } from "lucide-react";

const categoryMeta: Record<
  string,
  {
    icon: typeof Sparkles;
    accentBg: string;
    accentText: string;
    borderLight: string;
    tagText: string;
    tagBg: string;
  }
> = {
  sonkeigo: {
    icon: ArrowUpRight,
    accentBg: "from-[#df6e53]/15 to-[#df6e53]/5 dark:from-[#df6e53]/25 dark:to-[#df6e53]/10",
    accentText: "text-[#df6e53] dark:text-[#f39882]",
    borderLight: "border-[#df6e53]/25 dark:border-[#df6e53]/35",
    tagText: "text-[#c24a2e] dark:text-[#f7a08c]",
    tagBg: "bg-[#df6e53]/15 dark:bg-[#df6e53]/25",
  },
  "kenjougo-1": {
    icon: ArrowDownRight,
    accentBg: "from-[#2e7d58]/15 to-[#2e7d58]/5 dark:from-[#2e7d58]/25 dark:to-[#2e7d58]/10",
    accentText: "text-[#2e7d58] dark:text-[#52c28d]",
    borderLight: "border-[#2e7d58]/25 dark:border-[#2e7d58]/35",
    tagText: "text-[#246346] dark:text-[#67cf9d]",
    tagBg: "bg-[#2e7d58]/15 dark:bg-[#2e7d58]/25",
  },
  "kenjougo-2": {
    icon: ShieldCheck,
    accentBg: "from-[#0071e3]/15 to-[#0071e3]/5 dark:from-[#0071e3]/25 dark:to-[#0071e3]/10",
    accentText: "text-[#0071e3] dark:text-[#47a3ff]",
    borderLight: "border-[#0071e3]/25 dark:border-[#0071e3]/35",
    tagText: "text-[#005fb8] dark:text-[#66b3ff]",
    tagBg: "bg-[#0071e3]/15 dark:bg-[#0071e3]/25",
  },
  teineigo: {
    icon: MessageCircle,
    accentBg: "from-[#8e44ad]/15 to-[#8e44ad]/5 dark:from-[#8e44ad]/25 dark:to-[#8e44ad]/10",
    accentText: "text-[#8e44ad] dark:text-[#b370d4]",
    borderLight: "border-[#8e44ad]/25 dark:border-[#8e44ad]/35",
    tagText: "text-[#763391] dark:text-[#c487e0]",
    tagBg: "bg-[#8e44ad]/15 dark:bg-[#8e44ad]/25",
  },
  bikago: {
    icon: Sparkles,
    accentBg: "from-[#d48806]/15 to-[#d48806]/5 dark:from-[#d48806]/25 dark:to-[#d48806]/10",
    accentText: "text-[#d48806] dark:text-[#f5bd5c]",
    borderLight: "border-[#d48806]/25 dark:border-[#d48806]/35",
    tagText: "text-[#ad6800] dark:text-[#fad285]",
    tagBg: "bg-[#d48806]/15 dark:bg-[#d48806]/25",
  },
};

export default function KeigoOverviewCards({
  categories,
}: {
  categories: KeigoCategory[];
}) {
  const [selectedId, setSelectedId] = useState<string>("sonkeigo");

  return (
    <div className="space-y-4">
      {/* Header with Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#1f1a16] dark:text-[#f5f0eb] flex items-center gap-2">
            <span>敬語の基本分類</span>
            <span className="text-xs font-normal text-[#8a8074] dark:text-[#9e9285] font-sans">
              (5 loại kính ngữ cơ bản)
            </span>
          </h3>
          <p className="text-xs text-[#70665a] dark:text-[#aaa094] mt-0.5">
            Quy tắc cốt lõi: Ai là người thực hiện hành động và hướng tới ai?
          </p>
        </div>
      </div>

      {/* Grid of 5 Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const meta = categoryMeta[cat.id] || categoryMeta.sonkeigo;
          const Icon = meta.icon;
          const isSelected = selectedId === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedId(cat.id)}
              className={`relative p-4 rounded-[18px] transition-all cursor-pointer select-none ios-glass border ${
                isSelected
                  ? `bg-white dark:bg-[#1a1714] ${meta.borderLight} shadow-md ring-2 ring-black/5 dark:ring-white/10 scale-[1.01]`
                  : "bg-white/80 dark:bg-[#171412]/80 border-black/[0.06] dark:border-white/[0.07] hover:border-black/15 dark:hover:border-white/15"
              }`}
            >
              {/* Header inside card */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-[10px] bg-gradient-to-br ${meta.accentBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={17} className={meta.accentText} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[15px] text-[#1f1a16] dark:text-[#f5f0eb] leading-tight">
                      {cat.name}
                    </h4>
                    <span className="text-[11px] font-medium text-[#70665a] dark:text-[#a09486]">
                      {cat.nameVn}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.tagBg} ${meta.tagText} shrink-0`}
                >
                  {cat.id === "sonkeigo"
                    ? "Nâng đối phương"
                    : cat.id.startsWith("kenjougo")
                    ? "Hạ mình"
                    : "Lịch sự"}
                </span>
              </div>

              {/* Description */}
              <p className="text-[12px] text-[#4a423a] dark:text-[#ccc2b6] leading-relaxed mb-3">
                {cat.description}
              </p>

              {/* Target pill */}
              <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-[11px]">
                <span className="text-[#8a8074] dark:text-[#9e9285] font-medium">Đối tượng:</span>
                <span className="font-semibold text-[#1f1a16] dark:text-[#f5f0eb] truncate max-w-[170px]">
                  {cat.target}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
