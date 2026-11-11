import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DocsListClient from "@/components/docs/DocsListClient";
import { getAllDocs } from "@/lib/docs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài liệu PDF | 資料",
  description: "Đọc tài liệu PDF tham khảo JLPT N2 trên web.",
};

export default function DocsPage() {
  const docs = getAllDocs();

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-5">
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb]">
              資料 · Tài liệu
            </h1>
            <p className="text-sm text-[#8a8074] mt-1">
              {docs.length} file PDF · chạm để đọc trên web
            </p>
          </div>
          <DocsListClient docs={docs} />
        </main>
      </div>
    </div>
  );
}
