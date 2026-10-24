"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles, CheckSquare, Heart, BarChart3, Settings } from "lucide-react";
import { useFavorites } from "./FavoritesContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { totalFavorites } = useFavorites();

  const navItems = [
    { label: "文法一覧", href: "/", icon: BookOpen, badge: null },
    { label: "敬語・謙譲語", href: "/keigo", icon: Sparkles, badge: "N2" },
    { label: "練習問題", href: "/exercise", icon: CheckSquare, badge: "50問" },
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
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between min-h-screen ios-glass bg-[#fbf9f5]/85 dark:bg-[#14110f]/85 border-r border-black/[0.06] dark:border-white/[0.07] p-5 select-none relative transition-colors">
      <div>
        {/* iOS App Icon Header */}
        <Link href="/" className="flex items-center gap-3.5 mb-7 group">
          <div className="w-11 h-11 rounded-[14px] bg-gradient-to-tr from-[#df6e53] to-[#ef927c] flex items-center justify-center text-white shadow-md shadow-[#df6e53]/25 ring-1 ring-black/10 dark:ring-white/20 group-hover:scale-105 active:scale-95 transition-all">
            <span className="font-serif font-black text-xl tracking-wider drop-shadow-xs">文</span>
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#1f1a16] dark:text-[#f5f0eb] tracking-tight group-hover:text-[#a44d36] dark:group-hover:text-[#f39882] transition-colors">
              N2 文法
            </h1>
            <p className="text-[11px] text-[#8c8276] dark:text-[#9e9387] font-medium tracking-wider">
              日本語を、もっと身近に
            </p>
          </div>
        </Link>

        {/* macOS / iPadOS Sidebar Group */}
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9d9387] dark:text-[#7f7468] px-3 mb-2">
          ライブラリ
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/" || pathname.startsWith("/grammar")
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-[13px] font-medium transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? "bg-[#a44d36]/12 dark:bg-[#f39882]/15 text-[#a44d36] dark:text-[#f39882] font-semibold shadow-2xs"
                    : "text-[#5e554c] dark:text-[#a89d91] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[#1f1a16] dark:hover:text-[#f5f0eb]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.9}
                    className={
                      isActive
                        ? "text-[#a44d36] dark:text-[#f39882]"
                        : "text-[#8a8074] dark:text-[#7f7468]"
                    }
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#a44d36]/15 dark:bg-[#f39882]/20 text-[#a44d36] dark:text-[#f39882]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Quote & iOS Card with Cat */}
      <div className="pt-5 border-t border-black/[0.06] dark:border-white/[0.07] relative">
        <div className="flex items-start justify-between">
          {/* Vertical Japanese calligraphy quote */}
          <div className="flex flex-col items-center text-[12px] text-[#8e8479] dark:text-[#887b6e] font-serif tracking-widest pl-2 space-y-2 writing-vertical-lr select-none">
            <span className="leading-relaxed">一歩ずつ、</span>
            <span className="leading-relaxed">未来へ。</span>
            <span className="w-4 h-4 rounded-xs border border-[#cf5e4f] text-[#cf5e4f] text-[9px] flex items-center justify-center font-serif mt-1 shadow-2xs">
              印
            </span>
          </div>

          {/* iOS Rounded Card Cat Widget */}
          <div className="relative w-36 h-36 rounded-[18px] overflow-hidden bg-gradient-to-b from-[#e3eff6] to-[#f2e2da] dark:from-[#25323a] dark:to-[#382622] border border-black/[0.06] dark:border-white/[0.1] shadow-xs group cursor-pointer active:scale-98 transition-all">
            <img
              src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=300&q=80"
              alt="Japanese scenic cat"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-[10px] text-white/95 font-serif font-light drop-shadow-xs">
                桜と黒猫の庭
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
