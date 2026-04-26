export const buildListOptions = (query) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc',
    },
    filters: Object.fromEntries(
      Object.entries({
        search: query.search,
        provinceId: query.provinceId,
        districtId: query.districtId,
        stationId: query.stationId,
        status: query.status,
        role: query.role,
        tukTukId: query.tukTukId,
        deviceId: query.deviceId,
        driverId: query.driverId,
        startTime: query.startTime,
        endTime: query.endTime,
      }).filter(([, value]) => value !== undefined && value !== null && value !== ''),
    ),
  };
};

export const buildPaginationMeta = ({ page, limit, totalItems }) => ({
  page,
  limit,
  totalItems,
  totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
});

