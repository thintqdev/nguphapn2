import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ExamListClient from "@/components/exam/ExamListClient";
import { getAllExams } from "@/lib/exam";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thi thử JLPT N2 | 模擬試験",
  description:
    "Làm đề thi thử JLPT N2 có đồng hồ, chấm điểm sau khi nộp bài.",
};

export default function ExamListPage() {
  const exams = getAllExams();

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header backHref="/" backLabel="Về trang chủ" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <ExamListClient exams={exams} />
        </main>
      </div>
    </div>
  );
}
