import { createMiddleware } from 'hono/factory';
import { cache } from './lru.js';

export const cacheMiddleware = createMiddleware(async (c, next) => {
  const url = c.req.url;

  if (cache.has(url)) {
    const cachedData = cache.get(url);
    return c.json(cachedData);
  }

  await next();
});
