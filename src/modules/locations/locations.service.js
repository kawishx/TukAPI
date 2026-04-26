import * as locationsRepository from './locations.repository.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const createLocationPing = async (payload) => locationsRepository.create(payload);

export const getLiveLocation = async (tukTukId) => locationsRepository.findLatestByTukTukId(tukTukId);

export const getLocationHistory = async (query) => {
  const options = buildListOptions(query);
  const result = await locationsRepository.findHistory(options);

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

