export interface AffixExample {
  word: string;
  reading: string;
  meaning: string;
}

export interface AffixItem {
  id: string;
  kanji: string;
  hiragana: string;
  romaji: string;
  meaning: string;
  usage_notes: string;
  examples: AffixExample[];
}

export type AffixKind = "prefix" | "suffix";

export interface AffixData {
  title: string;
  language: string;
  total_items: number;
  prefixes: AffixItem[];
  suffixes: AffixItem[];
}

export interface AffixWithKind extends AffixItem {
  kind: AffixKind;
}

export type AffixQuizKind = "fill_affix" | "affix_to_meaning" | "meaning_to_affix";

export interface AffixQuizQuestion {
  id: string;
  kind: AffixQuizKind;
  prompt: string;
  promptSub: string;
  /** Hiện thị lớn (kanji / chữ có ＿) */
  promptMain: string;
  options: string[];
  answer: string;
  item: AffixWithKind;
  example?: AffixExample;
}

export interface AffixProgressRecord {
  knownIds: string[];
  quizBest?: Partial<Record<AffixKind, number>>;
  updatedAt: string;
}
