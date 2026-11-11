import affixRaw from "../../public/data/jlpt_n2_affixes.json";
import type { AffixData, AffixWithKind } from "./affixTypes";

const data = affixRaw as AffixData;

export function getAffixData(): AffixData {
  return data;
}

export function getAllAffixes(): AffixWithKind[] {
  return [
    ...data.prefixes.map((a) => ({ ...a, kind: "prefix" as const })),
    ...data.suffixes.map((a) => ({ ...a, kind: "suffix" as const })),
  ];
}
