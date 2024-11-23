import { Hono } from 'hono';
import surahController from './surah.js';

const app = new Hono();

app.get('/', (c) => {
  const data = {
    surah: {
      listSurah: '/surah',
      spesificSurah: {
        pattern: '/surah/{surah}',
        example: '/surah/18',
      },
      spesificAyahInSurah: {
        pattern: '/surah/{surah}/{ayah}',
        example: '/surah/18/60',
      },
      spesificJuz: {
        pattern: '/juz/{juz}',
        example: '/juz/30',
      },
    },
    maintaner: 'Taufik Hidayat <me@tfkhdyt.my.id>',
    source: 'https://github.com/tfkhdyt/quran-api',
  };

  return c.json(data);
});

app.route('/surah', surahController);

export default app;
