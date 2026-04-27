import prisma from '../../config/prisma.js';

const buildProvinceWhere = (filters) => {
  if (!filters.search) {
    return {};
  }

  return {
    OR: [
      {
        name: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
      {
        code: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
    ],
  };
};

const resolveLastModified = (items) => {
  if (items.length === 0) {
    return null;
  }

  return items.reduce((latest, current) => {
    const candidate = current.updatedAt ?? current.createdAt;
    return candidate > latest ? candidate : latest;
  }, items[0].updatedAt ?? items[0].createdAt);
};

export const findMany = async (options) => {
  const where = buildProvinceWhere(options.filters);

  const [items, totalItems] = await Promise.all([
    prisma.province.findMany({
      where,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take,
    }),
    prisma.province.count({ where }),
  ]);

  return {
    items,
    totalItems,
    lastModified: resolveLastModified(items)?.toISOString() ?? null,
  };
};

export const findById = async (id) => {
  const province = await prisma.province.findUnique({
    where: { id },
  });

  return {
    data: province,
    lastModified: province ? (province.updatedAt ?? province.createdAt).toISOString() : null,
  };
};

export const create = async (payload) =>
  prisma.province.create({
    data: payload,
  });

export const update = async (id, payload) =>
  prisma.province.update({
    where: { id },
    data: payload,
  });
