"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";

export default function ExerciseAudioButton({
  text,
  size = "sm",
  className = "",
}: {
  text: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Clean text: remove question numbering like (1), brackets, stars, underscores
  const cleanText = text
    .replace(/^\(\d+\)\s*/, "")
    .replace(/[（）()★_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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

  return (
    <button
      onClick={handleSpeak}
      type="button"
      title="Nghe phát âm câu hỏi"
      className={`inline-flex items-center justify-center p-1.5 rounded-lg text-xs transition-all cursor-pointer active:scale-90 ${
        isPlaying
          ? "bg-[#df6e53] text-white shadow-xs"
          : "text-[#8a8074] dark:text-[#9e9387] hover:text-[#df6e53] dark:hover:text-[#f39882] hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
      } ${className}`}
    >
      <Volume2 size={iconSizes[size]} className={isPlaying ? "animate-pulse" : ""} />
    </button>
  );
}
