import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { config } from './index.js';

export const redis = new Redis({
  url: config.redisUrl,
  token: config.redisToken,
});

export function createRateLimiter(max: number, windowSeconds: number) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, `${windowSeconds} s`),
  });
}
