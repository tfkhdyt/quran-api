import { Hono } from 'hono';
import surahController from './surah.js';
import juzController from './juz.js';
import { HTTPException } from 'hono/http-exception';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { cacheMiddleware } from './cache/middleware.js';

const app = new Hono();

app
  // error handling
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json(
        {
          success: false,
          message: err.message,
        },
        err.status,
      );
    }

    return c.json(
      {
        success: false,
        message: 'Something went wrong',
      },
      500,
    );
  })

  // middleware
  .use(cors())
  .use(logger())
  .use('/surah/*', cacheMiddleware)
  .use('/juz/*', cacheMiddleware)

  // main routes
  .get('/', (c) => {
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
      maintainer: 'Taufik Hidayat <me@tfkhdyt.my.id>',
      source: 'https://github.com/tfkhdyt/quran-api',
    };

    return c.json(data);
  })
  .route('/surah', surahController)
  .route('/juz', juzController);

export default app;
