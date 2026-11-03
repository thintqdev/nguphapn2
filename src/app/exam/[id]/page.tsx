import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ExamPlayer from "@/components/exam/ExamPlayer";
import { getExamById, getExamPaths } from "@/lib/exam";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getExamPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const exam = getExamById(id);
  if (!exam) return { title: "Không tìm thấy đề thi" };
  return {
    title: `${exam.test_title} | Thi thử N2`,
    description: `Thi thử ${exam.total_questions} câu — nộp bài mới xem đáp án.`,
  };
}

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = getExamById(id);
  if (!exam) notFound();

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header backHref="/exam" backLabel="Danh sách đề thi" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <ExamPlayer exam={exam} />
        </main>
      </div>
    </div>
  );
}
