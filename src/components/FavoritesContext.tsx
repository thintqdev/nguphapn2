"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  totalFavorites: 0,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("n2_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        // Mặc định lưu sẵn 1 bài "sai-ni" để trang favorites có sẵn dữ liệu mẫu cho người dùng trải nghiệm
        const initial = ["sai-ni"];
        setFavorites(initial);
        localStorage.setItem("n2_favorites", JSON.stringify(initial));
      }
    } catch {
      // ignore
    } finally {
      setMounted(true);
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      let updated: string[];
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
      } else {
        updated = [...prev, id];
      }
      try {
        localStorage.setItem("n2_favorites", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{
        favorites: mounted ? favorites : [],
        toggleFavorite,
        isFavorite,
        totalFavorites: mounted ? favorites.length : 0,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
