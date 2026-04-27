import { buildPaginationMeta, parsePagination } from './pagination.js';
import { parseSorting } from './sorting.js';

export const buildListOptions = (query, defaults = {}) => {
  const pagination = parsePagination(query, defaults.pagination);
  const sorting = parseSorting(query, defaults.sorting);

  return {
    ...pagination,
    ...sorting,
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
export { buildPaginationMeta };
