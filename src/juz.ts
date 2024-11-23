import { Hono } from 'hono';
import type { Quran } from './types/quran.ts';
import quranJson from '../data/quran.json' assert { type: 'json' };
import juzJson from '../data/juz.json' assert { type: 'json' };
import { Juz } from './types/juz.js';
import { Verse } from './types/quran.js';
import { HTTPException } from 'hono/http-exception';
import { cache } from './cache/lru.js';

const { data: quran } = quranJson as Quran;
const { data: juz } = juzJson as Juz;

const app = new Hono();

app.get('/:juz', async (c) => {
  const juz = c.req.param('juz');

  const data = juzData(Number(juz));
  if (!data) {
    throw new HTTPException(404, { message: `Juz "${juz}" is not found` });
  }

  const response = {
    success: true,
    message: 'Success fetching juz',
    data,
  };
  cache.set(c.req.path, response);

  return c.json(response);
});

function juzData(_inputJuz: number) {
  const inputJuz = juz[_inputJuz - 1];

  if (!inputJuz) return null;

  const startSurah = inputJuz.start.index - 1;
  const startAyah = inputJuz.start.verse - 1;
  const endSurah = inputJuz.end.index - 1;
  const endAyah = inputJuz.end.verse;
  let juzAyah: Verse[],
    _firstSurah: Verse[],
    _middle,
    _middleSurah: Verse[],
    _lastSurah: Verse[];

  if (startSurah === endSurah) {
    juzAyah = quran[startSurah].verses?.slice(startAyah, endAyah) ?? [];
  } else if (endSurah - startSurah > 1) {
    _firstSurah = quran[startSurah].verses?.slice(startAyah) ?? [];
    _middle = quran.slice(startSurah + 1, endSurah);
    _middleSurah = [];
    _middle.map((items) => {
      items.verses?.map((item) => {
        _middleSurah.push(item);
      });
    });
    _lastSurah = quran[endSurah].verses?.slice(0, endAyah) ?? [];
    juzAyah = [..._firstSurah, ..._middleSurah, ..._lastSurah];
  } else {
    _firstSurah = quran[startSurah].verses?.slice(startAyah) ?? [];
    _lastSurah = quran[endSurah].verses?.slice(0, endAyah) ?? [];
    juzAyah = [..._firstSurah, ..._lastSurah];
  }

  const startSurahName = quran[startSurah].name.transliteration.id;
  const endSurahName = quran[endSurah].name.transliteration.id;
  const data = {
    juz: _inputJuz,
    juzStartSurahNumber: inputJuz.start.index,
    juzEndSurahNumber: inputJuz.end.index,
    juzStartInfo: `${startSurahName} - ${inputJuz.start.verse}`,
    juzEndInfo: `${endSurahName} - ${inputJuz.end.verse}`,
    totalVerses: juzAyah?.length,
    verses: juzAyah,
  };
  return data;
}

export default app;
