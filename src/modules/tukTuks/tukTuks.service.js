import * as tukTuksRepository from './tukTuks.repository.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const listTukTuks = async (query) => {
  const options = buildListOptions(query);
  const result = await tukTuksRepository.findMany(options);

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

export const getTukTukById = async (id) => tukTuksRepository.findById(id);
export const createTukTuk = async (payload) => tukTuksRepository.create(payload);
export const updateTukTuk = async (id, payload) => tukTuksRepository.update(id, payload);

