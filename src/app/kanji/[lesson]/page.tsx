import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import KanjiLessonClient from "@/components/kanji/KanjiLessonClient";
import { getKanjiLesson, getKanjiLessonPaths } from "@/lib/kanji";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getKanjiLessonPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lesson: string }>;
}): Promise<Metadata> {
  const { lesson: id } = await params;
  const lesson = getKanjiLesson(id);

  if (!lesson) {
    return { title: "Không tìm thấy bài kanji | JLPT N2" };
  }

  return {
    title: `${lesson.title} — Kanji N2 | JLPT`,
    description: `Học ${lesson.count} chữ kanji trong ${lesson.title} với study desk và quiz.`,
  };
}

export default async function KanjiLessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: id } = await params;
  const lesson = getKanjiLesson(id);

  if (!lesson) notFound();

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header backHref="/kanji" backLabel="Danh sách bài kanji" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <KanjiLessonClient lesson={lesson} />
        </main>
      </div>
    </div>
  );
}
