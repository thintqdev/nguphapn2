export interface ExerciseQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  grammar_meanings?: Record<string, string>;
}

export interface ExerciseData {
  id: string;
  fileName: string;
  title: string;
  questionCount: number;
  questions: ExerciseQuestion[];
}

export interface ExerciseMeta {
  id: string;
  fileName: string;
  title: string;
  questionCount: number;
  description?: string;
}

export interface ExerciseResultRecord {
  exerciseId: string;
  score: number;
  total: number;
  date: string;
  mode: "practice" | "exam";
  timeSpentSeconds?: number;
}
