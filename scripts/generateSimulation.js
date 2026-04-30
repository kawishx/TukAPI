import { pathToFileURL } from 'node:url';

import { logger } from '../src/config/logger.js';
import prisma from '../src/config/prisma.js';
import { stationByCode } from './simulationCatalog.js';
import {
  addDaysUtc,
  chunkArray,
  clamp,
  createSeededRandom,
  formatDateOnly,
  getSimulationConfig,
  randomBetween,
  randomInteger,
  setUtcTime,
} from './simulationUtils.js';

const INSERT_BATCH_SIZE = 1000;

const ACTIVE_WINDOWS = [
  { key: 'morning', startHour: 6, startMinute: 15, endHour: 9, endMinute: 30, weekdayInterval: 12, weekendInterval: 18 },
  { key: 'midday', startHour: 11, startMinute: 0, endHour: 13, endMinute: 30, weekdayInterval: 18, weekendInterval: 24 },
  { key: 'evening', startHour: 15, startMinute: 30, endHour: 19, endMinute: 45, weekdayInterval: 12, weekendInterval: 16 },
];

const PARKED_TIMES = [
  { hours: 0, minutes: 30 },
  { hours: 3, minutes: 30 },
  { hours: 5, minutes: 45 },
  { hours: 10, minutes: 0 },
  { hours: 14, minutes: 15 },
  { hours: 21, minutes: 30 },
  { hours: 23, minutes: 15 },
];

const createPoint = (latitude, longitude) => ({ latitude, longitude });

const offsetPoint = (origin, latDelta, lngDelta) => createPoint(origin.latitude + latDelta, origin.longitude + lngDelta);

const applyJitter = (point, random, radius = 0.00045) =>
  createPoint(
    clamp(point.latitude + randomBetween(random, -radius, radius), -90, 90),
    clamp(point.longitude + randomBetween(random, -radius, radius), -180, 180),
  );

const interpolatePoint = (startPoint, endPoint, progress) =>
  createPoint(
    startPoint.latitude + (endPoint.latitude - startPoint.latitude) * progress,
    startPoint.longitude + (endPoint.longitude - startPoint.longitude) * progress,
  );

const calculateHeading = (startPoint, endPoint) => {
  const latitudeDelta = endPoint.latitude - startPoint.latitude;
  const longitudeDelta = endPoint.longitude - startPoint.longitude;

  if (latitudeDelta === 0 && longitudeDelta === 0) {
    return null;
  }

  return (Math.atan2(longitudeDelta, latitudeDelta) * (180 / Math.PI) + 360) % 360;
};

const buildRouteClusters = (stationSeed, vehicleIndex, random) => {
  const home = createPoint(stationSeed.latitude, stationSeed.longitude);
  const baseLatOffset = 0.0045 + (vehicleIndex % 4) * 0.0012;
  const baseLngOffset = 0.005 + (vehicleIndex % 3) * 0.0014;
  const fineAdjustment = randomBetween(random, -0.0012, 0.0012);

  return [
    offsetPoint(home, baseLatOffset + fineAdjustment, baseLngOffset * 0.5),
    offsetPoint(home, -baseLatOffset * 0.75, baseLngOffset + fineAdjustment),
    offsetPoint(home, baseLatOffset * 0.4, -baseLngOffset * 0.8),
    offsetPoint(home, -baseLatOffset * 0.5, -baseLngOffset * 0.6),
  ];
};

const buildRecordedAt = (dayStart, hours, minutes) => {
  const date = new Date(dayStart);
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
};

const buildReceivedAt = (recordedAt, random) => {
  const receivedAt = new Date(recordedAt);
  receivedAt.setUTCSeconds(receivedAt.getUTCSeconds() + randomInteger(random, 12, 40));
  return receivedAt;
};

const buildParkedPing = ({ tukTuk, when, home, random }) => {
  const point = applyJitter(home, random, 0.00025);
  const recordedAt = when;

  return {
    tukTukId: tukTuk.id,
    deviceId: tukTuk.device.id,
    provinceId: tukTuk.provinceId,
    districtId: tukTuk.districtId,
    stationId: tukTuk.stationId,
    latitude: point.latitude,
    longitude: point.longitude,
    speedKph: 0,
    heading: null,
    accuracyM: randomBetween(random, 3.5, 8.5),
    ignitionOn: false,
    recordedAt,
    receivedAt: buildReceivedAt(recordedAt, random),
  };
};

