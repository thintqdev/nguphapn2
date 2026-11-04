"use client";

import Link from "next/link";
import { useId } from "react";

type BrandLogoProps = {
  /** compact = icon only (mobile header) */
  variant?: "full" | "compact";
  className?: string;
};

function Mark({ size = 40, gradId }: { size?: number; gradId: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0 drop-shadow-sm"
    >
      <defs>
        <linearGradient id={gradId} x1="8" y1="2" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--accent-grad-from)" />
          <stop offset="0.55" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-grad-to)" />
        </linearGradient>
      </defs>
      {/* Soft square seal */}
      <rect x="1.5" y="1.5" width="37" height="37" rx="11" fill={`url(#${gradId})`} />
      {/* Inner ink ring */}
      <rect
        x="5"
        y="5"
        width="30"
        height="30"
        rx="8"
        stroke="white"
        strokeOpacity="0.28"
        strokeWidth="1.25"
      />
      {/* 文 — brush weight */}
      <text
        x="20"
        y="25.5"
        textAnchor="middle"
        fill="white"
        fontFamily="ui-serif, Georgia, 'Hiragino Mincho ProN', 'Yu Mincho', serif"
        fontSize="18"
        fontWeight="700"
        letterSpacing="-0.02em"
      >
        文
      </text>
      {/* N2 chip */}
      <rect x="22.5" y="4.5" width="13" height="11" rx="3.5" fill="#1f1a16" fillOpacity="0.88" />
      <text
        x="29"
        y="12.5"
        textAnchor="middle"
        fill="white"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="7.5"
        fontWeight="800"
        letterSpacing="0.04em"
      >
        N2
      </text>
    </svg>
  );
}

export default function BrandLogo({
  variant = "full",
  className = "",
}: BrandLogoProps) {
  const gradId = useId().replace(/:/g, "");

  if (variant === "compact") {
    return (
      <Link
        href="/"
        className={`inline-flex items-center active:scale-95 transition-transform ${className}`}
        aria-label="N2 文法 ホーム"
      >
        <Mark size={28} gradId={gradId} />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`flex items-center gap-3.5 group ${className}`}
      aria-label="N2 文法 ホーム"
    >
      <span className="group-hover:scale-[1.04] transition-transform duration-200">
        <Mark size={44} gradId={gradId} />
      </span>
      <span className="min-w-0">
        <span className="block font-serif font-bold text-[17px] leading-tight tracking-tight text-[#1f1a16] dark:text-[#f5f0eb]">
          N2 文法
        </span>
        <span className="mt-0.5 block text-[11px] font-medium tracking-wide text-[#8c8276] dark:text-[#9e9387]">
          JLPT · 語法マスター
        </span>
      </span>
    </Link>
  );
}
