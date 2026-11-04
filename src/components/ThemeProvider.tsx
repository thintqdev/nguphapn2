"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_SKIN,
  normalizeSkinId,
  SKIN_STORAGE_KEY,
  type SkinId,
} from "@/lib/skins";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  skin: SkinId;
  setSkin: (id: SkinId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  skin: DEFAULT_SKIN,
  setSkin: () => {},
});

function applySkin(skin: SkinId) {
  document.documentElement.setAttribute("data-skin", skin);
}

function applyDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [skin, setSkinState] = useState<SkinId>(DEFAULT_SKIN);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("n2_theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const shouldBeDark =
        savedTheme === "dark" || (!savedTheme && systemPrefersDark);

      setIsDark(shouldBeDark);
      applyDark(shouldBeDark);

      const nextSkin = normalizeSkinId(localStorage.getItem(SKIN_STORAGE_KEY));
      setSkinState(nextSkin);
      applySkin(nextSkin);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    applyDark(nextDark);
    localStorage.setItem("n2_theme", nextDark ? "dark" : "light");
  };

  const setSkin = (id: SkinId) => {
    const next = normalizeSkinId(id);
    setSkinState(next);
    applySkin(next);
    localStorage.setItem(SKIN_STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, skin, setSkin }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
