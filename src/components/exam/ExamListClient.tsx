"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ExamMeta, ExamResultRecord } from "@/lib/examTypes";
import { EXAM_DURATION_MINUTES, EXAM_RESULT_KEY } from "@/lib/examTypes";
import { ClipboardList, Clock, ArrowRight } from "lucide-react";

interface ExamListClientProps {
  exams: ExamMeta[];
}

export default function ExamListClient({ exams }: ExamListClientProps) {
  const [results, setResults] = useState<ExamResultRecord[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(EXAM_RESULT_KEY);
      if (raw) setResults(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#1f1a16] dark:text-[#f5f0eb]">
          試験 · Thi thử
        </h1>
        <p className="text-sm text-[#70665a] dark:text-[#b8aba0] mt-1.5 leading-relaxed">
          Làm đề từ trên xuống, có đồng hồ. Chỉ xem đáp án sau khi nộp bài.
        </p>
      </div>

      <div className="space-y-3">
        {exams.map((exam) => {
          const best = results
            .filter((r) => r.examId === exam.id)
            .sort((a, b) => b.score / b.total - a.score / a.total)[0];

          return (
            <div
              key={exam.id}
              className="rounded-[18px] bg-white/90 dark:bg-[#1a1714]/90 border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#df6e53] dark:text-[#f39882] mb-1">
                  Đề {exam.id}
                </p>
                <h2 className="font-serif font-bold text-lg text-[#1f1a16] dark:text-[#f5f0eb]">
                  {exam.title}
                </h2>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-[#8a8074]">
                  <span className="inline-flex items-center gap-1">
                    <ClipboardList size={13} />
                    {exam.questionCount} câu · {exam.sectionCount} phần
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} />
                    {EXAM_DURATION_MINUTES} phút
                  </span>
                  {best && (
                    <span className="text-[#2e7d58] dark:text-[#52c28d] font-semibold">
                      Cao nhất: {best.score}/{best.total} (
                      {Math.round((best.score / best.total) * 100)}%)
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={`/exam/${exam.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-[14px] bg-[#df6e53] hover:bg-[#c95d43] text-white text-sm font-semibold shrink-0 active:scale-[0.98] transition-all"
              >
                Vào thi
                <ArrowRight size={15} />
              </Link>
            </div>
          );
        })}
      </div>

      {exams.length === 0 && (
        <p className="text-sm text-[#8a8074] text-center py-12">
          Chưa có đề thi.
        </p>
      )}
    </div>
  );
}
