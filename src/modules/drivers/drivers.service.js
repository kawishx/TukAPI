import * as driversRepository from './drivers.repository.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const listDrivers = async (query) => {
  const options = buildListOptions(query);
  const result = await driversRepository.findMany(options);

  return {
    items: result.items,
    meta: buildPaginationMeta({
      page: options.page,
      limit: options.limit,
      totalItems: result.totalItems,
    }),
    lastModified: result.lastModified,
  };
};

export const getDriverById = async (id) => driversRepository.findById(id);
export const createDriver = async (payload) => driversRepository.create(payload);
export const updateDriver = async (id, payload) => driversRepository.update(id, payload);

