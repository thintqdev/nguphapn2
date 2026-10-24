import grammarDataRaw from "../../public/data/grammar.json";
import sonkeigoRaw from "../../public/data/sonkeigo.json";
import type { Grammar, GrammarData } from "./types";
import type { KeigoData, SpecialVerb } from "./keigoTypes";

const grammarData = grammarDataRaw as GrammarData;
const keigoData = sonkeigoRaw as KeigoData;

export interface SearchResultItem {
  type: "grammar" | "keigo";
  id: string;
  href: string;
  title: string;
  reading: string;
  meaning: string;
  categoryName?: string;
  badge?: string;
}

const romajiMap: Record<string, string> = {
  kya: "きゃ", kyu: "きゅ", kyo: "きょ",
  sha: "しゃ", shu: "しゅ", sho: "しょ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ",
  mya: "みゃ", myu: "みゅ", myo: "みょ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ",
  gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  ja: "じゃ", ju: "じゅ", jo: "じょ",
  bya: "びゃ", byu: "びゅ", byo: "びょ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  sa: "さ", shi: "し", si: "し", su: "す", se: "せ", so: "そ",
  ta: "た", chi: "ち", ti: "ち", tsu: "つ", tu: "つ", te: "て", to: "と",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", fu: "ふ", hu: "ふ", he: "へ", ho: "ほ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  za: "ざ", ji: "じ", zi: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  a: "あ", i: "い", u: "う", e: "え", o: "お",
};

export function romajiToHiragana(text: string): string {
  let res = text.toLowerCase();
  res = res.replace(/([bcdfghjklmpqrstvwxyz])\1/g, "っ$1");
  res = res.replace(/n(?![aeiouy])/g, "ん");
  const keys = Object.keys(romajiMap).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    res = res.replaceAll(k, romajiMap[k]);
  }
  return res;
}

export function normalizeSearch(str: string): string {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .trim();
}

export function searchAllGrammar(query: string, maxResults = 8): SearchResultItem[] {
  if (!query || !query.trim()) return [];

  const rawQ = query.trim();
  const nq = normalizeSearch(rawQ);
  const hq = normalizeSearch(romajiToHiragana(rawQ).replace(/\s+/g, ""));

  const results: SearchResultItem[] = [];

  // 1. Search in 99 N2 Grammar items
  for (const g of grammarData.grammar) {
    const titleNorm = normalizeSearch(g.title);
    const readingNorm = normalizeSearch(g.reading);
    const meaningNorm = normalizeSearch(g.meaning);
    const detailNorm = normalizeSearch(g.meaningDetail);
    const idNorm = normalizeSearch(g.id.replace(/-/g, " "));
    const mainWordNorm = normalizeSearch(g.mainWord || "");

    const cleanTitle = titleNorm.replace(/[（）()~～\s]/g, "");
    const cleanReading = readingNorm.replace(/[（）()~～\s]/g, "");

    const isMatch =
      titleNorm.includes(nq) ||
      readingNorm.includes(nq) ||
      meaningNorm.includes(nq) ||
      detailNorm.includes(nq) ||
      idNorm.includes(nq) ||
      mainWordNorm.includes(nq) ||
      (hq.length >= 2 && (cleanTitle.includes(hq) || cleanReading.includes(hq)));

    if (isMatch) {
      // Find category name
      const cat = grammarData.categories.find((c) => c.id === g.categoryId);

      results.push({
        type: "grammar",
        id: g.id,
        href: `/grammar/${g.id}`,
        title: g.title,
        reading: g.reading,
        meaning: g.meaning,
        categoryName: cat?.shortName || cat?.name || "N2 文法",
        badge: g.level || "N2",
      });

      if (results.length >= maxResults) break;
    }
  }

  // 2. Check if query matches Exercise keywords
  const isExerciseQuery =
    nq.includes("bai tap") ||
    nq.includes("de thi") ||
    nq.includes("luyen tap") ||
    nq.includes("exercise") ||
    nq.includes("kiem tra") ||
    nq.includes("renshuu") ||
    nq.includes("50 cau");

  if (isExerciseQuery && results.length < maxResults) {
    results.unshift({
      type: "grammar",
      id: "exercise-1",
      href: "/exercise/1",
      title: "Bài kiểm tra ngữ pháp tiếng Nhật (50 câu đầy đủ)",
      reading: "れんしゅうもんだい (練習問題)",
      meaning: "Đề thi thử 50 câu trắc nghiệm & sắp xếp câu dấu sao có lời giải chi tiết",
      categoryName: "Bài tập",
      badge: "Đề thi #1",
    });
  }

  // 3. Check if query matches Keigo keywords or Keigo verbs
  const isKeigoQuery =
    nq.includes("keigo") ||
    nq.includes("kinh ngu") ||
    nq.includes("ton kinh") ||
    nq.includes("khiem nhuong") ||
    nq.includes("dinh trong") ||
    nq.includes("sonkei") ||
    nq.includes("kenjou");

  if (isKeigoQuery && results.length < maxResults) {
    results.unshift({
      type: "keigo",
      id: "keigo-hub",
      href: "/keigo",
      title: "敬語・謙譲語マスター (Chuyên đề Kính ngữ)",
      reading: "けいご・けんじょうご",
      meaning: "19 Động từ đặc biệt, công thức biến đổi và bẫy đề thi N2",
      categoryName: "Chuyên đề",
      badge: "Kính ngữ",
    });
  }

  // 3. Search Keigo special verbs if room
  if (results.length < maxResults) {
    for (const v of keigoData.specialVerbs || []) {
      const plainNorm = normalizeSearch(v.plain);
      const meaningNorm = normalizeSearch(v.meaningVn);
      const sonkeiNorm = normalizeSearch(v.sonkeigo);
      const kenjouNorm = normalizeSearch(v.kenjougo1);

      if (
        plainNorm.includes(nq) ||
        meaningNorm.includes(nq) ||
        sonkeiNorm.includes(nq) ||
        kenjouNorm.includes(nq)
      ) {
        results.push({
          type: "keigo",
          id: `keigo-${v.id}`,
          href: "/keigo",
          title: `【${v.plain}】${v.sonkeigo}`,
          reading: `Khiêm nhường: ${v.kenjougo1}`,
          meaning: v.meaningVn,
          categoryName: "Kính ngữ đặc biệt",
          badge: "Keigo",
        });

        if (results.length >= maxResults) break;
      }
    }
  }

  return results;
}
