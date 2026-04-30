import prisma from '../../config/prisma.js';
import { buildSearchWhere, combineWhere, resolveLastModified } from '../../utils/repositoryHelpers.js';

const districtInclude = {
  province: {
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
    options.filters.provinceId
      ? {
          provinceId: options.filters.provinceId,
        }
      : {},
    options.filters.provinceCode
      ? {
          province: {
            code: options.filters.provinceCode,
          },
        }
      : {},
    buildSearchWhere(options.filters.search, [
      'name',
      'code',
      (search) => ({
        province: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      (search) => ({
        province: {
          code: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]),
  );

  const [items, totalItems] = await Promise.all([
    prisma.district.findMany({
      where,
      include: districtInclude,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
    }),
    prisma.district.count({ where }),
  ]);

  return {
    items,
    totalItems,
    lastModified: resolveLastModified(items)?.toISOString() ?? null,
  };
};

export const findById = async (id) => {
  const district = await prisma.district.findUnique({
    where: { id },
    include: districtInclude,
  });

  return {
    data: district,
    lastModified: district ? (district.updatedAt ?? district.createdAt).toISOString() : null,
  };
};
