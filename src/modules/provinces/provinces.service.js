import * as provincesRepository from './provinces.repository.js';
import { ApiError } from '../../utils/apiError.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const listProvinces = async (query) => {
  const options = buildListOptions(query, {
    sorting: {
      sortBy: 'name',
      sortOrder: 'asc',
    },
  });
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

export const getProvinceById = async (id) => {
  const result = await provincesRepository.findById(id);

  if (!result.data) {
    throw new ApiError(404, 'Province not found.');
  }

  return result;
};
export const createProvince = async (payload) => provincesRepository.create(payload);
export const updateProvince = async (id, payload) => provincesRepository.update(id, payload);
