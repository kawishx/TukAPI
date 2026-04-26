import * as stationsRepository from './stations.repository.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const listStations = async (query) => {
  const options = buildListOptions(query);
  const result = await stationsRepository.findMany(options);

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

export const getStationById = async (id) => stationsRepository.findById(id);
export const createStation = async (payload) => stationsRepository.create(payload);
export const updateStation = async (id, payload) => stationsRepository.update(id, payload);