const buildWindowTimestamps = (dayStart, windowConfig, intervalMinutes) => {
  const timestamps = [];
  const startAt = buildRecordedAt(dayStart, windowConfig.startHour, windowConfig.startMinute);
  const endAt = buildRecordedAt(dayStart, windowConfig.endHour, windowConfig.endMinute);

  for (let timestamp = new Date(startAt); timestamp <= endAt; timestamp = new Date(timestamp.getTime() + intervalMinutes * 60 * 1000)) {
    timestamps.push(new Date(timestamp));
  }

  return timestamps;
};

const buildActiveWindowPings = ({ tukTuk, dayStart, windowConfig, clusters, home, random, vehicleIndex, dayIndex }) => {
  const isWeekend = [0, 6].includes(dayStart.getUTCDay());
  const intervalMinutes = isWeekend ? windowConfig.weekendInterval : windowConfig.weekdayInterval;
  const timestamps = buildWindowTimestamps(dayStart, windowConfig, intervalMinutes);
  const clusterOrder = [
    clusters[(vehicleIndex + dayIndex) % clusters.length],
    clusters[(vehicleIndex + dayIndex + 1) % clusters.length],
    clusters[(vehicleIndex + dayIndex + 2 + ACTIVE_WINDOWS.indexOf(windowConfig)) % clusters.length],
  ];
  const route = [home, ...clusterOrder, home];
  const segmentCount = route.length - 1;

  return timestamps.map((recordedAt, index) => {
    const progress = timestamps.length === 1 ? 0 : index / (timestamps.length - 1);
    const segmentPosition = progress * segmentCount;
    const segmentIndex = Math.min(segmentCount - 1, Math.floor(segmentPosition));
    const segmentProgress = segmentPosition - segmentIndex;
    const startPoint = route[segmentIndex];
    const endPoint = route[segmentIndex + 1];
    const basePoint = interpolatePoint(startPoint, endPoint, segmentProgress);
    const point = applyJitter(basePoint, random, 0.00055);

    return {
      tukTukId: tukTuk.id,
      deviceId: tukTuk.device.id,
      provinceId: tukTuk.provinceId,
      districtId: tukTuk.districtId,
      stationId: tukTuk.stationId,
      latitude: point.latitude,
      longitude: point.longitude,
      speedKph: randomBetween(random, isWeekend ? 10 : 14, isWeekend ? 28 : 38),
      heading: calculateHeading(startPoint, endPoint),
      accuracyM: randomBetween(random, 4, 12),
      ignitionOn: true,
      recordedAt,
      receivedAt: buildReceivedAt(recordedAt, random),
    };
  });
};

const buildVehiclePings = ({ tukTuk, vehicleIndex, simulationStart, days, seed }) => {
  const stationSeed = stationByCode.get(tukTuk.station.code);

  if (!stationSeed) {
    throw new Error(`Missing station coordinate seed for station code ${tukTuk.station.code}`);
  }

  const random = createSeededRandom(`${seed}:${tukTuk.registrationNumber}`);
  const home = createPoint(stationSeed.latitude, stationSeed.longitude);
  const clusters = buildRouteClusters(stationSeed, vehicleIndex, random);
  const records = [];

  for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
    const dayStart = addDaysUtc(simulationStart, dayIndex);

    for (const parkedTime of PARKED_TIMES.slice(0, 3)) {
      records.push(
        buildParkedPing({
          tukTuk,
          when: buildRecordedAt(dayStart, parkedTime.hours, parkedTime.minutes),
          home,
          random,
        }),
      );
    }

    for (const windowConfig of ACTIVE_WINDOWS) {
      records.push(...buildActiveWindowPings({
        tukTuk,
        dayStart,
        windowConfig,
        clusters,
        home,
        random,
        vehicleIndex,
        dayIndex,
      }));

      const parkedCheckpoint = PARKED_TIMES.find(
        (parkedTime) => parkedTime.hours > windowConfig.endHour || (
          parkedTime.hours === windowConfig.endHour && parkedTime.minutes > windowConfig.endMinute
        ),
      );

      if (parkedCheckpoint) {
        records.push(
          buildParkedPing({
            tukTuk,
            when: buildRecordedAt(dayStart, parkedCheckpoint.hours, parkedCheckpoint.minutes),
            home,
            random,
          }),
        );
      }
    }

    const finalParkedTime = PARKED_TIMES[PARKED_TIMES.length - 1];
    records.push(
      buildParkedPing({
        tukTuk,
        when: buildRecordedAt(dayStart, finalParkedTime.hours, finalParkedTime.minutes),
        home,
        random,
      }),
    );
  }

  return records.sort((left, right) => left.recordedAt.getTime() - right.recordedAt.getTime());
};

