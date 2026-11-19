export interface ReadingWord {
  word: string;
  reading: string;
  meaning: string;
}

export interface ReadingSignalGroup {
  group: string;
  signals: string[];
  meaning_and_handling: string;
}

export interface ReadingStep {
  step: string;
  title: string;
  modes?: string[];
  details?: string[];
  note?: string;
  signal_groups?: ReadingSignalGroup[];
  clues?: string[];
}

export interface ReadingStage {
  stage_id: string;
  name: string;
  duration?: string;
  steps: ReadingStep[];
}

export interface ReadingMindset {
  title: string;
  description?: string;
  modes?: Record<string, string>;
}

export interface ReadingTopicVocab {
  topic_id: number;
  topic_name: string;
  words: ReadingWord[];
}

export interface ReadingTheme {
  theme_id: number;
  theme_name: string;
  common_argument_angles: string;
  keywords: ReadingWord[];
}

export interface ReadingGuideData {
  document_title: string;
  core_mindset: ReadingMindset[];
  reading_stages: ReadingStage[];
  exam_checklist: string[];
  topic_vocabulary: ReadingTopicVocab[];
  predicted_themes: ReadingTheme[];
}

export type ReadingModeFilter = "all" | "練習" | "本番";
