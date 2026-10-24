"use client";

import { useState } from "react";
import { Star, Volume2 } from "lucide-react";
import { useFavorites } from "./FavoritesContext";

export function FavoriteButton({ grammarId }: { grammarId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(grammarId);

  return (
    <button
      onClick={() => toggleFavorite(grammarId)}
      type="button"
      className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 ${
        isFav
          ? "bg-[#df6e53] border-[#df6e53] text-white shadow-sm shadow-[#df6e53]/30"
          : "bg-white/90 dark:bg-white/[0.12] backdrop-blur-md hover:bg-white dark:hover:bg-white/[0.18] border-black/[0.06] dark:border-white/[0.12] text-[#554a3e] dark:text-[#ded2c3]"
      }`}
    >
      <Star
        size={13}
        className={isFav ? "fill-white text-white" : "text-[#8e8274] dark:text-[#a89d91]"}
      />
      <span>{isFav ? "お気に入り済" : "お気に入り"}</span>
    </button>
  );
}

export function AudioPlayButton({
  text,
  size = "md",
  className = "",
}: {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playVoice = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (size === "lg") {
    return (
      <button
        onClick={playVoice}
        type="button"
        title="発音を聞く"
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/65 active:scale-90 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer ${className}`}
      >
        <Volume2 size={20} className={isPlaying ? "text-[#df6e53] animate-pulse" : ""} />
      </button>
    );
  }

  if (size === "sm") {
    return (
      <button
        onClick={playVoice}
        type="button"
        title="発音を聞く"
        className={`w-7 h-7 rounded-full text-black/40 dark:text-white/40 hover:text-[#a44d36] dark:hover:text-[#f39882] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer ${className}`}
      >
        <Volume2 size={15} className={isPlaying ? "text-[#df6e53]" : ""} />
      </button>
    );
  }

  return (
    <button
      onClick={playVoice}
      type="button"
      title="発音を聞く"
      className={`w-8 h-8 rounded-full bg-white dark:bg-[#2c2621] hover:bg-[#faf4ee] dark:hover:bg-[#342d27] text-[#a44d36] dark:text-[#f39882] flex items-center justify-center shadow-xs border border-black/[0.04] dark:border-white/[0.06] active:scale-90 transition-all cursor-pointer shrink-0 ${className}`}
    >
      <Volume2 size={16} className={isPlaying ? "text-[#df6e53] animate-pulse" : ""} />
    </button>
  );
}
