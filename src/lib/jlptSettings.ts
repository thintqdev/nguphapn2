/** localStorage key for JLPT exam target date (YYYY-MM-DD) */
export const JLPT_EXAM_DATE_KEY = "n2_jlpt_exam_date";

/** Default: first Sunday of Dec 2026 (JLPT winter session) */
export const DEFAULT_JLPT_EXAM_DATE = "2026-12-06";

export function getStoredExamDate(): string {
  if (typeof window === "undefined") return DEFAULT_JLPT_EXAM_DATE;
  try {
    const v = localStorage.getItem(JLPT_EXAM_DATE_KEY);
    if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  } catch {
    // ignore
  }
  return DEFAULT_JLPT_EXAM_DATE;
}

export function setStoredExamDate(isoDate: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return;
  localStorage.setItem(JLPT_EXAM_DATE_KEY, isoDate);
  window.dispatchEvent(
    new CustomEvent("n2-jlpt-date-change", { detail: isoDate })
  );
}

/** Days remaining until exam (local midnight). Negative if past. */
export function daysUntilExam(isoDate: string, now = new Date()): number {
  const [y, m, d] = isoDate.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function formatExamDateJa(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}
