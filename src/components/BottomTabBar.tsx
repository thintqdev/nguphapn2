"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles, Heart, BarChart3, Settings } from "lucide-react";
import { useFavorites } from "./FavoritesContext";

export default function BottomTabBar() {
  const pathname = usePathname();
  const { totalFavorites } = useFavorites();

  const tabs = [
    { label: "文法", href: "/", icon: BookOpen, badge: null },
    { label: "敬語", href: "/keigo", icon: Sparkles, badge: null },
    {
      label: "お気に入り",
      href: "/favorites",
      icon: Heart,
      badge: totalFavorites > 0 ? totalFavorites : null,
    },
    { label: "学習記録", href: "/history", icon: BarChart3, badge: null },
    { label: "設定", href: "/settings", icon: Settings, badge: null },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 ios-glass bg-[#faf7f2]/90 dark:bg-[#14110f]/90 border-t border-black/[0.08] dark:border-white/[0.08] px-3 pt-2 pb-5 transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/"
              ? pathname === "/" || pathname.startsWith("/grammar")
              : pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 relative select-none transition-transform active:scale-90 ${
                isActive
                  ? "text-[#df6e53] dark:text-[#f39882]"
                  : "text-[#8a8074] dark:text-[#9e9285]"
              }`}
            >
              <div className="relative">
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.3 : 1.9}
                  className="transition-colors"
                />
                {tab.badge !== null && (
                  <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#df6e53] text-white text-[10px] font-bold flex items-center justify-center shadow-2xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium tracking-tight ${
                  isActive ? "font-semibold text-[#df6e53] dark:text-[#f39882]" : ""
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
