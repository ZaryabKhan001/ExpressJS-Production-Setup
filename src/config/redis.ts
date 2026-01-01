import { Redis } from '@upstash/redis';

import { config } from './index.js';

export const redis = new Redis({
  url: config.redisUrl,
  token: config.redisToken,
});
