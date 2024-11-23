export type Juz = {
  data: Datum[];
};

type Datum = {
  index: number;
  start: End;
  end: End;
};

type End = {
  index: number;
  verse: number;
};
