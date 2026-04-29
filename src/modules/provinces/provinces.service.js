import * as provincesRepository from './provinces.repository.js';
import { assertScopeAccess, buildScopeWhere } from '../../utils/accessScope.js';
import { ApiError } from '../../utils/apiError.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const listProvinces = async (query, user) => {
  const options = buildListOptions(query, {
    sorting: {
      sortBy: 'name',
      sortOrder: 'asc',
    },
  });
  const result = await provincesRepository.findMany(
    options,
    buildScopeWhere(user, {
      provinceField: 'id',
    }),
  );

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

export const getProvinceById = async (id, user) => {
  const result = await provincesRepository.findById(id);

  if (!result.data) {
    throw new ApiError(404, 'Province not found.');
  }

  assertScopeAccess(user, result.data, {
    provinceField: 'id',
  });

  return result;
};
export const createProvince = async (payload) => provincesRepository.create(payload);
export const updateProvince = async (id, payload) => provincesRepository.update(id, payload);
