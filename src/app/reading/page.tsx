import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ReadingGuideClient from "@/components/reading/ReadingGuideClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "読解 · Hành trình đọc hiểu N2",
  description:
    "Cẩm nang phương pháp đọc hiểu JLPT N2: tư duy, 4 giai đoạn, checklist, từ vựng và chủ đề dự đoán.",
};

export default function ReadingPage() {
  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl w-full mx-auto">
          <ReadingGuideClient />
        </main>
      </div>
    </div>
  );
}
