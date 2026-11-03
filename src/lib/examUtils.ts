import type { ExamData, ExamQuestion } from "./examTypes";

/** Lấy số đáp án từ "1. xxx" hoặc "1" */
export function optionKey(option: string, index: number): string {
  const m = option.match(/^(\d+)\s*[.．、]/);
  return m ? m[1] : String(index + 1);
}

export function isExamAnswerCorrect(
  question: ExamQuestion,
  selected: string | undefined
): boolean | null {
  if (!question.answer) return null;
  if (!selected) return false;
  return selected === String(question.answer);
}

export function countScorable(exam: ExamData): number {
  return exam.sections.reduce(
    (n, s) => n + s.questions.filter((q) => !!q.answer).length,
    0
  );
}
