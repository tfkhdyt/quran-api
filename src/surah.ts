import { Hono } from 'hono';
import type { Quran } from './types/quran.ts';
import quranJson from '../data/quran.json' assert { type: 'json' };
import { cache } from './cache/lru.js';
import { cacheMiddleware } from './cache/middleware.js';

const quranData = quranJson as Quran;

const app = new Hono();

app.get('/', cacheMiddleware, (c) => {
  const data = quranData.data.map((item) => {
    const surah = { ...item };
    delete surah.verses;
    delete surah.preBismillah;

    return surah;
  });

  const response = {
    success: true,
    message: 'Success fetching all surah',
    data,
  };

  cache.set(c.req.url, response);

  return c.json(response);
});

export default app;
