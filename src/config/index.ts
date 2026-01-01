// src/config/index.ts
import { environment } from './environment.js';

export const config = {
  nodeEnv: environment.NODE_ENV,
  isProduction: environment.NODE_ENV === 'production',
  port: environment.PORT,
  databaseUrl: environment.DATABASE_URL,
  jwtSecret: environment.JWT_SECRET,
  redisUrl: environment.UPSTASH_REDIS_REST_URL,
  redisToken: environment.UPSTASH_REDIS_REST_TOKEN,
};
