"use client";

import type { JlptTrap } from "@/lib/keigoTypes";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import KeigoAudioButton from "./KeigoAudioButton";

export default function JlptTrapsSection({
  traps,
}: {
  traps: JlptTrap[];
}) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h3 className="font-serif font-bold text-lg text-[#1f1a16] dark:text-[#f5f0eb] flex items-center gap-2">
          <span>JLPT 試験でよく出る注意点 & 罠</span>
          <span className="text-xs font-normal text-[#8a8074] dark:text-[#9e9285] font-sans">
            (Bẫy thi JLPT hay gặp)
          </span>
        </h3>
        <p className="text-xs text-[#70665a] dark:text-[#aaa094] mt-0.5">
          Những lỗi sai kinh điển khiến thí sinh mất điểm oan trong phần Ngữ pháp N2 & N3:
        </p>
      </div>

      {/* Cards list */}
      <div className="space-y-3.5">
        {traps.map((trap, idx) => {
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-[20px] bg-white/90 dark:bg-[#1a1714]/90 ios-glass border border-[#e67e22]/20 dark:border-[#e67e22]/30 shadow-xs space-y-3"
            >
              {/* Header */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[10px] bg-[#e67e22]/15 dark:bg-[#e67e22]/25 text-[#d35400] dark:text-[#f39c12] flex items-center justify-center shrink-0">
                  <AlertTriangle size={15} />
                </div>
                <h4 className="font-serif font-bold text-[15px] text-[#1f1a16] dark:text-[#f5f0eb]">
                  {trap.ruleName}
                </h4>
              </div>

              {/* Explanation */}
              <p className="text-xs sm:text-[13px] text-[#4a423a] dark:text-[#ccc2b6] leading-relaxed">
                {trap.explanationVn}
              </p>

              {/* Example Card */}
              <div className="p-3.5 rounded-[14px] bg-[#fbf9f6] dark:bg-[#201d19] border border-black/[0.05] dark:border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8a8074] dark:text-[#9e9285] uppercase tracking-wider">
                    Ví dụ minh họa & Phân biệt
                  </span>
                  <KeigoAudioButton text={trap.examExampleJp} size="xs" />
                </div>

                <div className="font-serif text-[13px] text-[#1f1a16] dark:text-[#f5f0eb] leading-relaxed">
                  {trap.examExampleJp.split("->").map((part, pIdx) => {
                    const trimmed = part.trim();
                    const isIncorrect = trimmed.includes("✕");
                    const isCorrect = trimmed.includes("○");

                    return (
                      <div
                        key={pIdx}
                        className={`py-1 flex items-start gap-2 ${
                          isIncorrect
                            ? "text-[#c0392b] dark:text-[#e74c3c]"
                            : isCorrect
                            ? "text-[#27ae60] dark:text-[#2ecc71] font-semibold"
                            : ""
                        }`}
                      >
                        {pIdx > 0 && (
                          <span className="text-[#8a8074] dark:text-[#9e9285] font-sans font-bold">
                            ➔
                          </span>
                        )}
                        <span>{trimmed}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
