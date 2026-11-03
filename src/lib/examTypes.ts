export interface ExamQuestion {
  id: number;
  question?: string;
  target_word?: string;
  template?: string;
  options: string[];
  answer?: string;
  correct_order?: number[];
}

export interface ExamSection {
  section_id: string;
  instruction: string;
  reading_text?: string;
  questions: ExamQuestion[];
}

export interface ExamData {
  id: string;
  test_title: string;
  total_questions: number;
  sections: ExamSection[];
}

export interface ExamMeta {
  id: string;
  title: string;
  questionCount: number;
  sectionCount: number;
}

export interface ExamResultRecord {
  examId: string;
  score: number;
  total: number;
  timeSpentSeconds: number;
  date: string;
}

export const EXAM_DURATION_MINUTES = 60;
export const EXAM_RESULT_KEY = "n2_exam_results";
