"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart, Settings, PenLine, ClipboardList } from "lucide-react";
import { useFavorites } from "./FavoritesContext";

export default function BottomTabBar() {
  const pathname = usePathname();
  const { totalFavorites } = useFavorites();

  const tabs = [
    {
      label: "文法",
      href: "/",
      icon: BookOpen,
      badge: null as number | null,
      active:
        pathname === "/" ||
        pathname.startsWith("/grammar") ||
        pathname.startsWith("/keigo") ||
        pathname.startsWith("/exercise"),
    },
    {
      label: "漢字",
      href: "/kanji",
      icon: PenLine,
      badge: null,
      active: pathname.startsWith("/kanji"),
    },
    {
      label: "試験",
      href: "/exam",
      icon: ClipboardList,
      badge: null,
      active: pathname.startsWith("/exam"),
    },
    {
      label: "お気に入り",
      href: "/favorites",
      icon: Heart,
      badge: totalFavorites > 0 ? totalFavorites : null,
      active: pathname.startsWith("/favorites"),
    },
    {
      label: "設定",
      href: "/settings",
      icon: Settings,
      badge: null,
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 ios-glass bg-[#faf7f2]/90 dark:bg-[#14110f]/90 border-t border-black/[0.08] dark:border-white/[0.08] px-3 pt-2 pb-5 transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 relative select-none transition-transform active:scale-90 ${
                tab.active
                  ? "text-accent"
                  : "text-[#8a8074] dark:text-[#9e9285]"
              }`}
            >
              <div className="relative">
                <Icon
                  size={21}
                  strokeWidth={tab.active ? 2.3 : 1.9}
                  className="transition-colors"
                />
                {tab.badge !== null && (
                  <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium tracking-tight ${
                  tab.active
                    ? "font-semibold text-accent"
                    : ""
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
