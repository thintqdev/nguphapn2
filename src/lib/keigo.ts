import sonkeigoRaw from "../../public/data/sonkeigo.json";
import type { KeigoData, SpecialVerb, ConjugationRule, BusinessPhrase, JlptTrap, KeigoCategory } from "./keigoTypes";

export const keigoData = sonkeigoRaw as KeigoData;

export function getAllSpecialVerbs(): SpecialVerb[] {
  return keigoData.specialVerbs || [];
}

export function getAllKeigoCategories(): KeigoCategory[] {
  return keigoData.categories || [];
}

export function getConjugationRules() {
  return keigoData.conjugationRules || { sonkeigo: [], kenjougo: [] };
}

export function getBusinessPhrases(): BusinessPhrase[] {
  return keigoData.businessPhrases || [];
}

export function getJlptTraps(): JlptTrap[] {
  return keigoData.jlptTrapsAndRules || [];
}
