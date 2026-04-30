import * as districtsRepository from './districts.repository.js';
import { assertScopeAccess } from '../../utils/accessScope.js';
import { ApiError } from '../../utils/apiError.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

const buildDistrictScopeWhere = (user) => {
  if (user.role === 'HQ_ADMIN') {
    return {};
  }

  if (user.role === 'PROVINCIAL_ADMIN') {
    return {
      provinceId: user.provinceId,
    };
  }

  return {
    id: user.districtId,
  };
};

export const listDistricts = async (query, user) => {
  const options = buildListOptions(query, {
    sorting: {
      sortBy: 'name',
      sortOrder: 'asc',
    },
  });
  const result = await districtsRepository.findMany(options, buildDistrictScopeWhere(user));

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

export const getDistrictById = async (id, user) => {
  const result = await districtsRepository.findById(id);

  if (!result.data) {
    throw new ApiError(404, 'District not found.');
  }

  assertScopeAccess(user, result.data, {
    provinceField: 'provinceId',
    districtField: 'id',
  });

  return result;
};
