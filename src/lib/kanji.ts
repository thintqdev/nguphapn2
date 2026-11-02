import fs from "fs";
import path from "path";
import type { KanjiItem, KanjiLesson, KanjiLessonMeta } from "./kanjiTypes";

export { parseKanjiExamples } from "./kanjiUtils";

const KANJI_DIR = path.join(process.cwd(), "public/data/kanji");

function lessonTitle(id: string): string {
  return `Bài ${id}`;
}

function buildPreview(items: KanjiItem[]): string {
  const unique: string[] = [];
  for (const item of items) {
    if (!unique.includes(item.kanji)) unique.push(item.kanji);
    if (unique.length >= 8) break;
  }
  return unique.join(" · ");
}

export function getAllKanjiLessons(): KanjiLessonMeta[] {
  try {
    if (!fs.existsSync(KANJI_DIR)) return [];

    const files = fs
      .readdirSync(KANJI_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort((a, b) => {
        const numA = parseInt(a.replace(/\.json$/, ""), 10);
        const numB = parseInt(b.replace(/\.json$/, ""), 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      });

    return files.map((file) => {
      const id = file.replace(/\.json$/, "");
      const raw = fs.readFileSync(path.join(KANJI_DIR, file), "utf8");
      const items = JSON.parse(raw) as KanjiItem[];
      return {
        id,
        title: lessonTitle(id),
        count: Array.isArray(items) ? items.length : 0,
        preview: Array.isArray(items) ? buildPreview(items) : "",
      };
    });
  } catch (err) {
    console.error("Error reading kanji lessons:", err);
    return [];
  }
}

export function getKanjiLesson(id: string): KanjiLesson | null {
  try {
    const filePath = path.join(KANJI_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, "utf8");
    const items = JSON.parse(raw) as KanjiItem[];

    if (!Array.isArray(items)) return null;

    return {
      id,
      title: lessonTitle(id),
      count: items.length,
      items,
    };
  } catch (err) {
    console.error(`Error loading kanji lesson ${id}:`, err);
    return null;
  }
}

export function getKanjiLessonPaths(): { lesson: string }[] {
  return getAllKanjiLessons().map((l) => ({ lesson: l.id }));
}
