import type { KanjiExamplePart } from "./kanjiTypes";

/** Parse "握手(あくしゅ: bắt tay), 把握(はあく: ...)." thành các phần. */
export function parseKanjiExamples(viDu: string): KanjiExamplePart[] {
  if (!viDu?.trim()) return [];

  const parts: KanjiExamplePart[] = [];
  const chunks = viDu
    .split(/[,，、]/)
    .map((s) => s.trim().replace(/[。.]$/, ""))
    .filter(Boolean);

  for (const chunk of chunks) {
    const m = chunk.match(/^(.+?)\(([^:：]+)[:：]\s*(.+)\)$/);
    if (m) {
      parts.push({
        compound: m[1].trim(),
        reading: m[2].trim(),
        meaning: m[3].trim(),
      });
      continue;
    }

    const m2 = chunk.match(/^(.+?)\((.+)\)$/);
    if (m2) {
      parts.push({
        compound: m2[1].trim(),
        reading: m2[2].trim(),
      });
      continue;
    }

    parts.push({ compound: chunk });
  }

  return parts;
}
