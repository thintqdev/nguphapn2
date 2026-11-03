import fs from "fs";
import path from "path";
import type { ExamData, ExamMeta } from "./examTypes";

const EXAM_DIR = path.join(process.cwd(), "public/data/exam");

export function getAllExams(): ExamMeta[] {
  try {
    if (!fs.existsSync(EXAM_DIR)) return [];

    const files = fs
      .readdirSync(EXAM_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort((a, b) => {
        const numA = parseInt(a.replace(/\.json$/, ""), 10);
        const numB = parseInt(b.replace(/\.json$/, ""), 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      });

    return files.map((file) => {
      const id = file.replace(/\.json$/, "");
      const raw = fs.readFileSync(path.join(EXAM_DIR, file), "utf8");
      const data = JSON.parse(raw);
      const count =
        data.total_questions ||
        (Array.isArray(data.sections)
          ? data.sections.reduce(
              (n: number, s: { questions?: unknown[] }) =>
                n + (Array.isArray(s.questions) ? s.questions.length : 0),
              0
            )
          : 0);

      return {
        id,
        title: data.test_title || `Đề thi #${id}`,
        questionCount: count,
        sectionCount: Array.isArray(data.sections) ? data.sections.length : 0,
      };
    });
  } catch (err) {
    console.error("Error reading exam files:", err);
    return [];
  }
}

export function getExamById(id: string): ExamData | null {
  try {
    const filePath = path.join(EXAM_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);

    return {
      id,
      test_title: data.test_title || `Đề thi #${id}`,
      total_questions: data.total_questions || 0,
      sections: data.sections || [],
    };
  } catch (err) {
    console.error(`Error loading exam ${id}:`, err);
    return null;
  }
}

export function getExamPaths(): { id: string }[] {
  return getAllExams().map((e) => ({ id: e.id }));
}
