import { createMiddleware } from 'hono/factory';
import { cache } from './lru.js';

export const cacheMiddleware = createMiddleware(async (c, next) => {
  const path = c.req.path;

  if (cache.has(path)) {
    const cachedData = cache.get(path);
    return c.json(cachedData);
  }

  await next();
});
