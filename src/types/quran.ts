export type Quran = {
  data: Data[];
};

type Data = {
  number: number;
  sequence: number;
  numberOfVerses: number;
  name: Name;
  revelation: Revelation;
  tafsir: DataTafsir;
  preBismillah: Record<string, unknown> | undefined;
  verses: Verse[] | undefined;
};

type Name = {
  short: string;
  long: string;
  transliteration: Translation;
  translation: Translation;
};

type Translation = {
  en: string;
  id: string;
};

type Revelation = {
  arab: string;
  en: string;
  id: string;
};

type DataTafsir = {
  id: string;
};

export type Verse = {
  number: Number;
  meta: Meta;
  text: Text;
  translation: Translation;
  audio: Audio;
  tafsir: VerseTafsir;
};

type Audio = {
  primary: string;
  secondary: string[];
};

type Meta = {
  juz: number;
  page: number;
  manzil: number;
  ruku: number;
  hizbQuarter: number;
  sajda: Sajda;
};

type Sajda = {
  recommended: boolean;
  obligatory: boolean;
};

type Number = {
  inQuran: number;
  inSurah: number;
};

type VerseTafsir = {
  id: ID;
};

type ID = {
  short: string;
  long: string;
};

type Text = {
  arab: string;
  transliteration: Transliteration;
};

type Transliteration = {
  en: string;
};
