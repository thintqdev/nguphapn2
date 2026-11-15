import type { ExamData, ExamQuestion, ExamSection } from "./examTypes";

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

/** Gom mọi câu trong section (questions hoặc sub_sections). */
export function getSectionQuestions(section: ExamSection): ExamQuestion[] {
  if (Array.isArray(section.questions) && section.questions.length > 0) {
    return section.questions;
  }
  if (Array.isArray(section.sub_sections)) {
    return section.sub_sections.flatMap((ss) =>
      Array.isArray(ss.questions) ? ss.questions : []
    );
  }
  return [];
}

export function getAllExamQuestions(exam: ExamData): ExamQuestion[] {
  if (!Array.isArray(exam.sections)) return [];
  return exam.sections.flatMap(getSectionQuestions);
}

export function countScorable(exam: ExamData): number {
  return getAllExamQuestions(exam).filter((q) => !!q.answer).length;
}

export function countSectionQuestions(section: {
  questions?: unknown[];
  sub_sections?: { questions?: unknown[] }[];
}): number {
  if (Array.isArray(section.questions)) return section.questions.length;
  if (Array.isArray(section.sub_sections)) {
    return section.sub_sections.reduce(
      (n, ss) => n + (Array.isArray(ss.questions) ? ss.questions.length : 0),
      0
    );
  }
  return 0;
}
