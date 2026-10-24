import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ExerciseListClient from "@/components/exercise/ExerciseListClient";
import { getAllExercises } from "@/lib/exercises";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luyện tập ngữ pháp N2 | Đề thi thử JLPT N2",
  description:
    "Kho đề thi thử và bài tập trắc nghiệm ngữ pháp tiếng Nhật JLPT N2 kèm bài tập sắp xếp câu dấu sao và lời giải chi tiết.",
};

export default function ExerciseListPage() {
  const exercises = getAllExercises();

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* iOS Translucent Navigation Bar */}
        <Header backHref="/" backLabel="Về trang chủ" />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <ExerciseListClient exercises={exercises} />
        </main>
      </div>
    </div>
  );
}
