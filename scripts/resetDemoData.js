import { pathToFileURL } from 'node:url';

import { logger } from '../src/config/logger.js';
import prisma from '../src/config/prisma.js';

export const resetDemoData = async () => {
  const summary = await prisma.$transaction(async (tx) => {
    const currentLocations = await tx.currentLocation.deleteMany();
    const locationPings = await tx.locationPing.deleteMany();
    const auditLogs = await tx.auditLog.deleteMany();
    const tukTuks = await tx.tukTuk.deleteMany();
    const devices = await tx.trackingDevice.deleteMany();
    const drivers = await tx.driver.deleteMany();
    const users = await tx.user.deleteMany();
    const stations = await tx.policeStation.deleteMany();
    const districts = await tx.district.deleteMany();
    const provinces = await tx.province.deleteMany();

    return {
      currentLocations: currentLocations.count,
      locationPings: locationPings.count,
      auditLogs: auditLogs.count,
      tukTuks: tukTuks.count,
      devices: devices.count,
      drivers: drivers.count,
      users: users.count,
      stations: stations.count,
      districts: districts.count,
      provinces: provinces.count,
    };
  });

  logger.info(summary, 'Demo data reset completed successfully.');
  return summary;
};

const main = async () => {
  await resetDemoData();
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main()
    .catch((error) => {
      logger.error({ err: error }, 'Demo data reset failed');
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
