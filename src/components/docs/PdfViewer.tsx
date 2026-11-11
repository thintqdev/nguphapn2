"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Download,
  ExternalLink,
  FileText,
  Smartphone,
} from "lucide-react";

interface PdfViewerProps {
  title: string;
  url: string;
  sizeLabel?: string;
  filename?: string;
}

function useIsMobilePdf(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mobile;
}

export default function PdfViewer({
  title,
  url,
  sizeLabel,
  filename,
}: PdfViewerProps) {
  const isMobile = useIsMobilePdf();

  // Mobile / cảm ứng: iframe PDF thường trống hoặc rất nhỏ (iOS Safari).
  // Mở bằng trình xem PDF gốc của máy — zoom/pinch tốt.
  if (isMobile) {
    return (
      <div className="flex flex-col min-h-0" style={{ flex: 1 }}>
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <Link
            href="/docs"
            className="inline-flex items-center gap-0.5 text-[13px] font-semibold text-accent shrink-0"
          >
            <ChevronLeft size={17} strokeWidth={2.5} />
            Tài liệu
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center rounded-[20px] border border-black/[0.08] dark:border-white/[0.1] bg-white/90 dark:bg-[#1a1714]/90 px-5 py-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-[16px] bg-accent/12 text-accent flex items-center justify-center">
            <FileText size={26} />
          </div>
          <h1 className="font-serif font-bold text-xl text-[#1f1a16] dark:text-[#f5f0eb] leading-snug">
            {title}
          </h1>
          {(filename || sizeLabel) && (
            <p className="text-[12px] text-[#8a8074] mt-1.5">
              {[filename, sizeLabel].filter(Boolean).join(" · ")}
            </p>
          )}

          <p className="mt-4 text-[13px] text-[#70665a] dark:text-[#b8aba0] leading-relaxed max-w-sm mx-auto">
            Trên điện thoại, đọc bằng{" "}
            <span className="font-semibold text-accent-muted">
              trình xem PDF của máy
            </span>{" "}
            sẽ to chữ và zoom/pinch được.
          </p>

          <a
            href={url}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-[16px] bg-accent hover:bg-accent-hover text-white text-sm font-bold active:scale-[0.98]"
          >
            <Smartphone size={16} />
            Đọc PDF ngay
          </a>

          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-[14px] text-[12px] font-semibold bg-black/[0.05] dark:bg-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb]"
            >
              <ExternalLink size={13} />
              Tab mới
            </a>
            <a
              href={url}
              download
              className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-[14px] text-[12px] font-semibold bg-black/[0.05] dark:bg-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb]"
            >
              <Download size={13} />
              Tải về
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-[14px] overflow-hidden border border-black/[0.08] dark:border-white/[0.1] bg-[#525659]"
      style={{ flex: 1, minHeight: 0 }}
    >
      <iframe
        title={title}
        src={`${url}#toolbar=1&navpanes=0&view=FitH`}
        className="border-0"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div className="absolute top-2 right-2 z-10 flex gap-1.5">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[11px] font-bold bg-black/55 text-white backdrop-blur-sm"
        >
          <ExternalLink size={12} />
          Tab mới
        </a>
        <a
          href={url}
          download
          className="inline-flex items-center justify-center p-1.5 rounded-[10px] bg-black/55 text-white backdrop-blur-sm"
          aria-label="Tải PDF"
        >
          <Download size={13} />
        </a>
      </div>
    </div>
  );
}
