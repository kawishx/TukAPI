import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { logger } from '../src/config/logger.js';
import prisma from '../src/config/prisma.js';
import { stationByCode } from './simulationCatalog.js';
import { ensureDirectory, getSimulationConfig, writeCsv, writeJson } from './simulationUtils.js';

const toNumberOrNull = (value) => (value === null || value === undefined ? null : Number(value));

const flattenStation = (station) => {
  const seededStation = stationByCode.get(station.code);

  return {
    provinceCode: station.province.code,
    provinceName: station.province.name,
    districtCode: station.district.code,
    districtName: station.district.name,
    stationCode: station.code,
    stationName: station.name,
    address: station.address,
    contactNumber: station.contactNumber,
    isActive: station.isActive,
    latitude: seededStation?.latitude ?? null,
    longitude: seededStation?.longitude ?? null,
  };
};

const flattenTukTuk = (tukTuk) => ({
  registrationNumber: tukTuk.registrationNumber,
  plateNumber: tukTuk.plateNumber,
  model: tukTuk.model,
  color: tukTuk.color,
  status: tukTuk.status,
  provinceCode: tukTuk.province?.code ?? null,
  provinceName: tukTuk.province?.name ?? null,
  districtCode: tukTuk.district?.code ?? null,
  districtName: tukTuk.district?.name ?? null,
  stationCode: tukTuk.station?.code ?? null,
  stationName: tukTuk.station?.name ?? null,
  driverName: tukTuk.driver?.fullName ?? null,
  driverLicenseNumber: tukTuk.driver?.licenseNumber ?? null,
  deviceSerialNumber: tukTuk.device?.serialNumber ?? null,
  deviceStatus: tukTuk.device?.status ?? null,
});

const flattenLocationPing = (ping) => ({
  recordedAt: ping.recordedAt.toISOString(),
  receivedAt: ping.receivedAt.toISOString(),
  tukTukRegistrationNumber: ping.tukTuk.registrationNumber,
  plateNumber: ping.tukTuk.plateNumber,
  deviceSerialNumber: ping.device?.serialNumber ?? null,
  provinceCode: ping.province.code,
  districtCode: ping.district.code,
  stationCode: ping.station?.code ?? null,
  latitude: Number(ping.latitude),
  longitude: Number(ping.longitude),
  speedKmh: toNumberOrNull(ping.speedKph),
  heading: toNumberOrNull(ping.heading),
  accuracyM: toNumberOrNull(ping.accuracyM),
  ignitionOn: ping.ignitionOn,
});

export const exportSimulationData = async () => {
  const config = getSimulationConfig();
  const exportDirectory = config.exportDir;

  await ensureDirectory(exportDirectory);

  const [stationRecords, tukTukRecords, locationPingRecords] = await Promise.all([
    prisma.policeStation.findMany({
      include: {
        province: { select: { code: true, name: true } },
        district: { select: { code: true, name: true } },
      },
      orderBy: { code: 'asc' },
    }),
    prisma.tukTuk.findMany({
      where: {
        notes: {
          startsWith: 'Simulation fleet vehicle',
        },
      },
      include: {
        province: { select: { code: true, name: true } },
        district: { select: { code: true, name: true } },
        station: { select: { code: true, name: true } },
        driver: { select: { fullName: true, licenseNumber: true } },
        device: { select: { serialNumber: true, status: true } },
      },
      orderBy: { registrationNumber: 'asc' },
    }),
    prisma.locationPing.findMany({
      where: {
        tukTuk: {
          notes: {
            startsWith: 'Simulation fleet vehicle',
          },
        },
      },
      include: {
        tukTuk: { select: { registrationNumber: true, plateNumber: true } },
        device: { select: { serialNumber: true } },
        province: { select: { code: true } },
        district: { select: { code: true } },
        station: { select: { code: true } },
      },
      orderBy: { recordedAt: 'asc' },
    }),
  ]);

  const flattenedStations = stationRecords.map(flattenStation);
  const flattenedTukTuks = tukTukRecords.map(flattenTukTuk);
  const flattenedLocationPings = locationPingRecords.map(flattenLocationPing);
  const summary = {
    generatedAt: new Date().toISOString(),
    exportDirectory,
    demoDate: config.demoDate.toISOString().slice(0, 10),
    seed: config.seed,
    provinceCount: 9,
    districtCount: 25,
    stationCount: stationRecords.length,
    tukTukCount: tukTukRecords.length,
    locationPingCount: locationPingRecords.length,
    firstRecordedAt: flattenedLocationPings[0]?.recordedAt ?? null,
    lastRecordedAt: flattenedLocationPings[flattenedLocationPings.length - 1]?.recordedAt ?? null,
  };

  await Promise.all([
    writeJson(path.join(exportDirectory, 'station-mapping.json'), flattenedStations),
    writeCsv(path.join(exportDirectory, 'station-mapping.csv'), flattenedStations),
    writeJson(path.join(exportDirectory, 'tuk-tuk-master-data.json'), flattenedTukTuks),
    writeCsv(path.join(exportDirectory, 'tuk-tuk-master-data.csv'), flattenedTukTuks),
    writeJson(path.join(exportDirectory, 'location-history.json'), flattenedLocationPings),
    writeCsv(path.join(exportDirectory, 'location-history.csv'), flattenedLocationPings),
    writeJson(path.join(exportDirectory, 'simulation-summary.json'), summary),
  ]);

  logger.info(summary, 'Simulation data exported successfully.');
  return summary;
};

const main = async () => {
  await exportSimulationData();
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main()
    .catch((error) => {
      logger.error({ err: error }, 'Simulation export failed');
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
