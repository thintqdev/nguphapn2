import type { GrammarData, Grammar, Category } from "./types";
import grammarDataRaw from "../../public/data/grammar.json";

const data = grammarDataRaw as GrammarData;

export function getAllCategories(): Category[] {
  return data.categories;
}

export function getAllGrammar(): Grammar[] {
  return data.grammar;
}

export function getCategoryById(id: string): Category | undefined {
  return data.categories.find((c) => c.id === id);
}

export function getGrammarById(id: string): Grammar | undefined {
  return data.grammar.find((g) => g.id === id);
}

export function getGrammarByCategory(categoryId: string): Grammar[] {
  return data.grammar.filter((g) => g.categoryId === categoryId);
}

export function getAdjacentGrammar(id: string): {
  prev: Grammar | null;
  next: Grammar | null;
} {
  const index = data.grammar.findIndex((g) => g.id === id);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? data.grammar[index - 1] : null,
    next: index < data.grammar.length - 1 ? data.grammar[index + 1] : null,
  };
}
