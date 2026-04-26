import * as districtsRepository from './districts.repository.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const listDistricts = async (query) => {
  const options = buildListOptions(query);
  const result = await districtsRepository.findMany(options);

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

export const getDistrictById = async (id) => districtsRepository.findById(id);
export const createDistrict = async (payload) => districtsRepository.create(payload);
export const updateDistrict = async (id, payload) => districtsRepository.update(id, payload);

