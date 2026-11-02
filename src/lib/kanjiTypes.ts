export interface KanjiItem {
  stt: number;
  kanji: string;
  han_viet: string;
  giai_thich: string;
  vi_du: string;
}

export interface KanjiLessonMeta {
  id: string;
  title: string;
  count: number;
  preview: string;
}

export interface KanjiLesson {
  id: string;
  title: string;
  count: number;
  items: KanjiItem[];
}

export interface KanjiExamplePart {
  compound: string;
  reading?: string;
  meaning?: string;
}

export type KanjiQuizKind = "kanji_to_hanviet" | "meaning_to_kanji" | "example_to_kanji";

export interface KanjiQuizQuestion {
  id: string;
  kind: KanjiQuizKind;
  item: KanjiItem;
  prompt: string;
  promptSub?: string;
  options: string[];
  answer: string;
}

export interface KanjiProgressRecord {
  lessonId: string;
  knownIds: number[];
  reviewIds: number[];
  quizBest?: number;
  updatedAt: string;
}
