import { logger } from '../src/config/logger.js';
import prisma from '../src/config/prisma.js';
import { hashPassword } from '../src/utils/password.js';
import { USER_ROLES } from '../src/utils/constants.js';
import { generateDeviceToken, hashOpaqueToken } from '../src/modules/auth/auth.tokens.js';

async function main() {
  // Development-only demo credentials for university project setup.
  const demoPassword = 'DemoPass123!';
  const demoDeviceToken = generateDeviceToken();

  const westernProvince = await prisma.province.upsert({
    where: { code: 'WP' },
    update: {},
    create: {
      name: 'Western Province',
      code: 'WP',
    },
  });

  const colomboDistrict = await prisma.district.upsert({
    where: { code: 'COL' },
    update: {
      provinceId: westernProvince.id,
    },
    create: {
      name: 'Colombo',
      code: 'COL',
      provinceId: westernProvince.id,
    },
  });

  const fortStation = await prisma.policeStation.upsert({
    where: { code: 'FORT' },
    update: {
      provinceId: westernProvince.id,
      districtId: colomboDistrict.id,
    },
    create: {
      name: 'Fort Police Station',
      code: 'FORT',
      address: 'Colombo 01',
      provinceId: westernProvince.id,
      districtId: colomboDistrict.id,
      contactNumber: '+94112345678',
    },
  });

  const device = await prisma.trackingDevice.upsert({
    where: { serialNumber: 'TD-0001' },
    update: {
      authTokenHash: hashOpaqueToken(demoDeviceToken),
    },
    create: {
      serialNumber: 'TD-0001',
      imei: '359881234567890',
      status: 'ACTIVE',
      authTokenHash: hashOpaqueToken(demoDeviceToken),
    },
  });

  const sampleTukTuk = await prisma.tukTuk.upsert({
    where: { registrationNumber: 'REG-2026-000145' },
    update: {
      provinceId: westernProvince.id,
      districtId: colomboDistrict.id,
      stationId: fortStation.id,
      deviceId: device.id,
    },
    create: {
      registrationNumber: 'REG-2026-000145',
      plateNumber: 'WP CAB-4567',
      model: 'Bajaj RE',
      color: 'Green',
      status: 'ACTIVE',
      provinceId: westernProvince.id,
      districtId: colomboDistrict.id,
      stationId: fortStation.id,
      deviceId: device.id,
    },
  });

  const demoUsers = [
    {
      fullName: 'HQ Administrator',
      email: 'hq.admin@demo.local',
      badgeNumber: 'HQ-001',
      role: USER_ROLES.HQ_ADMIN,
    },
    {
      fullName: 'Provincial Admin',
      email: 'provincial.admin@demo.local',
      badgeNumber: 'PV-001',
      role: USER_ROLES.PROVINCIAL_ADMIN,
      provinceId: westernProvince.id,
    },
    {
      fullName: 'District Officer',
      email: 'district.officer@demo.local',
      badgeNumber: 'DT-001',
      role: USER_ROLES.DISTRICT_OFFICER,
      provinceId: westernProvince.id,
      districtId: colomboDistrict.id,
    },
    {
      fullName: 'Station Officer',
      email: 'station.officer@demo.local',
      badgeNumber: 'ST-001',
      role: USER_ROLES.STATION_OFFICER,
      provinceId: westernProvince.id,
      districtId: colomboDistrict.id,
      stationId: fortStation.id,
    },
  ];

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        ...user,
        passwordHash: await hashPassword(demoPassword),
        isActive: true,
      },
      create: {
        ...user,
        passwordHash: await hashPassword(demoPassword),
        isActive: true,
      },
    });
  }

  logger.info('Development seed completed successfully.');
  logger.info(`Demo user password: ${demoPassword}`);
  logger.info(`Demo device token for ${device.serialNumber}: ${demoDeviceToken}`);
  logger.info(`Sample tuk-tuk registered: ${sampleTukTuk.registrationNumber}`);
}

main()
  .catch((error) => {
    logger.error({ err: error }, 'Seed script failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
