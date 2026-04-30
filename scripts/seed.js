import { pathToFileURL } from 'node:url';

import { logger } from '../src/config/logger.js';
import prisma from '../src/config/prisma.js';
import { hashOpaqueToken } from '../src/modules/auth/auth.tokens.js';
import { hashPassword } from '../src/utils/password.js';
import { buildOperationalSeeds, demoUsers, districts, provinces, stations } from './simulationCatalog.js';
import { getSimulationConfig } from './simulationUtils.js';

const seedStations = async (provinceMap, districtMap) => {
  const stationMap = new Map();

  for (const stationSeed of stations) {
    const district = districtMap.get(stationSeed.districtCode);
    const province = provinceMap.get(district.provinceCode);

    const station = await prisma.policeStation.upsert({
      where: { code: stationSeed.code },
      update: {
        name: stationSeed.name,
        address: stationSeed.address,
        contactNumber: stationSeed.contactNumber,
        provinceId: province.id,
        districtId: district.id,
        isActive: true,
      },
      create: {
        name: stationSeed.name,
        code: stationSeed.code,
        address: stationSeed.address,
        contactNumber: stationSeed.contactNumber,
        provinceId: province.id,
        districtId: district.id,
        isActive: true,
      },
    });

    stationMap.set(stationSeed.code, station);
  }

  return stationMap;
};

export const seedCoreData = async () => {
  const config = getSimulationConfig();
  const demoPassword = 'DemoPass123!';
  const passwordHash = await hashPassword(demoPassword);
  const provinceMap = new Map();
  const districtMap = new Map();
  const { driverSeeds, deviceSeeds, tukTukSeeds } = buildOperationalSeeds({
    count: config.operationalCount,
    seed: config.seed,
  });

  for (const provinceSeed of provinces) {
    const province = await prisma.province.upsert({
      where: { code: provinceSeed.code },
      update: { name: provinceSeed.name },
      create: provinceSeed,
    });

    provinceMap.set(provinceSeed.code, province);
  }

  for (const districtSeed of districts) {
    const province = provinceMap.get(districtSeed.provinceCode);
    const district = await prisma.district.upsert({
      where: { code: districtSeed.code },
      update: {
        name: districtSeed.name,
        provinceId: province.id,
      },
      create: {
        name: districtSeed.name,
        code: districtSeed.code,
        provinceId: province.id,
      },
    });

    districtMap.set(districtSeed.code, {
      ...district,
      provinceCode: districtSeed.provinceCode,
    });
  }

  const stationMap = await seedStations(provinceMap, districtMap);
  const driverMap = new Map();
  const deviceMap = new Map();

  for (const driverSeed of driverSeeds) {
    const station = stationMap.get(driverSeed.stationCode);

    const driver = await prisma.driver.upsert({
      where: { licenseNumber: driverSeed.licenseNumber },
      update: {
        fullName: driverSeed.fullName,
        nationalId: driverSeed.nationalId,
        phoneNumber: driverSeed.phoneNumber,
        address: driverSeed.address,
        provinceId: station.provinceId,
        districtId: station.districtId,
        stationId: station.id,
        isActive: driverSeed.isActive,
      },
      create: {
        fullName: driverSeed.fullName,
        nationalId: driverSeed.nationalId,
        licenseNumber: driverSeed.licenseNumber,
        phoneNumber: driverSeed.phoneNumber,
        address: driverSeed.address,
        provinceId: station.provinceId,
        districtId: station.districtId,
        stationId: station.id,
        isActive: driverSeed.isActive,
      },
    });

    driverMap.set(driverSeed.licenseNumber, driver);
  }

  for (const deviceSeed of deviceSeeds) {
    const device = await prisma.trackingDevice.upsert({
      where: { serialNumber: deviceSeed.serialNumber },
      update: {
        imei: deviceSeed.imei,
        simNumber: deviceSeed.simNumber,
        firmwareVersion: deviceSeed.firmwareVersion,
        status: deviceSeed.status,
        authTokenHash: hashOpaqueToken(deviceSeed.authToken),
      },
      create: {
        serialNumber: deviceSeed.serialNumber,
        imei: deviceSeed.imei,
        simNumber: deviceSeed.simNumber,
        firmwareVersion: deviceSeed.firmwareVersion,
        status: deviceSeed.status,
        authTokenHash: hashOpaqueToken(deviceSeed.authToken),
      },
    });

    deviceMap.set(deviceSeed.serialNumber, device);
  }

  for (const tukTukSeed of tukTukSeeds) {
    const station = stationMap.get(tukTukSeed.stationCode);
    const driver = driverMap.get(tukTukSeed.driverLicense);
    const device = deviceMap.get(tukTukSeed.deviceSerial);

    await prisma.tukTuk.upsert({
      where: { registrationNumber: tukTukSeed.registrationNumber },
      update: {
        plateNumber: tukTukSeed.plateNumber,
        model: tukTukSeed.model,
        color: tukTukSeed.color,
        status: tukTukSeed.status,
        notes: tukTukSeed.notes,
        provinceId: station.provinceId,
        districtId: station.districtId,
        stationId: station.id,
        driverId: driver.id,
        deviceId: device.id,
      },
      create: {
        registrationNumber: tukTukSeed.registrationNumber,
        plateNumber: tukTukSeed.plateNumber,
        model: tukTukSeed.model,
        color: tukTukSeed.color,
        status: tukTukSeed.status,
        notes: tukTukSeed.notes,
        provinceId: station.provinceId,
        districtId: station.districtId,
        stationId: station.id,
        driverId: driver.id,
        deviceId: device.id,
      },
    });
  }

  for (const userSeed of demoUsers) {
    const province = userSeed.provinceCode ? provinceMap.get(userSeed.provinceCode) : null;
    const district = userSeed.districtCode ? districtMap.get(userSeed.districtCode) : null;
    const station = userSeed.stationCode ? stationMap.get(userSeed.stationCode) : null;

    await prisma.user.upsert({
      where: { email: userSeed.email },
      update: {
        fullName: userSeed.fullName,
        badgeNumber: userSeed.badgeNumber,
        passwordHash,
        role: userSeed.role,
        isActive: true,
        provinceId: province?.id ?? null,
        districtId: district?.id ?? null,
        stationId: station?.id ?? null,
      },
      create: {
        fullName: userSeed.fullName,
        email: userSeed.email,
        badgeNumber: userSeed.badgeNumber,
        passwordHash,
        role: userSeed.role,
        isActive: true,
        provinceId: province?.id ?? null,
        districtId: district?.id ?? null,
        stationId: station?.id ?? null,
      },
    });
  }

  const summary = {
    seed: config.seed,
    operationalCount: config.operationalCount,
    provinces: provinces.length,
    districts: districts.length,
    stations: stations.length,
    drivers: driverSeeds.length,
    tukTuks: tukTukSeeds.length,
    devices: deviceSeeds.length,
    users: demoUsers.length,
    demoPassword,
    sampleDeviceToken: deviceSeeds[0]?.authToken ?? null,
  };

  logger.info(summary, 'Core simulation seed completed successfully.');
  return summary;
};

const main = async () => {
  await seedCoreData();
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main()
    .catch((error) => {
      logger.error({ err: error }, 'Seed script failed');
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
