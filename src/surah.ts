import { Hono } from 'hono';
import type { Quran } from './types/quran.ts';
import quranJson from '../data/quran.json' assert { type: 'json' };

const quranData = quranJson as Quran;

const app = new Hono();

app.get('/', (c) => {
  const data = quranData.data.map((item) => {
    const surah = { ...item };
    delete surah.verses;
    delete surah.preBismillah;

    return surah;
  });

  return c.json({
    success: true,
    message: 'Success fetching all surah',
    data,
  });
});

export default app;
