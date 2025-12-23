import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client.js';
import { config } from './config/index.js';

const connectionString = config.databaseUrl!;
const adapter = new PrismaPg({ connectionString });

declare global {
  var prisma: PrismaClient | undefined;
}

// Use globalThis in dev to avoid multiple instances
export const prisma = globalThis.prisma || new PrismaClient({ adapter });

if (config.nodeEnv !== 'production') {
  globalThis.prisma = prisma;
}
