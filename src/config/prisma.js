import { PrismaClient } from '@prisma/client';

import { env, isProduction } from './env.js';
import { logger } from './logger.js';

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
    log: isProduction ? ['error'] : ['warn', 'error'],
  });

if (!isProduction) {
  globalForPrisma.__prisma = prisma;
}

export const connectPrisma = async () => {
  await prisma.$connect();
  logger.info('Prisma connected to PostgreSQL');
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
  logger.info('Prisma disconnected');
};

export const checkDatabaseHealth = async () => {
  await prisma.$queryRaw`SELECT 1`;
};

export default prisma;

