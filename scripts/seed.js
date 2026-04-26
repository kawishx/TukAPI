import prisma from '../src/db/prismaClient.js';
import { logger } from '../src/config/logger.js';

async function main() {
  logger.info('Seed scaffold is ready. Add provinces, stations, admin users, and demo tuk-tuk records here.');
}

main()
  .catch((error) => {
    logger.error({ err: error }, 'Seed script failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

