export const SKIN_IDS = [
  "terracotta",
  "matcha",
  "ai",
  "ume",
  "kincha",
  "sora",
] as const;

export type SkinId = (typeof SKIN_IDS)[number];

export const DEFAULT_SKIN: SkinId = "terracotta";

export const SKIN_STORAGE_KEY = "n2_skin";

export type SkinMeta = {
  id: SkinId;
  labelJa: string;
  labelVn: string;
  /** Swatch preview (light accent) */
  swatch: string;
};

export const SKINS: SkinMeta[] = [
  {
    id: "terracotta",
    labelJa: "煉瓦",
    labelVn: "Terracotta",
    swatch: "#df6e53",
  },
  {
    id: "matcha",
    labelJa: "抹茶",
    labelVn: "Matcha",
    swatch: "#5f8f6a",
  },
  {
    id: "ai",
    labelJa: "藍",
    labelVn: "Indigo",
    swatch: "#4f6f9a",
  },
  {
    id: "ume",
    labelJa: "梅",
    labelVn: "Ume",
    swatch: "#c46b7a",
  },
  {
    id: "kincha",
    labelJa: "金茶",
    labelVn: "Kincha",
    swatch: "#c4893f",
  },
  {
    id: "sora",
    labelJa: "空",
    labelVn: "Sora",
    swatch: "#5a8aa0",
  },
];

export function isSkinId(value: string | null | undefined): value is SkinId {
  return !!value && (SKIN_IDS as readonly string[]).includes(value);
}

export function normalizeSkinId(value: string | null | undefined): SkinId {
  return isSkinId(value) ? value : DEFAULT_SKIN;
}
