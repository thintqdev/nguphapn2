import fs from "fs";
import path from "path";
import type { ExerciseData, ExerciseMeta, ExerciseQuestion } from "./exerciseTypes";
import { isAnswerCorrect } from "./exerciseUtils";

export { isAnswerCorrect };

const EXERCISES_DIR = path.join(process.cwd(), "public/data/exercise");

export function getAllExercises(): ExerciseMeta[] {
  try {
    if (!fs.existsSync(EXERCISES_DIR)) return [];

    const files = fs.readdirSync(EXERCISES_DIR).filter((f) => f.endsWith(".json"));

    // Sort numerically by filename e.g. 1.json, 2.json
    files.sort((a, b) => {
      const numA = parseInt(a.replace(/\.json$/, ""), 10);
      const numB = parseInt(b.replace(/\.json$/, ""), 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

    return files.map((file) => {
      const id = file.replace(/\.json$/, "");
      const fullPath = path.join(EXERCISES_DIR, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const data = JSON.parse(raw);

      return {
        id,
        fileName: file,
        title: data.title || `Bài luyện tập #${id}`,
        questionCount: Array.isArray(data.questions) ? data.questions.length : 0,
        description: `Gồm ${data.questions?.length || 0} câu hỏi trắc nghiệm ngữ pháp và sắp xếp câu sao ★ JLPT N2 kèm lời giải chi tiết.`,
      };
    });
  } catch (err) {
    console.error("Error reading exercise files:", err);
    return [];
  }
}

export function getExerciseById(id: string): ExerciseData | null {
  try {
    const filePath = path.join(EXERCISES_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);

    return {
      id,
      fileName: `${id}.json`,
      title: data.title || `Bài luyện tập #${id}`,
      questionCount: Array.isArray(data.questions) ? data.questions.length : 0,
      questions: (data.questions || []) as ExerciseQuestion[],
    };
  } catch (err) {
    console.error(`Error loading exercise ${id}:`, err);
    return null;
  }
}

export function getExercisePaths(): { id: string }[] {
  return getAllExercises().map((ex) => ({ id: ex.id }));
}
