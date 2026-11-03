import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import KanjiListClient from "@/components/kanji/KanjiListClient";
import { getAllKanjiLessons } from "@/lib/kanji";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Học Kanji N2 | JLPT N2 漢字",
  description:
    "Học kanji JLPT N2 theo bài: study desk từng chữ và quiz nhận diện Hán Việt, nghĩa, ví dụ.",
};

export default function KanjiListPage() {
  const lessons = getAllKanjiLessons();

  return (
    <div className="flex min-h-screen bg-[#f5f3ee] dark:bg-[#0d0c0a] text-[#1d1b19] dark:text-[#f5f0eb] transition-colors pb-24 md:pb-8">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <KanjiListClient lessons={lessons} />
        </main>
      </div>
    </div>
  );
}
