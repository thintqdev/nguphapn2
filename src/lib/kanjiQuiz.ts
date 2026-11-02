import type { KanjiItem, KanjiQuizKind, KanjiQuizQuestion } from "./kanjiTypes";
import { parseKanjiExamples } from "./kanjiUtils";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(
  pool: KanjiItem[],
  correct: KanjiItem,
  getValue: (item: KanjiItem) => string,
  count: number
): string[] {
  const answer = getValue(correct);
  const candidates = shuffle(
    pool.filter((i) => i.stt !== correct.stt && getValue(i) !== answer)
  );
  const values: string[] = [];
  for (const c of candidates) {
    const v = getValue(c);
    if (!values.includes(v)) values.push(v);
    if (values.length >= count) break;
  }
  return values;
}

function blankExample(item: KanjiItem): string {
  const parts = parseKanjiExamples(item.vi_du);
  if (parts.length > 0) {
    const first = parts[0];
    const blanked = first.compound.replaceAll(item.kanji, "＿");
    const reading = first.reading ? `（${first.reading}）` : "";
    const meaning = first.meaning ? ` — ${first.meaning}` : "";
    return `${blanked}${reading}${meaning}`;
  }
  return item.vi_du.replaceAll(item.kanji, "＿");
}

function buildOne(
  kind: KanjiQuizKind,
  item: KanjiItem,
  pool: KanjiItem[]
): KanjiQuizQuestion | null {
  if (kind === "kanji_to_hanviet") {
    const answer = item.han_viet;
    const distractors = pickDistractors(pool, item, (i) => i.han_viet, 3);
    if (distractors.length < 2) return null;
    return {
      id: `${item.stt}-hv`,
      kind,
      item,
      prompt: item.kanji,
      promptSub: "Chọn Hán Việt đúng",
      options: shuffle([answer, ...distractors]).slice(0, 4),
      answer,
    };
  }

  if (kind === "meaning_to_kanji") {
    const answer = item.kanji;
    const distractors = pickDistractors(pool, item, (i) => i.kanji, 3);
    if (distractors.length < 2) return null;
    return {
      id: `${item.stt}-mk`,
      kind,
      item,
      prompt: item.giai_thich,
      promptSub: `Hán Việt: ${item.han_viet}`,
      options: shuffle([answer, ...distractors]).slice(0, 4),
      answer,
    };
  }

  // example_to_kanji
  const answer = item.kanji;
  const distractors = pickDistractors(pool, item, (i) => i.kanji, 3);
  if (distractors.length < 2) return null;
  return {
    id: `${item.stt}-ex`,
    kind,
    item,
    prompt: blankExample(item),
    promptSub: "Điền kanji còn thiếu",
    options: shuffle([answer, ...distractors]).slice(0, 4),
    answer,
  };
}

const KINDS: KanjiQuizKind[] = [
  "kanji_to_hanviet",
  "meaning_to_kanji",
  "example_to_kanji",
];

/** Tạo session quiz: mặc định 15 câu, xen 3 kiểu. */
export function buildKanjiQuizSession(
  items: KanjiItem[],
  size = 15
): KanjiQuizQuestion[] {
  if (items.length === 0) return [];

  const sampled = shuffle(items).slice(0, Math.min(size, items.length));
  const questions: KanjiQuizQuestion[] = [];

  sampled.forEach((item, idx) => {
    const kind = KINDS[idx % KINDS.length];
    const q = buildOne(kind, item, items);
    if (q) questions.push(q);
  });

  // Bổ sung nếu thiếu do distractor không đủ
  if (questions.length < Math.min(size, items.length)) {
    const used = new Set(questions.map((q) => q.id));
    for (const item of shuffle(items)) {
      for (const kind of KINDS) {
        const q = buildOne(kind, item, items);
        if (q && !used.has(q.id)) {
          questions.push(q);
          used.add(q.id);
        }
        if (questions.length >= size) break;
      }
      if (questions.length >= size) break;
    }
  }

  return questions.slice(0, size);
}

export const KANJI_PROGRESS_KEY = "n2_kanji_progress";
