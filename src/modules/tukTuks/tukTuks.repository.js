import prisma from '../../config/prisma.js';
import { buildSearchWhere, combineWhere, resolveLastModified } from '../../utils/repositoryHelpers.js';

const tukTukInclude = {
  province: {
    select: { id: true, name: true, code: true },
  },
  district: {
    select: { id: true, name: true, code: true },
  },
  station: {
    select: { id: true, name: true, code: true },
  },
  driver: {
    select: { id: true, fullName: true, licenseNumber: true, isActive: true },
  },
  device: {
    select: { id: true, serialNumber: true, status: true, lastSeenAt: true },
  },
};

export const findMany = async (options, scopeWhere) => {
  const where = combineWhere(
    scopeWhere,
    options.filters.provinceId ? { provinceId: options.filters.provinceId } : {},
    options.filters.districtId ? { districtId: options.filters.districtId } : {},
    options.filters.stationId ? { stationId: options.filters.stationId } : {},
    options.filters.driverId ? { driverId: options.filters.driverId } : {},
    options.filters.deviceId ? { deviceId: options.filters.deviceId } : {},
    options.filters.status ? { status: options.filters.status } : {},
    options.filters.plateNumber ? { plateNumber: options.filters.plateNumber } : {},
    options.filters.registrationNumber ? { registrationNumber: options.filters.registrationNumber } : {},
    buildSearchWhere(options.filters.search, ['registrationNumber', 'plateNumber', 'model', 'color', 'notes']),
  );

  const [items, totalItems] = await Promise.all([
    prisma.tukTuk.findMany({
      where,
      include: tukTukInclude,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
    }),
    prisma.tukTuk.count({ where }),
  ]);

  return {
    items,
    totalItems,
    lastModified: resolveLastModified(items)?.toISOString() ?? null,
  };
};

export const findById = async (id) => {
  const tukTuk = await prisma.tukTuk.findUnique({
    where: { id },
    include: tukTukInclude,
  });

  return {
    data: tukTuk,
    lastModified: tukTuk ? (tukTuk.updatedAt ?? tukTuk.createdAt).toISOString() : null,
  };
};

export const findByDeviceId = async (deviceId) =>
  prisma.tukTuk.findFirst({
    where: { deviceId },
    select: {
      id: true,
      deviceId: true,
    },
  });

export const create = async (payload) =>
  prisma.tukTuk.create({
    data: payload,
    include: tukTukInclude,
  });

export const update = async (id, payload) =>
  prisma.tukTuk.update({
    where: { id },
    data: payload,
    include: tukTukInclude,
  });
