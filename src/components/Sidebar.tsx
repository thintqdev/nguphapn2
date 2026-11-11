"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  CheckSquare,
  Heart,
  Settings,
  PenLine,
  ClipboardList,
  Layers,
} from "lucide-react";
import { useFavorites } from "./FavoritesContext";
import BrandLogo from "./BrandLogo";

function linkClass(active: boolean) {
  return `flex items-center justify-between px-3 py-2 rounded-[10px] text-[13px] font-medium transition-all active:scale-[0.98] ${
    active
      ? "bg-accent-soft text-accent-muted font-semibold"
      : "text-[#5e554c] dark:text-[#a89d91] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
  }`;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { totalFavorites } = useFavorites();

  const inGrammar =
    pathname === "/" ||
    pathname.startsWith("/grammar") ||
    pathname.startsWith("/keigo") ||
    pathname.startsWith("/exercise");

  const isList =
    pathname === "/" || pathname.startsWith("/grammar");
  const isKeigo = pathname.startsWith("/keigo");
  const isExercise = pathname.startsWith("/exercise");
  const isKanji = pathname.startsWith("/kanji");
  const isAffixes = pathname.startsWith("/affixes");
  const isExam = pathname.startsWith("/exam");
  const isFav = pathname.startsWith("/favorites");
  const isSettings = pathname.startsWith("/settings");

  return (
    <aside className="w-72 shrink-0 hidden md:flex flex-col justify-between min-h-screen ios-glass bg-[#fbf9f5]/85 dark:bg-[#14110f]/85 border-r border-black/[0.06] dark:border-white/[0.07] p-5 select-none transition-colors">
      <div>
        <div className="mb-7 px-0.5">
          <BrandLogo />
        </div>

        <nav className="space-y-4">
          {/* Grammar group */}
          <div>
            <p
              className={`px-3 mb-1.5 text-[11px] font-bold tracking-wide ${
                inGrammar
                  ? "text-accent-muted"
                  : "text-[#9d9387] dark:text-[#7f7468]"
              }`}
            >
              文法
            </p>
            <div className="space-y-0.5 pl-1">
              <Link href="/" className={linkClass(isList)}>
                <span className="flex items-center gap-2.5">
                  <BookOpen size={15} strokeWidth={isList ? 2.2 : 1.9} />
                  一覧
                </span>
              </Link>
              <Link href="/keigo" className={linkClass(isKeigo)}>
                <span className="flex items-center gap-2.5">
                  <Sparkles size={15} strokeWidth={isKeigo ? 2.2 : 1.9} />
                  敬語
                </span>
              </Link>
              <Link href="/exercise" className={linkClass(isExercise)}>
                <span className="flex items-center gap-2.5">
                  <CheckSquare size={15} strokeWidth={isExercise ? 2.2 : 1.9} />
                  練習
                </span>
              </Link>
            </div>
          </div>

          {/* Other learning */}
          <div>
            <p className="px-3 mb-1.5 text-[11px] font-bold tracking-wide text-[#9d9387] dark:text-[#7f7468]">
              学習
            </p>
            <div className="space-y-0.5">
              <Link href="/kanji" className={linkClass(isKanji)}>
                <span className="flex items-center gap-2.5">
                  <PenLine size={15} strokeWidth={isKanji ? 2.2 : 1.9} />
                  漢字
                </span>
              </Link>
              <Link href="/affixes" className={linkClass(isAffixes)}>
                <span className="flex items-center gap-2.5">
                  <Layers size={15} strokeWidth={isAffixes ? 2.2 : 1.9} />
                  接辞
                </span>
              </Link>
              <Link href="/exam" className={linkClass(isExam)}>
                <span className="flex items-center gap-2.5">
                  <ClipboardList size={15} strokeWidth={isExam ? 2.2 : 1.9} />
                  模擬試験
                </span>
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <p className="px-3 mb-1.5 text-[11px] font-bold tracking-wide text-[#9d9387] dark:text-[#7f7468]">
              その他
            </p>
            <div className="space-y-0.5">
              <Link href="/favorites" className={linkClass(isFav)}>
                <span className="flex items-center gap-2.5">
                  <Heart size={15} strokeWidth={isFav ? 2.2 : 1.9} />
                  お気に入り
                </span>
                {totalFavorites > 0 && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-accent-soft text-accent-muted">
                    {totalFavorites}
                  </span>
                )}
              </Link>
              <Link href="/settings" className={linkClass(isSettings)}>
                <span className="flex items-center gap-2.5">
                  <Settings size={15} strokeWidth={isSettings ? 2.2 : 1.9} />
                  設定
                </span>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.07]">
        <p className="px-3 font-serif text-[12px] text-[#8e8479] dark:text-[#887b6e] leading-relaxed">
          一歩ずつ、
          <br />
          未来へ。
        </p>
      </div>
    </aside>
  );
}
