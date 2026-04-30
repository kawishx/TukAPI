import prisma from '../../config/prisma.js';
import { buildSearchWhere, combineWhere, resolveLastModified } from '../../utils/repositoryHelpers.js';

const deviceInclude = {
  assignedTukTuk: {
    select: {
      id: true,
      registrationNumber: true,
      plateNumber: true,
      provinceId: true,
      districtId: true,
      stationId: true,
      deviceId: true,
    },
  },
};

export const findMany = async (options, scopeWhere) => {
  const where = combineWhere(
    scopeWhere,
    options.filters.status ? { status: options.filters.status } : {},
    options.filters.serialNumber ? { serialNumber: options.filters.serialNumber } : {},
    options.filters.tukTukId
      ? {
          assignedTukTuk: {
            id: options.filters.tukTukId,
          },
        }
      : {},
    buildSearchWhere(options.filters.search, ['serialNumber', 'imei', 'simNumber', 'firmwareVersion']),
  );

  const [items, totalItems] = await Promise.all([
    prisma.trackingDevice.findMany({
      where,
      include: deviceInclude,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
    }),
    prisma.trackingDevice.count({ where }),
  ]);

  return {
    items,
    totalItems,
    lastModified: resolveLastModified(items)?.toISOString() ?? null,
  };
};

export const findById = async (id) => {
  const device = await prisma.trackingDevice.findUnique({
    where: { id },
    include: deviceInclude,
  });

  return {
    data: device,
    lastModified: device ? (device.updatedAt ?? device.createdAt).toISOString() : null,
  };
};

export const create = async (payload) =>
  prisma.trackingDevice.create({
    data: payload,
    include: deviceInclude,
  });

export const update = async (id, payload) =>
  prisma.trackingDevice.update({
    where: { id },
    data: Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined)),
    include: deviceInclude,
  });

export const clearAssignment = async (deviceId) =>
  prisma.tukTuk.updateMany({
    where: { deviceId },
    data: {
      deviceId: null,
    },
  });

export const assignToTukTuk = async (deviceId, tukTukId) =>
  prisma.tukTuk.update({
    where: { id: tukTukId },
    data: {
      deviceId,
    },
  });
