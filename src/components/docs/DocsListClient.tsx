"use client";

import Link from "next/link";
import type { DocMeta } from "@/lib/docs";
import { FileText, ChevronRight } from "lucide-react";

interface DocsListClientProps {
  docs: DocMeta[];
}

export default function DocsListClient({ docs }: DocsListClientProps) {
  if (docs.length === 0) {
    return (
      <div className="rounded-[16px] border border-dashed border-black/[0.1] dark:border-white/[0.12] p-8 text-center">
        <FileText size={28} className="mx-auto text-[#8a8074] mb-3" />
        <p className="text-sm text-[#70665a] dark:text-[#b8aba0]">
          Chưa có file PDF. Thêm vào{" "}
          <code className="text-[12px] text-accent-muted">public/data/docs/</code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {docs.map((doc, i) => (
        <Link
          key={doc.slug}
          href={`/docs/${encodeURIComponent(doc.slug)}`}
          style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
          className="kanji-tile-enter flex items-center gap-3 rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90 px-4 py-3.5 hover:border-accent-border transition-all active:scale-[0.99]"
        >
          <span className="w-10 h-10 rounded-[12px] bg-accent/12 text-accent flex items-center justify-center shrink-0">
            <FileText size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-serif font-bold text-[15px] text-[#1f1a16] dark:text-[#f5f0eb] truncate">
              {doc.title}
            </p>
            <p className="text-[11px] text-[#8a8074] mt-0.5 truncate">
              {doc.filename} · {doc.sizeLabel}
            </p>
          </div>
          <ChevronRight size={16} className="text-[#8a8074] shrink-0" />
        </Link>
      ))}
    </div>
  );
}
