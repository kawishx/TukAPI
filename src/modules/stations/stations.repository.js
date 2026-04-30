import prisma from '../../config/prisma.js';
import { buildSearchWhere, combineWhere, resolveLastModified } from '../../utils/repositoryHelpers.js';

const stationInclude = {
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
};

export const findMany = async (options, scopeWhere) => {
  const where = combineWhere(
    scopeWhere,
    options.filters.provinceId ? { provinceId: options.filters.provinceId } : {},
    options.filters.districtId ? { districtId: options.filters.districtId } : {},
    options.filters.isActive !== undefined ? { isActive: options.filters.isActive } : {},
    buildSearchWhere(options.filters.search, [
      'name',
      'code',
      'address',
      (search) => ({
        province: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      (search) => ({
        district: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]),
  );

  const [items, totalItems] = await Promise.all([
    prisma.policeStation.findMany({
      where,
      include: stationInclude,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
    }),
    prisma.policeStation.count({ where }),
  ]);

  return {
    items,
    totalItems,
    lastModified: resolveLastModified(items)?.toISOString() ?? null,
  };
};

export const findById = async (id) => {
  const station = await prisma.policeStation.findUnique({
    where: { id },
    include: stationInclude,
  });

  return {
    data: station,
    lastModified: station ? (station.updatedAt ?? station.createdAt).toISOString() : null,
  };
};

export const create = async (payload) =>
  prisma.policeStation.create({
    data: payload,
    include: stationInclude,
  });

export const update = async (id, payload) =>
  prisma.policeStation.update({
    where: { id },
    data: payload,
    include: stationInclude,
  });
