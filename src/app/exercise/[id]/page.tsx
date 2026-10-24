import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ExercisePlayer from "@/components/exercise/ExercisePlayer";
import { getAllExercises, getExerciseById, getExercisePaths } from "@/lib/exercises";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getExercisePaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const exercise = getExerciseById(id);

  if (!exercise) {
    return {
      title: "Không tìm thấy bài tập | JLPT N2",
    };
  }

  return {
    title: `${exercise.title} | JLPT N2 練習問題`,
    description: `Luyện tập 50 câu hỏi trắc nghiệm ngữ pháp tiếng Nhật N2 kèm lời giải chi tiết.`,
  };
}

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise = getExerciseById(id);

  if (!exercise) {
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* iOS Translucent Navigation Bar */}
        <Header backHref="/exercise" backLabel="Danh sách bài tập" />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <ExercisePlayer exercise={exercise} />
        </main>
      </div>
    </div>
  );
}
