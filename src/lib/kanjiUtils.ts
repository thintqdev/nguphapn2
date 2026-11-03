import type { KanjiExamplePart } from "./kanjiTypes";

/** Tách ví dụ theo dấu phẩy/gạch, nhưng không cắt bên trong (...). */
function splitExampleChunks(viDu: string): string[] {
  const chunks: string[] = [];
  let buf = "";
  let depth = 0;

  for (let i = 0; i < viDu.length; i++) {
    const ch = viDu[i];
    if (ch === "(" || ch === "（") {
      depth++;
      buf += ch;
      continue;
    }
    if (ch === ")" || ch === "）") {
      depth = Math.max(0, depth - 1);
      buf += ch;
      continue;
    }

    // Separators outside parens: , ， 、  or " / "
    if (depth === 0) {
      if (ch === "," || ch === "，" || ch === "、") {
        const t = buf.trim().replace(/[。.]$/, "");
        if (t) chunks.push(t);
        buf = "";
        continue;
      }
      if (ch === "/" && buf.trim()) {
        const t = buf.trim().replace(/[。.]$/, "");
        if (t) chunks.push(t);
        buf = "";
        continue;
      }
    }

    buf += ch;
  }

  const last = buf.trim().replace(/[。.]$/, "");
  if (last) chunks.push(last);
  return chunks;
}

function parseOneChunk(chunk: string): KanjiExamplePart {
  // 握手(あくしゅ: bắt tay)  or  握手（あくしゅ：bắt tay）
  const m = chunk.match(
    /^(.+?)\s*[\(（]([^:：\)）]+)[:：]\s*(.+)[\)）]\s*$/
  );
  if (m) {
    return {
      compound: m[1].trim(),
      reading: m[2].trim(),
      meaning: m[3].trim(),
    };
  }

  // 握手(あくしゅ)
  const m2 = chunk.match(/^(.+?)\s*[\(（](.+)[\)）]\s*$/);
  if (m2) {
    return {
      compound: m2[1].trim(),
      reading: m2[2].trim(),
    };
  }

  return { compound: chunk.trim() };
}

/** Parse "握手(あくしゅ: bắt tay), 把握(はあく: nắm bắt, thấu hiểu)." */
export function parseKanjiExamples(viDu: string): KanjiExamplePart[] {
  if (!viDu?.trim()) return [];
  return splitExampleChunks(viDu).map(parseOneChunk);
}

/** Một dòng gọn: 握手（あくしゅ）· bắt tay */
export function formatKanjiExampleLine(ex: KanjiExamplePart): string {
  const reading = ex.reading ? `（${ex.reading}）` : "";
  const meaning = ex.meaning ? ` · ${ex.meaning}` : "";
  return `${ex.compound}${reading}${meaning}`;
}
