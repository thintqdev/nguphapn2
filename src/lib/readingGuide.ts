import raw from "../../public/data/cam_nang_doc_hieu_jlpt_n2.json";
import type {
  ReadingGuideData,
  ReadingModeFilter,
  ReadingStep,
} from "./readingGuideTypes";

const data = raw as ReadingGuideData;

export function getReadingGuideData(): ReadingGuideData {
  return data;
}

export function stepMatchesMode(
  step: ReadingStep,
  mode: ReadingModeFilter
): boolean {
  if (mode === "all") return true;
  if (!step.modes || step.modes.length === 0) return true;
  return step.modes.includes(mode);
}
