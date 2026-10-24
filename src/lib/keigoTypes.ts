export interface KeigoCategory {
  id: string;
  name: string;
  nameVn: string;
  description: string;
  target: string;
}

export interface SpecialVerb {
  id: string;
  plain: string;
  meaningVn: string;
  sonkeigo: string;
  kenjougo1: string;
  kenjougo2: string;
  teineigo: string;
}

export interface ConjugationRule {
  pattern: string;
  exampleJp: string;
  exampleVn: string;
  note?: string;
}

export interface ConjugationRulesData {
  sonkeigo: ConjugationRule[];
  kenjougo: ConjugationRule[];
}

export interface BusinessPhrase {
  id: string;
  category: string;
  phraseJp: string;
  meaningVn: string;
}

export interface JlptTrap {
  ruleName: string;
  explanationVn: string;
  examExampleJp: string;
}

export interface KeigoData {
  categories: KeigoCategory[];
  specialVerbs: SpecialVerb[];
  conjugationRules: ConjugationRulesData;
  businessPhrases: BusinessPhrase[];
  jlptTrapsAndRules: JlptTrap[];
}
