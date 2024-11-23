import { Hono } from 'hono';
import type { Quran } from './types/quran.ts';
import quranJson from '../data/quran.json' assert { type: 'json' };
import { cache } from './cache/lru.js';
import { cacheMiddleware } from './cache/middleware.js';

const { data: quranData } = quranJson as Quran;

const app = new Hono();

// get all surah
app.get('/', cacheMiddleware, (c) => {
  const data = quranData.map((item) => {
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
  cache.set(c.req.path, response);

  return c.json(response);
});

// get a surah
app.get('/:id', cacheMiddleware, async (c) => {
  const id = Number(c.req.param('id'));

  const data = quranData.at(id - 1);
  if (!data) {
    return c.json({
      success: false,
      message: `Surah "${id}" is not found`,
    });
  }

  const response = {
    success: true,
    message: 'Success fetching surah',
    data,
  };
  cache.set(c.req.path, response);

  return c.json(response);
});

export default app;
