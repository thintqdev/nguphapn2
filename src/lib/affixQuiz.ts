import type {
  AffixExample,
  AffixProgressRecord,
  AffixQuizKind,
  AffixQuizQuestion,
  AffixWithKind,
} from "./affixTypes";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Nghĩa ngắn để hiện option (tránh đoạn dài). */
export function shortMeaning(meaning: string, max = 42): string {
  const cut = meaning.split(/[（(、,.]/)[0]?.trim() || meaning.trim();
  if (cut.length <= max) return cut;
  return cut.slice(0, max - 1) + "…";
}

function pickExample(item: AffixWithKind): AffixExample | null {
  if (!item.examples?.length) return null;
  return item.examples[Math.floor(Math.random() * item.examples.length)];
}

function blankWord(item: AffixWithKind, word: string): string {
  if (item.kind === "prefix" && word.startsWith(item.kanji)) {
    return "＿" + word.slice(item.kanji.length);
  }
  if (item.kind === "suffix" && word.endsWith(item.kanji)) {
    return word.slice(0, -item.kanji.length) + "＿";
  }
  return word.replace(item.kanji, "＿");
}

function pickDistractors(
  pool: AffixWithKind[],
  correct: AffixWithKind,
  getValue: (item: AffixWithKind) => string,
  count: number
): string[] {
  const answer = getValue(correct);
  const candidates = shuffle(
    pool.filter((i) => i.id !== correct.id && getValue(i) !== answer)
  );
  const values: string[] = [];
  for (const c of candidates) {
    const v = getValue(c);
    if (!values.includes(v)) values.push(v);
    if (values.length >= count) break;
  }
  return values;
}

function buildOne(
  kind: AffixQuizKind,
  item: AffixWithKind,
  pool: AffixWithKind[]
): AffixQuizQuestion | null {
  if (kind === "fill_affix") {
    const ex = pickExample(item);
    if (!ex) return null;
    const distractors = pickDistractors(pool, item, (a) => a.kanji, 3);
    if (distractors.length < 3) return null;
    return {
      id: `${item.id}-fill-${ex.word}`,
      kind,
      promptSub:
        item.kind === "prefix"
          ? "Điền tiền tố phù hợp"
          : "Điền hậu tố phù hợp",
      prompt: `${ex.reading} · ${ex.meaning}`,
      promptMain: blankWord(item, ex.word),
      options: shuffle([item.kanji, ...distractors]),
      answer: item.kanji,
      item,
      example: ex,
    };
  }

  if (kind === "affix_to_meaning") {
    const answer = shortMeaning(item.meaning);
    const distractors = pickDistractors(
      pool,
      item,
      (a) => shortMeaning(a.meaning),
      3
    );
    if (distractors.length < 3) return null;
    return {
      id: `${item.id}-mean`,
      kind,
      promptSub:
        item.kind === "prefix"
          ? "接頭語 này nghĩa gì?"
          : "接尾語 này nghĩa gì?",
      prompt: `${item.hiragana} · ${item.romaji}`,
      promptMain: item.kanji,
      options: shuffle([answer, ...distractors]),
      answer,
      item,
    };
  }

  // meaning_to_affix
  const answer = item.kanji;
  const distractors = pickDistractors(pool, item, (a) => a.kanji, 3);
  if (distractors.length < 3) return null;
  return {
    id: `${item.id}-pick`,
    kind: "meaning_to_affix",
    promptSub: "Chọn 接辞 đúng với nghĩa",
    prompt: shortMeaning(item.meaning, 64),
    promptMain: shortMeaning(item.meaning, 64),
    options: shuffle([answer, ...distractors]),
    answer,
    item,
  };
}

const KINDS: AffixQuizKind[] = [
  "fill_affix",
  "affix_to_meaning",
  "meaning_to_affix",
];

/** Session quiz: mặc định 12 câu, xen 3 kiểu. */
export function buildAffixQuizSession(
  items: AffixWithKind[],
  count = 12
): AffixQuizQuestion[] {
  if (items.length < 4) return [];

  const shuffled = shuffle(items);
  const questions: AffixQuizQuestion[] = [];
  let kindIdx = 0;

  for (const item of shuffled) {
    if (questions.length >= count) break;
    const kind = KINDS[kindIdx % KINDS.length];
    kindIdx++;
    const q = buildOne(kind, item, items);
    if (q) questions.push(q);
  }

  // Bổ sung nếu thiếu (đổi kind)
  let guard = 0;
  while (questions.length < count && guard < items.length * 3) {
    guard++;
    const item = shuffled[guard % shuffled.length];
    const kind = KINDS[(kindIdx + guard) % KINDS.length];
    const q = buildOne(kind, item, items);
    if (q && !questions.some((x) => x.id === q.id)) questions.push(q);
  }

  return questions;
}

export const AFFIX_PROGRESS_KEY = "n2_affix_progress";

export function loadAffixProgress(): AffixProgressRecord {
  try {
    const raw = localStorage.getItem(AFFIX_PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AffixProgressRecord;
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

export function saveAffixProgress(
  patch: Partial<AffixProgressRecord>
): AffixProgressRecord {
  const prev = loadAffixProgress();
  const next: AffixProgressRecord = {
    knownIds: patch.knownIds ?? prev.knownIds,
    quizBest: { ...(prev.quizBest ?? {}), ...(patch.quizBest ?? {}) },
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(AFFIX_PROGRESS_KEY, JSON.stringify(next));
  return next;
}
