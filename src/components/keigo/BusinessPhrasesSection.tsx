"use client";

import type { BusinessPhrase } from "@/lib/keigoTypes";
import KeigoAudioButton from "./KeigoAudioButton";
import { Briefcase, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function BusinessPhrasesSection({
  phrases,
}: {
  phrases: BusinessPhrase[];
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPhrase = (p: BusinessPhrase) => {
    navigator.clipboard?.writeText(p.phraseJp);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="font-serif font-bold text-lg text-[#1f1a16] dark:text-[#f5f0eb] flex items-center gap-2">
          <span>ビジネス定番フレーズ</span>
          <span className="text-xs font-normal text-[#8a8074] dark:text-[#9e9285] font-sans">
            (Cụm từ giao tiếp thương mại tiêu chuẩn)
          </span>
        </h3>
        <p className="text-xs text-[#70665a] dark:text-[#aaa094] mt-0.5">
          Những mẫu câu cửa miệng bắt buộc phải nhớ khi đi làm trong doanh nghiệp Nhật Bản:
        </p>
      </div>

      {/* Grid of Business Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {phrases.map((phrase) => (
          <div
            key={phrase.id}
            className="p-4 rounded-[18px] bg-white/90 dark:bg-[#1a1714]/90 ios-glass border border-black/[0.06] dark:border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-black/15 dark:hover:border-white/15 transition-all"
          >
            <div>
              {/* Category pill */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8e44ad]/10 dark:bg-[#8e44ad]/20 text-[#8e44ad] dark:text-[#b370d4]">
                  <Briefcase size={11} />
                  <span>{phrase.category}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyPhrase(phrase)}
                    title="Sao chép câu"
                    className="p-1 rounded-md text-[#8a8074] hover:text-[#1f1a16] dark:hover:text-[#f5f0eb] transition-colors cursor-pointer"
                  >
                    {copiedId === phrase.id ? (
                      <Check size={14} className="text-[#2e7d58]" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <KeigoAudioButton text={phrase.phraseJp} size="xs" />
                </div>
              </div>

              {/* Japanese phrase */}
              <h4 className="font-serif font-bold text-[14.5px] text-[#1f1a16] dark:text-[#f5f0eb] leading-snug tracking-tight mb-2">
                {phrase.phraseJp}
              </h4>
            </div>

            {/* Vietnamese meaning */}
            <p className="text-xs text-[#70665a] dark:text-[#aaa094] pt-2 border-t border-black/[0.05] dark:border-white/[0.06] leading-relaxed">
              {phrase.meaningVn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
