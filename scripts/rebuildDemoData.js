import { pathToFileURL } from 'node:url';

import { logger } from '../src/config/logger.js';
import prisma from '../src/config/prisma.js';
import { exportSimulationData } from './exportSimulationData.js';
import { generateSimulationData } from './generateSimulation.js';
import { resetDemoData } from './resetDemoData.js';
import { seedCoreData } from './seed.js';

export const rebuildDemoData = async () => {
  logger.info('Starting full demo data rebuild.');

  const resetSummary = await resetDemoData();
  const seedSummary = await seedCoreData();
  const simulationSummary = await generateSimulationData();
  const exportSummary = await exportSimulationData();

  const summary = {
    resetSummary,
    seedSummary,
    simulationSummary,
    exportSummary,
  };

  logger.info(summary, 'Full demo data rebuild completed successfully.');
  return summary;
};

const main = async () => {
  await rebuildDemoData();
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main()
    .catch((error) => {
      logger.error({ err: error }, 'Demo data rebuild failed');
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