const resetExistingHistory = async (tukTukIds, deviceIds) => {
  await prisma.$transaction(async (tx) => {
    await tx.currentLocation.deleteMany({
      where: {
        tukTukId: {
          in: tukTukIds,
        },
      },
    });

    await tx.locationPing.deleteMany({
      where: {
        tukTukId: {
          in: tukTukIds,
        },
      },
    });

    await tx.trackingDevice.updateMany({
      where: {
        id: {
          in: deviceIds,
        },
      },
      data: {
        lastSeenAt: null,
        lastAuthenticatedAt: null,
      },
    });
  });
};

export const generateSimulationData = async () => {
  const config = getSimulationConfig();
  const simulationEnd = normalizeSimulationEnd(config.demoDate);
  const simulationStart = addDaysUtc(simulationEnd, -config.days);
  const fleet = await prisma.tukTuk.findMany({
    where: {
      status: 'ACTIVE',
      notes: {
        startsWith: 'Simulation fleet vehicle',
      },
      stationId: {
        not: null,
      },
      deviceId: {
        not: null,
      },
    },
    include: {
      station: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
      device: {
        select: {
          id: true,
          serialNumber: true,
        },
      },
    },
    orderBy: {
      registrationNumber: 'asc',
    },
    take: config.operationalCount,
  });

  if (fleet.length < config.operationalCount) {
    throw new Error(`Expected at least ${config.operationalCount} active tuk-tuks with devices, but found ${fleet.length}.`);
  }

  const tukTukIds = fleet.map((tukTuk) => tukTuk.id);
  const deviceIds = fleet.map((tukTuk) => tukTuk.device.id);

  if (config.resetHistory) {
    await resetExistingHistory(tukTukIds, deviceIds);
  }

  const historicalPings = [];
  const currentLocations = [];

  fleet.forEach((tukTuk, vehicleIndex) => {
    const vehiclePings = buildVehiclePings({
      tukTuk,
      vehicleIndex,
      simulationStart,
      days: config.days,
      seed: config.seed,
    });

    historicalPings.push(...vehiclePings);

    const latestPing = vehiclePings[vehiclePings.length - 1];
    currentLocations.push({
      tukTukId: latestPing.tukTukId,
      deviceId: latestPing.deviceId,
      provinceId: latestPing.provinceId,
      districtId: latestPing.districtId,
      stationId: latestPing.stationId,
      latitude: latestPing.latitude,
      longitude: latestPing.longitude,
      speedKph: latestPing.speedKph,
      heading: latestPing.heading,
      accuracyM: latestPing.accuracyM,
      ignitionOn: latestPing.ignitionOn,
      recordedAt: latestPing.recordedAt,
      receivedAt: latestPing.receivedAt,
    });
  });

  for (const chunk of chunkArray(historicalPings, INSERT_BATCH_SIZE)) {
    await prisma.locationPing.createMany({
      data: chunk,
    });
  }

  await prisma.currentLocation.createMany({
    data: currentLocations,
  });

  for (const currentLocation of currentLocations) {
    await prisma.trackingDevice.update({
      where: {
        id: currentLocation.deviceId,
      },
      data: {
        lastSeenAt: currentLocation.recordedAt,
        lastAuthenticatedAt: currentLocation.receivedAt,
      },
    });
  }

  const summary = {
    seed: config.seed,
    demoDate: formatDateOnly(config.demoDate),
    simulationStart: historicalPings[0]?.recordedAt.toISOString() ?? simulationStart.toISOString(),
    simulationEnd: historicalPings[historicalPings.length - 1]?.recordedAt.toISOString() ?? addDaysUtc(simulationEnd, -1).toISOString(),
    tukTuksSimulated: fleet.length,
    days: config.days,
    generatedPings: historicalPings.length,
    currentLocations: currentLocations.length,
  };

  logger.info(summary, 'Simulation history generated successfully.');
  return summary;
};

const normalizeSimulationEnd = (demoDate) => setUtcTime(demoDate, 0, 0);

const main = async () => {
  await generateSimulationData();
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main()
    .catch((error) => {
      logger.error({ err: error }, 'Simulation generation failed');
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
