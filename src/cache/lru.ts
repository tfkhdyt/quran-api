import { LRUCache } from 'lru-cache';

export const cache = new LRUCache({
  max: 500,
  ttl: 86_400_000,
});
