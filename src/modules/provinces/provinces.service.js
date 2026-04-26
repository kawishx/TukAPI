import * as provincesRepository from './provinces.repository.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const listProvinces = async (query) => {
  const options = buildListOptions(query);
  const result = await provincesRepository.findMany(options);

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

export const getProvinceById = async (id) => provincesRepository.findById(id);
export const createProvince = async (payload) => provincesRepository.create(payload);
export const updateProvince = async (id, payload) => provincesRepository.update(id, payload);

