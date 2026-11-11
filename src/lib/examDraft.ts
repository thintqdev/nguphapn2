import {
  EXAM_DRAFT_KEY,
  type ExamDraftRecord,
} from "@/lib/examTypes";

function readAll(): Record<string, ExamDraftRecord> {
  try {
    const raw = localStorage.getItem(EXAM_DRAFT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ExamDraftRecord>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, ExamDraftRecord>) {
  localStorage.setItem(EXAM_DRAFT_KEY, JSON.stringify(all));
}

export function getExamDraft(examId: string): ExamDraftRecord | null {
  const draft = readAll()[examId];
  if (!draft || typeof draft.timeLeftSeconds !== "number") return null;
  if (!draft.answers || typeof draft.answers !== "object") return null;
  return draft;
}

export function saveExamDraft(
  examId: string,
  answers: Record<number, string>,
  timeLeftSeconds: number
): ExamDraftRecord {
  const draft: ExamDraftRecord = {
    examId,
    answers,
    timeLeftSeconds: Math.max(0, Math.floor(timeLeftSeconds)),
    updatedAt: new Date().toISOString(),
  };
  const all = readAll();
  all[examId] = draft;
  writeAll(all);
  return draft;
}

export function clearExamDraft(examId: string) {
  const all = readAll();
  if (!(examId in all)) return;
  delete all[examId];
  writeAll(all);
}

export function listExamDrafts(): ExamDraftRecord[] {
  return Object.values(readAll());
}
