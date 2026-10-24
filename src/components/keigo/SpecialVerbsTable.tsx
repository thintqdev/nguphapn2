"use client";

import { useState, useMemo } from "react";
import type { SpecialVerb } from "@/lib/keigoTypes";
import KeigoAudioButton from "./KeigoAudioButton";
import { Search, Copy, Check, Filter } from "lucide-react";

export default function SpecialVerbsTable({
  verbs,
}: {
  verbs: SpecialVerb[];
}) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "sonkeigo" | "kenjougo1" | "kenjougo2">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter verbs
  const filteredVerbs = useMemo(() => {
    let list = verbs;
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.plain.toLowerCase().includes(q) ||
          v.meaningVn.toLowerCase().includes(q) ||
          v.sonkeigo.toLowerCase().includes(q) ||
          v.kenjougo1.toLowerCase().includes(q) ||
          v.kenjougo2.toLowerCase().includes(q) ||
          v.teineigo.toLowerCase().includes(q)
      );
    }
    return list;
  }, [verbs, query]);

  const copyRow = (verb: SpecialVerb) => {
    const text = `【${verb.plain}】(${verb.meaningVn})\n• 尊敬語: ${verb.sonkeigo}\n• 謙譲語Ⅰ: ${verb.kenjougo1}\n• 謙譲語Ⅱ: ${verb.kenjougo2}\n• 丁寧語: ${verb.teineigo}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(verb.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/90 dark:bg-[#1a1714]/90 ios-glass p-3 sm:p-4 rounded-[20px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8074] dark:text-[#9e9285]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo động từ (VD: 行く, ăn, nói, 見る...)"
            className="w-full pl-9 pr-4 py-2 text-[13px] rounded-[14px] bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.05] dark:border-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb] placeholder-[#8a8074] dark:placeholder-[#8f857a] focus:outline-none focus:ring-2 focus:ring-[#df6e53]/35 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a8074] hover:text-[#1f1a16] dark:hover:text-[#f5f0eb]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Segmented Filter Pills */}
        <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-[14px] overflow-x-auto select-none shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "all"
                ? "bg-white dark:bg-[#2b2723] text-[#1f1a16] dark:text-[#f5f0eb] shadow-2xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486] hover:text-[#1f1a16]"
            }`}
          >
            Tất cả ({verbs.length})
          </button>
          <button
            onClick={() => setActiveTab("sonkeigo")}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "sonkeigo"
                ? "bg-[#df6e53] text-white shadow-2xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486] hover:text-[#1f1a16]"
            }`}
          >
            Tôn kính
          </button>
          <button
            onClick={() => setActiveTab("kenjougo1")}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "kenjougo1"
                ? "bg-[#2e7d58] text-white shadow-2xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486] hover:text-[#1f1a16]"
            }`}
          >
            Khiêm nhường I
          </button>
          <button
            onClick={() => setActiveTab("kenjougo2")}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === "kenjougo2"
                ? "bg-[#0071e3] text-white shadow-2xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486] hover:text-[#1f1a16]"
            }`}
          >
            Đinh trọng II
          </button>
        </div>
      </div>

      {/* 1. Mobile-friendly Card View (Visible on small screens: hidden md:hidden) */}
      <div className="grid grid-cols-1 gap-3.5 md:hidden">
        {filteredVerbs.map((verb) => (
          <div
            key={verb.id}
            className="p-4 rounded-[20px] bg-white/95 dark:bg-[#1a1714]/95 ios-glass border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3"
          >
            {/* Header: Plain verb + Meaning + Actions */}
            <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06] dark:border-white/[0.07]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base text-[#1f1a16] dark:text-[#f5f0eb]">
                    {verb.plain}
                  </span>
                  <KeigoAudioButton text={verb.plain} size="xs" />
                </div>
                <p className="text-xs font-medium text-[#8a8074] dark:text-[#9e9285]">
                  {verb.meaningVn}
                </p>
              </div>

              <button
                onClick={() => copyRow(verb)}
                title="Sao chép bảng biến đổi"
                className="p-1.5 rounded-[10px] text-[#8a8074] hover:text-[#df6e53] dark:hover:text-[#f39882] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                {copiedId === verb.id ? (
                  <Check size={16} className="text-[#2e7d58]" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            {/* List of transformations */}
            <div className="space-y-2 text-xs">
              {/* Sonkeigo */}
              <div
                className={`p-2.5 rounded-[12px] transition-all ${
                  activeTab === "sonkeigo"
                    ? "bg-[#df6e53]/15 ring-1 ring-[#df6e53]/30"
                    : "bg-[#fbf9f6] dark:bg-[#201d19]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#df6e53] dark:text-[#f39882] flex items-center gap-1">
                    <span>尊敬語 (Tôn kính)</span>
                  </span>
                  <KeigoAudioButton text={verb.sonkeigo} size="xs" />
                </div>
                <div className="font-serif font-bold text-[14px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                  {verb.sonkeigo}
                </div>
              </div>

              {/* Kenjougo 1 */}
              <div
                className={`p-2.5 rounded-[12px] transition-all ${
                  activeTab === "kenjougo1"
                    ? "bg-[#2e7d58]/15 ring-1 ring-[#2e7d58]/30"
                    : "bg-[#fbf9f6] dark:bg-[#201d19]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#2e7d58] dark:text-[#52c28d]">
                    謙譲語Ⅰ (Khiêm nhường hướng đối tượng)
                  </span>
                  <KeigoAudioButton text={verb.kenjougo1} size="xs" />
                </div>
                <div className="font-serif font-bold text-[14px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                  {verb.kenjougo1}
                </div>
              </div>

              {/* Kenjougo 2 */}
              <div
                className={`p-2.5 rounded-[12px] transition-all ${
                  activeTab === "kenjougo2"
                    ? "bg-[#0071e3]/15 ring-1 ring-[#0071e3]/30"
                    : "bg-[#fbf9f6] dark:bg-[#201d19]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#0071e3] dark:text-[#47a3ff]">
                    謙譲語Ⅱ / 丁重語 (Đinh trọng ngữ)
                  </span>
                  <KeigoAudioButton text={verb.kenjougo2} size="xs" />
                </div>
                <div className="font-serif font-bold text-[14px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                  {verb.kenjougo2}
                </div>
              </div>

              {/* Teineigo */}
              <div className="flex items-center justify-between px-2 pt-1 text-[#8a8074] dark:text-[#9e9285]">
                <span>丁寧語 (Lịch sự):</span>
                <span className="font-medium text-[#1f1a16] dark:text-[#f5f0eb]">
                  {verb.teineigo}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block overflow-hidden rounded-[22px] bg-white/95 dark:bg-[#1a1714]/95 ios-glass border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/[0.06] dark:border-white/[0.08] bg-[#fbf9f6]/80 dark:bg-[#151210]/80">
                <th className="py-3.5 px-4 font-bold text-[#70665a] dark:text-[#9e9285] w-[18%]">
                  Thể thường (辞書形)
                </th>
                <th
                  className={`py-3.5 px-4 font-bold transition-colors w-[27%] ${
                    activeTab === "sonkeigo"
                      ? "bg-[#df6e53]/15 text-[#df6e53] dark:text-[#f39882]"
                      : "text-[#df6e53] dark:text-[#f39882]"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>尊敬語 (Tôn kính)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#df6e53]/15 text-[#df6e53] dark:text-[#f39882]">
                      Đối phương
                    </span>
                  </span>
                </th>
                <th
                  className={`py-3.5 px-4 font-bold transition-colors w-[26%] ${
                    activeTab === "kenjougo1"
                      ? "bg-[#2e7d58]/15 text-[#2e7d58] dark:text-[#52c28d]"
                      : "text-[#2e7d58] dark:text-[#52c28d]"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>謙譲語Ⅰ (Khiêm nhường)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#2e7d58]/15 text-[#2e7d58] dark:text-[#52c28d]">
                      Hướng tới
                    </span>
                  </span>
                </th>
                <th
                  className={`py-3.5 px-4 font-bold transition-colors w-[23%] ${
                    activeTab === "kenjougo2"
                      ? "bg-[#0071e3]/15 text-[#0071e3] dark:text-[#47a3ff]"
                      : "text-[#0071e3] dark:text-[#47a3ff]"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>謙譲語Ⅱ (Đinh trọng)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#0071e3]/15 text-[#0071e3] dark:text-[#47a3ff]">
                      Nói chung
                    </span>
                  </span>
                </th>
                <th className="py-3.5 px-3 text-center font-bold text-[#8a8074] dark:text-[#9e9285] w-[6%]">
                  Sao chép
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {filteredVerbs.map((verb) => (
                <tr
                  key={verb.id}
                  className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  {/* Plain verb & meaning */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-[14px] text-[#1f1a16] dark:text-[#f5f0eb]">
                        {verb.plain}
                      </span>
                      <KeigoAudioButton text={verb.plain} size="xs" />
                    </div>
                    <div className="text-[11px] font-medium text-[#8a8074] dark:text-[#9e9285] mt-0.5">
                      {verb.meaningVn}
                    </div>
                    <div className="text-[10px] text-[#a09486] dark:text-[#7d7367] mt-1">
                      Lịch sự: {verb.teineigo}
                    </div>
                  </td>

                  {/* Sonkeigo */}
                  <td
                    className={`py-3.5 px-4 align-top transition-colors ${
                      activeTab === "sonkeigo" ? "bg-[#df6e53]/5 font-medium" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-serif font-semibold text-[13.5px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                        {verb.sonkeigo}
                      </span>
                      <KeigoAudioButton text={verb.sonkeigo} size="xs" />
                    </div>
                  </td>

                  {/* Kenjougo 1 */}
                  <td
                    className={`py-3.5 px-4 align-top transition-colors ${
                      activeTab === "kenjougo1" ? "bg-[#2e7d58]/5 font-medium" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-serif font-semibold text-[13.5px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                        {verb.kenjougo1}
                      </span>
                      <KeigoAudioButton text={verb.kenjougo1} size="xs" />
                    </div>
                  </td>

                  {/* Kenjougo 2 */}
                  <td
                    className={`py-3.5 px-4 align-top transition-colors ${
                      activeTab === "kenjougo2" ? "bg-[#0071e3]/5 font-medium" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-serif font-semibold text-[13.5px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
                        {verb.kenjougo2}
                      </span>
                      <KeigoAudioButton text={verb.kenjougo2} size="xs" />
                    </div>
                  </td>

                  {/* Copy button */}
                  <td className="py-3.5 px-3 text-center align-middle">
                    <button
                      onClick={() => copyRow(verb)}
                      title="Sao chép toàn bộ dòng"
                      className="p-1.5 rounded-lg text-[#8a8074] hover:text-[#df6e53] dark:hover:text-[#f39882] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer inline-flex items-center justify-center"
                    >
                      {copiedId === verb.id ? (
                        <Check size={14} className="text-[#2e7d58]" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredVerbs.length === 0 && (
        <div className="p-8 text-center bg-white/80 dark:bg-[#1a1714]/80 rounded-[20px] border border-black/[0.06] dark:border-white/[0.08]">
          <p className="text-sm text-[#8a8074] dark:text-[#9e9285]">
            Không tìm thấy động từ nào phù hợp với từ khóa &ldquo;{query}&rdquo;.
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-2 text-xs font-semibold text-[#df6e53] hover:underline cursor-pointer"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}
    </div>
  );
}
