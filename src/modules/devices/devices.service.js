import * as devicesRepository from './devices.repository.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const listDevices = async (query) => {
  const options = buildListOptions(query);
  const result = await devicesRepository.findMany(options);

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

export const getDeviceById = async (id) => devicesRepository.findById(id);
export const createDevice = async (payload) => devicesRepository.create(payload);
export const updateDevice = async (id, payload) => devicesRepository.update(id, payload);

