export interface GrammarExample {
  jp: string;
  reading: string;
  vn: string;
}

export interface GrammarUsage {
  pattern: string;
  exampleJp: string;
  exampleReading: string;
  exampleVn: string;
}

export interface Grammar {
  id: string;
  categoryId: string;
  title: string;
  furigana?: string;
  mainWord?: string;
  prefix?: string;
  suffix?: string;
  reading: string;
  meaning: string;
  level: string;
  meaningDetail: string;
  usage: GrammarUsage;
  notes: string[];
  examples: GrammarExample[];
  related: string[];
  memo?: string;
  illustrationImage?: string;
}

export interface Category {
  id: string;
  roman: string;
  name: string;
  shortName: string;
  nameVn: string;
  count: number;
  preview: string;
  color: string;
  textColor: string;
  bgColor: string;
  bgLight: string;
  image: string;
}

export interface GrammarData {
  categories: Category[];
  grammar: Grammar[];
}
