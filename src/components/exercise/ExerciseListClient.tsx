"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ExerciseMeta, ExerciseResultRecord } from "@/lib/exerciseTypes";
import {
  CheckSquare,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ListOrdered,
  FileCheck,
} from "lucide-react";

interface ExerciseListClientProps {
  exercises: ExerciseMeta[];
}

export default function ExerciseListClient({ exercises }: ExerciseListClientProps) {
  const [records, setRecords] = useState<ExerciseResultRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "unattempted">("all");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("n2_exercise_records");
      if (saved) {
        setRecords(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Map exerciseId to best record
  const bestScores = exercises.reduce((acc, ex) => {
    const exRecords = records.filter((r) => r.exerciseId === ex.id);
    if (exRecords.length > 0) {
      // Find highest score
      const best = exRecords.reduce((max, r) => (r.score > max.score ? r : max), exRecords[0]);
      acc[ex.id] = best;
    }
    return acc;
  }, {} as Record<string, ExerciseResultRecord>);

  const filteredExercises = exercises.filter((ex) => {
    const isCompleted = !!bestScores[ex.id];
    if (filter === "completed") return isCompleted;
    if (filter === "unattempted") return !isCompleted;
    return true;
  });

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#f8ede8] via-[#fbf5f2] to-[#f4ebe6] dark:from-[#2a1d18] dark:via-[#1e1714] dark:to-[#171210] p-5 sm:p-7 border border-[#df6e53]/20 dark:border-[#df6e53]/25 shadow-sm">
        {/* Calligraphy watermark */}
        <div className="absolute right-4 -bottom-6 font-serif font-black text-8xl sm:text-9xl text-[#df6e53]/10 dark:text-[#df6e53]/10 pointer-events-none select-none">
          問
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#df6e53]/15 dark:bg-[#df6e53]/25 text-[#df6e53] dark:text-[#f39882] text-[11px] font-bold tracking-wide uppercase mb-3">
            <CheckSquare size={13} />
            <span>Kho đề luyện tập & Thi thử JLPT N2</span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb] tracking-tight leading-tight mb-2">
            N2 文法 練習問題
          </h1>
          <p className="text-xs sm:text-sm text-[#70665a] dark:text-[#b8aba0] leading-relaxed mb-4">
            Đề thi mô phỏng định dạng JLPT thực tế với đầy đủ 50 câu: câu trắc nghiệm chọn từ thích hợp và bài tập sắp xếp câu dấu sao (★), đi kèm phân tích giải thích ngữ pháp chi tiết.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[#8a8074] dark:text-[#9e9285] font-medium bg-black/[0.04] dark:bg-white/[0.06] px-3.5 py-2.5 rounded-[14px]">
              <span>{exercises.length} Bộ đề</span>
              <span>•</span>
              <span>50 Câu / đề</span>
              <span>•</span>
              <span>Có đáp án & giải thích</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-[14px] select-none text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-[10px] font-medium transition-all cursor-pointer ${
              filter === "all"
                ? "bg-white dark:bg-[#201d19] text-[#1f1a16] dark:text-[#f5f0eb] shadow-xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486]"
            }`}
          >
            Tất cả ({exercises.length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-[10px] font-medium transition-all cursor-pointer ${
              filter === "completed"
                ? "bg-white dark:bg-[#201d19] text-[#2e7d58] dark:text-[#52c28d] shadow-xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486]"
            }`}
          >
            Đã hoàn thành ({Object.keys(bestScores).length})
          </button>
          <button
            onClick={() => setFilter("unattempted")}
            className={`px-3 py-1.5 rounded-[10px] font-medium transition-all cursor-pointer ${
              filter === "unattempted"
                ? "bg-white dark:bg-[#201d19] text-[#df6e53] dark:text-[#f39882] shadow-xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486]"
            }`}
          >
            Chưa làm ({exercises.length - Object.keys(bestScores).length})
          </button>
        </div>
      </div>

      {/* Exercises List Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredExercises.map((ex) => {
          const best = bestScores[ex.id];

          return (
            <div
              key={ex.id}
              className="p-5 sm:p-6 rounded-[24px] bg-white/95 dark:bg-[#1a1714]/95 ios-glass border border-black/[0.06] dark:border-white/[0.08] shadow-xs hover:border-[#df6e53]/30 dark:hover:border-[#df6e53]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              {/* Left Info */}
              <div className="space-y-2.5 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#df6e53]/15 text-[#df6e53] dark:text-[#f39882] uppercase tracking-wider">
                    Đề số {ex.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#1f1a16] dark:text-[#f5f0eb]">
                    {ex.questionCount} Câu hỏi
                  </span>

                  {best && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#2e7d58]/15 text-[#2e7d58] dark:text-[#52c28d] flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      <span>
                        Điểm cao nhất: {best.score}/{best.total} ({Math.round((best.score / best.total) * 100)}%)
                      </span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1f1a16] dark:text-[#f5f0eb] group-hover:text-[#df6e53] dark:group-hover:text-[#f39882] transition-colors">
                  {ex.title}
                </h3>

                <p className="text-xs text-[#70665a] dark:text-[#aaa094] leading-relaxed">
                  {ex.description}
                </p>

                {/* Sub Features */}
                <div className="flex items-center gap-4 text-xs text-[#8a8074] dark:text-[#9e9285] pt-1">
                  <span className="flex items-center gap-1">
                    <ListOrdered size={14} className="text-[#df6e53]" />
                    <span>35 câu chọn từ</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} className="text-[#e67e22]" />
                    <span>15 câu dấu sao ★</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-[#0071e3]" />
                    <span>40 phút</span>
                  </span>
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
                <Link
                  href={`/exercise/${ex.id}`}
                  className="px-5 py-2.5 rounded-[16px] bg-[#df6e53] hover:bg-[#c95d43] active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#df6e53]/25 flex items-center gap-2 group/btn cursor-pointer"
                >
                  <span>{best ? "Làm lại bài" : "Bắt đầu làm"}</span>
                  <ArrowRight
                    size={15}
                    className="group-hover/btn:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide & Tips Card */}
      <div className="p-5 rounded-[22px] bg-white/80 dark:bg-[#1a1714]/80 ios-glass border border-black/[0.06] dark:border-white/[0.08] space-y-3">
        <h4 className="font-serif font-bold text-sm text-[#1f1a16] dark:text-[#f5f0eb] flex items-center gap-2">
          <BookOpen size={16} className="text-[#df6e53]" />
          <span>Mẹo làm bài thi ngữ pháp JLPT N2 đạt điểm cao</span>
        </h4>
        <ul className="text-xs text-[#5e5349] dark:text-[#b8ada2] space-y-1.5 list-disc pl-4 leading-relaxed">
          <li>
            <strong>Phân bổ thời gian:</strong> Phần ngữ pháp N2 gồm 20-25 câu trong đề thi thật, nên hoàn thành trong vòng 15-20 phút để dành thời gian cho phần Đọc hiểu (Dokkai).
          </li>
          <li>
            <strong>Bài tập sắp xếp câu dấu sao (★):</strong> Luôn ghép các cụm từ đi liền nhau trước (ví dụ: liên từ, trợ từ đi kèm động từ), sau đó xác định cấu trúc ngữ pháp chính để tìm vị trí của ★.
          </li>
          <li>
            <strong>Chế độ luyện tập:</strong> Bạn có thể bật chế độ Luyện tập để xem ngay lời giải từng câu và học ngữ nghĩa của 3 phương án gây nhiễu còn lại.
          </li>
        </ul>
      </div>
    </div>
  );
}
