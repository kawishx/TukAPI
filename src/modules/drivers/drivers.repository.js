import prisma from '../../config/prisma.js';
import { buildSearchWhere, combineWhere, resolveLastModified } from '../../utils/repositoryHelpers.js';

const driverInclude = {
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

export const findMany = async (options, scopeWhere) => {
  const where = combineWhere(
    scopeWhere,
    options.filters.provinceId ? { provinceId: options.filters.provinceId } : {},
    options.filters.districtId ? { districtId: options.filters.districtId } : {},
    options.filters.stationId ? { stationId: options.filters.stationId } : {},
    options.filters.isActive !== undefined ? { isActive: options.filters.isActive } : {},
    options.filters.licenseNumber ? { licenseNumber: options.filters.licenseNumber } : {},
    options.filters.nationalId ? { nationalId: options.filters.nationalId } : {},
    buildSearchWhere(options.filters.search, ['fullName', 'licenseNumber', 'nationalId', 'phoneNumber']),
  );

  const [items, totalItems] = await Promise.all([
    prisma.driver.findMany({
      where,
      include: driverInclude,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
    }),
    prisma.driver.count({ where }),
  ]);

  return {
    items,
    totalItems,
    lastModified: resolveLastModified(items)?.toISOString() ?? null,
  };
};

export const findById = async (id) => {
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: driverInclude,
  });

  return {
    data: driver,
    lastModified: driver ? (driver.updatedAt ?? driver.createdAt).toISOString() : null,
  };
};

export const create = async (payload) =>
  prisma.driver.create({
    data: payload,
    include: driverInclude,
  });

export const update = async (id, payload) =>
  prisma.driver.update({
    where: { id },
    data: payload,
    include: driverInclude,
  });
