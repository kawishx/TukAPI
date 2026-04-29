import prisma from '../../config/prisma.js';

const parseDateTime = (value) => new Date(value);

const resolveLastModified = (records) => {
  if (records.length === 0) {
    return null;
  }

  return records.reduce((latest, current) => {
    const candidate = current.updatedAt ?? current.createdAt ?? current.recordedAt;
    return candidate > latest ? candidate : latest;
  }, records[0].updatedAt ?? records[0].createdAt ?? records[0].recordedAt);
};

export const create = async (payload, authenticatedDeviceId) => {
  const recordedAt = parseDateTime(payload.recordedAt);
  const receivedAt = new Date();

  const createdPing = await prisma.$transaction(async (tx) => {
    const locationPing = await tx.locationPing.create({
      data: {
        ...payload,
        deviceId: authenticatedDeviceId,
        recordedAt,
      },
    });

    await tx.currentLocation.upsert({
      where: {
        tukTukId: payload.tukTukId,
      },
      create: {
        ...payload,
        deviceId: authenticatedDeviceId,
        recordedAt,
        receivedAt,
      },
      update: {
        provinceId: payload.provinceId,
        districtId: payload.districtId,
        stationId: payload.stationId,
        deviceId: authenticatedDeviceId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        speedKph: payload.speedKph,
        heading: payload.heading,
        accuracyM: payload.accuracyM,
        recordedAt,
        receivedAt,
      },
    });

    await tx.trackingDevice.update({
      where: { id: authenticatedDeviceId },
      data: {
        lastSeenAt: recordedAt,
        lastAuthenticatedAt: receivedAt,
      },
    });

    return locationPing;
  });

  return createdPing;
};

export const findLatestByTukTukId = async (tukTukId, scopeWhere) => {
  const currentLocation = await prisma.currentLocation.findFirst({
    where: {
      tukTukId,
      ...scopeWhere,
    },
  });

  return {
    data: currentLocation,
    lastModified: currentLocation ? (currentLocation.updatedAt ?? currentLocation.createdAt).toISOString() : null,
  };
};

export const findHistory = async (options, scopeWhere) => {
  const where = {
    ...scopeWhere,
    ...(options.filters.tukTukId ? { tukTukId: options.filters.tukTukId } : {}),
    ...(options.filters.deviceId ? { deviceId: options.filters.deviceId } : {}),
    ...(options.filters.provinceId ? { provinceId: options.filters.provinceId } : {}),
    ...(options.filters.districtId ? { districtId: options.filters.districtId } : {}),
    ...(options.filters.stationId ? { stationId: options.filters.stationId } : {}),
    ...(options.filters.startTime || options.filters.endTime
      ? {
          recordedAt: {
            ...(options.filters.startTime ? { gte: parseDateTime(options.filters.startTime) } : {}),
            ...(options.filters.endTime ? { lte: parseDateTime(options.filters.endTime) } : {}),
          },
        }
      : {}),
  };

  const [items, totalItems] = await Promise.all([
    prisma.locationPing.findMany({
      where,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
    }),
    prisma.locationPing.count({ where }),
  ]);

  return {
    items,
    totalItems,
    lastModified: resolveLastModified(items)?.toISOString() ?? null,
  };
};
