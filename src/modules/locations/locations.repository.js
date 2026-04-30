import prisma from '../../config/prisma.js';
import { buildSearchWhere, combineWhere, resolveLastModified } from '../../utils/repositoryHelpers.js';

const parseDateTime = (value) => new Date(value);

const locationInclude = {
  tukTuk: {
    select: {
      id: true,
      registrationNumber: true,
      plateNumber: true,
      model: true,
      status: true,
    },
  },
  device: {
    select: {
      id: true,
      serialNumber: true,
      status: true,
      lastSeenAt: true,
    },
  },
  province: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  district: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  station: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
};

const toNumberOrNull = (value) => (value === null || value === undefined ? null : Number(value));

const serializeLocationRecord = (record) => {
  if (!record) {
    return null;
  }

  const { speedKph, ...rest } = record;

  return {
    ...rest,
    latitude: Number(rest.latitude),
    longitude: Number(rest.longitude),
    speedKmh: toNumberOrNull(speedKph),
    heading: toNumberOrNull(rest.heading),
    accuracyM: toNumberOrNull(rest.accuracyM),
  };
};

const serializeLocationRecords = (records) => records.map(serializeLocationRecord);

export const create = async (payload, authenticatedDeviceId) => {
  const recordedAt = parseDateTime(payload.recordedAt);
  const receivedAt = new Date();

  const createdPing = await prisma.$transaction(async (tx) => {
    const [existingCurrentLocation, deviceState] = await Promise.all([
      tx.currentLocation.findUnique({
        where: {
          tukTukId: payload.tukTukId,
        },
        select: {
          tukTukId: true,
          recordedAt: true,
        },
      }),
      tx.trackingDevice.findUnique({
        where: {
          id: authenticatedDeviceId,
        },
        select: {
          lastSeenAt: true,
        },
      }),
    ]);

    const locationPing = await tx.locationPing.create({
      data: {
        ...payload,
        deviceId: authenticatedDeviceId,
        recordedAt,
      },
      include: locationInclude,
    });

    if (!existingCurrentLocation) {
      await tx.currentLocation.create({
        data: {
          ...payload,
          deviceId: authenticatedDeviceId,
          recordedAt,
          receivedAt,
        },
      });
    } else if (recordedAt > existingCurrentLocation.recordedAt) {
      await tx.currentLocation.update({
        where: {
          tukTukId: payload.tukTukId,
        },
        data: {
          provinceId: payload.provinceId,
          districtId: payload.districtId,
          stationId: payload.stationId,
          deviceId: authenticatedDeviceId,
          latitude: payload.latitude,
          longitude: payload.longitude,
          speedKph: payload.speedKph,
          heading: payload.heading,
          accuracyM: payload.accuracyM,
          ignitionOn: payload.ignitionOn,
          recordedAt,
          receivedAt,
        },
      });
    }

    await tx.trackingDevice.update({
      where: {
        id: authenticatedDeviceId,
      },
      data: {
        lastSeenAt:
          !deviceState?.lastSeenAt || recordedAt > deviceState.lastSeenAt
            ? recordedAt
            : deviceState.lastSeenAt,
        lastAuthenticatedAt: receivedAt,
      },
    });

    return locationPing;
  });

  return serializeLocationRecord(createdPing);
};

export const findLatestByTukTukId = async (tukTukId, scopeWhere) => {
  const currentLocation = await prisma.currentLocation.findFirst({
    where: {
      tukTukId,
      ...scopeWhere,
    },
    include: locationInclude,
  });

  return {
    data: serializeLocationRecord(currentLocation),
    lastModified: currentLocation ? (currentLocation.updatedAt ?? currentLocation.createdAt).toISOString() : null,
  };
};

export const findLive = async (options, scopeWhere) => {
  const where = combineWhere(
    scopeWhere,
    options.filters.tukTukId ? { tukTukId: options.filters.tukTukId } : {},
    options.filters.deviceId ? { deviceId: options.filters.deviceId } : {},
    options.filters.provinceId ? { provinceId: options.filters.provinceId } : {},
    options.filters.districtId ? { districtId: options.filters.districtId } : {},
    options.filters.stationId ? { stationId: options.filters.stationId } : {},
    options.filters.status
      ? {
          tukTuk: {
            status: options.filters.status,
          },
        }
      : {},
    options.filters.updatedAfter
      ? {
          updatedAt: {
            gte: parseDateTime(options.filters.updatedAfter),
          },
        }
      : {},
    buildSearchWhere(options.filters.search, [
      (search) => ({
        tukTuk: {
          registrationNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      (search) => ({
        tukTuk: {
          plateNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      (search) => ({
        tukTuk: {
          model: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      (search) => ({
        device: {
          serialNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      (search) => ({
        station: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]),
  );

  const [items, totalItems] = await Promise.all([
    prisma.currentLocation.findMany({
      where,
      include: locationInclude,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
    }),
    prisma.currentLocation.count({ where }),
  ]);

  return {
    items: serializeLocationRecords(items),
    totalItems,
    lastModified: resolveLastModified(items)?.toISOString() ?? null,
  };
};

export const findHistory = async (options, scopeWhere) => {
  const where = combineWhere(
    scopeWhere,
    options.filters.tukTukId ? { tukTukId: options.filters.tukTukId } : {},
    options.filters.deviceId ? { deviceId: options.filters.deviceId } : {},
    options.filters.provinceId ? { provinceId: options.filters.provinceId } : {},
    options.filters.districtId ? { districtId: options.filters.districtId } : {},
    options.filters.stationId ? { stationId: options.filters.stationId } : {},
    options.filters.ignitionOn !== undefined ? { ignitionOn: options.filters.ignitionOn } : {},
    options.filters.from || options.filters.to
      ? {
          recordedAt: {
            ...(options.filters.from ? { gte: parseDateTime(options.filters.from) } : {}),
            ...(options.filters.to ? { lte: parseDateTime(options.filters.to) } : {}),
          },
        }
      : {},
  );

  const [items, totalItems] = await Promise.all([
    prisma.locationPing.findMany({
      where,
      include: locationInclude,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
    }),
    prisma.locationPing.count({ where }),
  ]);

  return {
    items: serializeLocationRecords(items),
    totalItems,
    lastModified: resolveLastModified(items)?.toISOString() ?? null,
  };
};
