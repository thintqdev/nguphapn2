"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function KeigoAudioButton({
  text,
  size = "sm",
  className = "",
}: {
  text: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const cleanText = text.replace(/（[^）]+）/g, "").replace(/\/[^/]+/g, "").trim();

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText || text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.88;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
  };

  const btnClasses = {
    xs: "p-1 rounded-md text-[11px]",
    sm: "p-1.5 rounded-lg text-xs",
    md: "p-2 rounded-[10px] text-sm",
  };

  return (
    <button
      onClick={handleSpeak}
      type="button"
      title={`発音を聞く: ${text}`}
      className={`inline-flex items-center justify-center transition-all cursor-pointer active:scale-90 ${btnClasses[size]} ${
        isPlaying
          ? "bg-[#df6e53] text-white shadow-xs"
          : "text-[#8a8074] dark:text-[#9e9387] hover:text-[#df6e53] dark:hover:text-[#f39882] hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
      } ${className}`}
    >
      {isPlaying ? (
        <span className="flex items-center gap-1">
          <Volume2 size={iconSizes[size]} className="animate-pulse" />
        </span>
      ) : (
        <Volume2 size={iconSizes[size]} />
      )}
    </button>
  );
}
