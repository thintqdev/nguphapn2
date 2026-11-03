"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ExerciseMeta, ExerciseResultRecord } from "@/lib/exerciseTypes";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ExerciseListClientProps {
  exercises: ExerciseMeta[];
}

export default function ExerciseListClient({ exercises }: ExerciseListClientProps) {
  const [records, setRecords] = useState<ExerciseResultRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "unattempted">("all");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("n2_exercise_records");
      if (saved) setRecords(JSON.parse(saved));
    } catch {
      // Ignore
    }
  }, []);

  const bestScores = exercises.reduce(
    (acc, ex) => {
      const exRecords = records.filter((r) => r.exerciseId === ex.id);
      if (exRecords.length > 0) {
        acc[ex.id] = exRecords.reduce(
          (max, r) => (r.score > max.score ? r : max),
          exRecords[0]
        );
      }
      return acc;
    },
    {} as Record<string, ExerciseResultRecord>
  );

  const filteredExercises = exercises.filter((ex) => {
    const isCompleted = !!bestScores[ex.id];
    if (filter === "completed") return isCompleted;
    if (filter === "unattempted") return !isCompleted;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb]">
          練習問題
        </h1>
        <p className="text-sm text-[#70665a] dark:text-[#b8aba0] mt-1.5">
          {exercises.length} bộ đề · Có đáp án & giải thích
        </p>
      </div>

      <div className="inline-flex p-1 rounded-[12px] bg-black/[0.04] dark:bg-white/[0.06] text-xs select-none">
        {(
          [
            ["all", `Tất cả (${exercises.length})`],
            ["completed", `Đã làm (${Object.keys(bestScores).length})`],
            [
              "unattempted",
              `Chưa làm (${exercises.length - Object.keys(bestScores).length})`,
            ],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-[9px] font-medium cursor-pointer transition-all ${
              filter === key
                ? "bg-white dark:bg-[#201d19] text-[#1f1a16] dark:text-[#f5f0eb] shadow-xs font-semibold"
                : "text-[#70665a] dark:text-[#a09486]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filteredExercises.map((ex) => {
          const best = bestScores[ex.id];
          return (
            <div
              key={ex.id}
              className="rounded-[16px] border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1714]/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#df6e53] dark:text-[#f39882] mb-0.5">
                  Đề {ex.id} · {ex.questionCount} câu
                </p>
                <h3 className="font-serif font-bold text-base text-[#1f1a16] dark:text-[#f5f0eb]">
                  {ex.title}
                </h3>
                {best && (
                  <p className="text-[11px] text-[#2e7d58] dark:text-[#52c28d] mt-1 inline-flex items-center gap-1 font-semibold">
                    <CheckCircle2 size={12} />
                    Cao nhất {best.score}/{best.total} (
                    {Math.round((best.score / best.total) * 100)}%)
                  </p>
                )}
              </div>
              <Link
                href={`/exercise/${ex.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-[#df6e53] hover:bg-[#c95d43] text-white text-sm font-semibold shrink-0 active:scale-[0.98]"
              >
                {best ? "Làm lại" : "Bắt đầu"}
                <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
