import type { ReadingTopicVocab, ReadingWord } from "./readingGuideTypes";

export const READING_VOCAB_PROGRESS_KEY = "n2_reading_vocab_progress";

export interface VocabItem extends ReadingWord {
  id: string;
  topicId: number;
}

export interface ReadingVocabProgress {
  knownIds: string[];
  quizBest: Record<string, number>;
  updatedAt: string;
}

export type VocabQuizKind = "word_to_meaning" | "meaning_to_word";

export interface VocabQuizQuestion {
  id: string;
  kind: VocabQuizKind;
  prompt: string;
  promptSub: string;
  options: string[];
  answer: string;
  item: VocabItem;
}

export function vocabWordId(topicId: number, word: ReadingWord): string {
  return `t${topicId}:${word.word}:${word.reading}`;
}

export function flattenTopicWords(topic: ReadingTopicVocab): VocabItem[] {
  return topic.words.map((w) => ({
    ...w,
    id: vocabWordId(topic.topic_id, w),
    topicId: topic.topic_id,
  }));
}

export function shortMeaning(meaning: string, max = 36): string {
  const cut = meaning.split(/[（(、,.]/)[0]?.trim() || meaning.trim();
  if (cut.length <= max) return cut;
  return cut.slice(0, max - 1) + "…";
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function loadVocabProgress(): ReadingVocabProgress {
  try {
    const raw = localStorage.getItem(READING_VOCAB_PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ReadingVocabProgress;
      return {
        knownIds: Array.isArray(parsed.knownIds) ? parsed.knownIds : [],
        quizBest: parsed.quizBest ?? {},
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      };
    }
  } catch {
    // ignore
  }
  return { knownIds: [], quizBest: {}, updatedAt: new Date().toISOString() };
}

export function saveVocabProgress(
  patch: Partial<ReadingVocabProgress>
): ReadingVocabProgress {
  const prev = loadVocabProgress();
  const next: ReadingVocabProgress = {
    knownIds: patch.knownIds ?? prev.knownIds,
    quizBest: { ...prev.quizBest, ...(patch.quizBest ?? {}) },
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(READING_VOCAB_PROGRESS_KEY, JSON.stringify(next));
  return next;
}

function pickDistractors(
  pool: VocabItem[],
  correct: VocabItem,
  getValue: (w: VocabItem) => string,
  count: number
): string[] {
  const answer = getValue(correct);
  const candidates = shuffle(
    pool.filter((w) => w.id !== correct.id && getValue(w) !== answer)
  );
  const values: string[] = [];
  for (const c of candidates) {
    const v = getValue(c);
    if (!values.includes(v)) values.push(v);
    if (values.length >= count) break;
  }
  return values;
}

export function buildVocabQuizSession(
  items: VocabItem[],
  count = 10
): VocabQuizQuestion[] {
  if (items.length < 4) return [];
  const pool = shuffle(items);
  const questions: VocabQuizQuestion[] = [];
  let i = 0;

  while (questions.length < Math.min(count, items.length) && i < items.length * 3) {
    const item = pool[i % pool.length];
    i++;
    const kind: VocabQuizKind =
      questions.length % 2 === 0 ? "word_to_meaning" : "meaning_to_word";

    if (kind === "word_to_meaning") {
      const answer = shortMeaning(item.meaning);
      const distractors = pickDistractors(
        items,
        item,
        (w) => shortMeaning(w.meaning),
        3
      );
      if (distractors.length < 3) continue;
      questions.push({
        id: `${item.id}-w2m-${questions.length}`,
        kind,
        promptSub: "Từ này nghĩa gì?",
        prompt: `${item.word}\n${item.reading}`,
        options: shuffle([answer, ...distractors]),
        answer,
        item,
      });
    } else {
      const answer = item.word;
      const distractors = pickDistractors(items, item, (w) => w.word, 3);
      if (distractors.length < 3) continue;
      questions.push({
        id: `${item.id}-m2w-${questions.length}`,
        kind,
        promptSub: "Chọn từ đúng với nghĩa",
        prompt: shortMeaning(item.meaning, 64),
        options: shuffle([answer, ...distractors]),
        answer,
        item,
      });
    }
  }

  return questions;
}
