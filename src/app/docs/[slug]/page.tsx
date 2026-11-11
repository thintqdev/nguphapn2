import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PageBackLink from "@/components/PageBackLink";
import PdfViewer from "@/components/docs/PdfViewer";
import { getDocBySlug, getDocPaths } from "@/lib/docs";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getDocPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(decodeURIComponent(slug));
  if (!doc) return { title: "Không tìm thấy tài liệu | JLPT N2" };
  return {
    title: `${doc.title} | 資料`,
    description: `Đọc ${doc.filename}`,
  };
}

export default async function DocViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(decodeURIComponent(slug));
  if (!doc) notFound();

  return (
    <div
      className="flex overflow-hidden bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors"
      style={{ height: "100dvh" }}
    >
      <Sidebar />
      <div className="flex flex-col min-w-0" style={{ flex: 1, minHeight: 0 }}>
        <div className="hidden md:block shrink-0">
          <Header />
        </div>
        <main
          className="flex flex-col w-full px-3 sm:px-4 lg:px-6 pt-3 md:pt-2 pb-3"
          style={{ flex: 1, minHeight: 0 }}
        >
          <div className="hidden md:flex items-center gap-3 mb-2 shrink-0">
            <PageBackLink
              href="/docs"
              label="Tài liệu"
              className="mb-0 shrink-0"
            />
            <div className="min-w-0">
              <h1 className="font-serif font-bold text-base sm:text-lg truncate text-[#1f1a16] dark:text-[#f5f0eb]">
                {doc.title}
              </h1>
              <p className="text-[11px] text-[#8a8074]">
                {doc.filename} · {doc.sizeLabel}
              </p>
            </div>
          </div>
          <PdfViewer
            title={doc.title}
            url={doc.url}
            sizeLabel={doc.sizeLabel}
            filename={doc.filename}
          />
        </main>
      </div>
    </div>
  );
}
