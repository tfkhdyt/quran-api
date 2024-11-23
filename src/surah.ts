import { Hono } from 'hono';
import type { Quran } from './types/quran.ts';
import quranJson from '../data/quran.json' assert { type: 'json' };
import { cache } from './cache/lru.js';
import { HTTPException } from 'hono/http-exception';

const { data: quranData } = quranJson as Quran;

const app = new Hono();

// get all surah
app.get('/', (c) => {
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
app.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    throw new HTTPException(404, { message: 'Surah should be in integer' });
  }

  const data = quranData.at(id - 1);
  if (!data) {
    throw new HTTPException(404, { message: `Surah "${id}" is not found` });
  }

  const response = {
    success: true,
    message: 'Success fetching surah',
    data,
  };
  cache.set(c.req.path, response);

  return c.json(response);
});

// get ayah from surah
app.get('/:surahId/:ayahId', async (c) => {
  const surahId = parseInt(c.req.param('surahId'));
  const ayahId = parseInt(c.req.param('ayahId'));

  if (isNaN(surahId)) {
    throw new HTTPException(400, { message: 'Surah should be in integer' });
  }

  if (isNaN(ayahId)) {
    throw new HTTPException(400, { message: 'Ayah should be in integer' });
  }

  const surah = quranData.at(surahId - 1);
  if (!surah) {
    throw new HTTPException(404, {
      message: `Surah "${surahId}" is not found`,
    });
  }

  const ayah = surah.verses?.at(ayahId - 1);
  if (!ayah) {
    throw new HTTPException(404, {
      message: `Ayah "${ayahId}" in surah "${surahId}" is not found`,
    });
  }

  const dataSurah = { ...surah };
  delete dataSurah.verses;

  const data = { ...ayah, surah: dataSurah };

  const response = {
    success: true,
    message: 'Success fetching ayah',
    data,
  };

  cache.set(c.req.path, response);

  return c.json(response);
});

export default app;
