import { logger } from '../src/config/logger.js';
import prisma from '../src/config/prisma.js';

async function main() {
  logger.info('Seed placeholder started');
  logger.info('Add provinces, districts, stations, users, devices, drivers, and tuk-tuks here when you are ready.');
}

main()
  .catch((error) => {
    logger.error({ err: error }, 'Seed script failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
