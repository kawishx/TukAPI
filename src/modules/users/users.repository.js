import prisma from '../../config/prisma.js';
import { buildSearchWhere, combineWhere, resolveLastModified } from '../../utils/repositoryHelpers.js';

const userInclude = {
  province: {
    select: { id: true, name: true, code: true },
  },
  district: {
    select: { id: true, name: true, code: true },
  },
  station: {
    select: { id: true, name: true, code: true },
  },
};

export const findMany = async (options, scopeWhere) => {
  const where = combineWhere(
    scopeWhere,
    options.filters.role ? { role: options.filters.role } : {},
    options.filters.provinceId ? { provinceId: options.filters.provinceId } : {},
    options.filters.districtId ? { districtId: options.filters.districtId } : {},
    options.filters.stationId ? { stationId: options.filters.stationId } : {},
    options.filters.isActive !== undefined ? { isActive: options.filters.isActive } : {},
    buildSearchWhere(options.filters.search, ['fullName', 'email', 'badgeNumber', 'phoneNumber']),
  );

  const [items, totalItems] = await Promise.all([
    prisma.user.findMany({
      where,
      include: userInclude,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items,
    totalItems,
    lastModified: resolveLastModified(items)?.toISOString() ?? null,
  };
};

export const findById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: userInclude,
  });

  return {
    data: user,
    lastModified: user ? (user.updatedAt ?? user.createdAt).toISOString() : null,
  };
};

export const create = async (payload) =>
  prisma.user.create({
    data: payload,
    include: userInclude,
  });

export const update = async (id, payload) =>
  prisma.user.update({
    where: { id },
    data: Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined)),
    include: userInclude,
  });
