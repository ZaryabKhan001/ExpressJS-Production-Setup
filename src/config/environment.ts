import path from 'node:path';

import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file based on NODE_ENV
dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || 'development'}`,
  ),
});

// Define schema
const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .transform(value => Number.parseInt(value, 10))
    .default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
});

// Parse and validate process.env
export const environment = environmentSchema.parse(process.env);
