import * as stationsRepository from './stations.repository.js';
import { assertScopeAccess, buildScopeWhere } from '../../utils/accessScope.js';
import { ApiError } from '../../utils/apiError.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';
import {
  ensureDistrictBelongsToProvince,
  getDistrictOrThrow,
  getProvinceOrThrow,
} from '../../utils/regionValidation.js';

const stationFieldMap = {
  provinceField: 'provinceId',
  districtField: 'districtId',
  stationField: 'id',
};

export const listStations = async (query, user) => {
  const options = buildListOptions(query, {
    sorting: {
      sortBy: 'name',
      sortOrder: 'asc',
    },
  });
  const result = await stationsRepository.findMany(options, buildScopeWhere(user, stationFieldMap));

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

export const getStationById = async (id, user) => {
  const result = await stationsRepository.findById(id);

  if (!result.data) {
    throw new ApiError(404, 'Police station not found.');
  }

  assertScopeAccess(user, result.data, stationFieldMap);

  return result;
};

export const createStation = async (payload, user) => {
  assertScopeAccess(user, payload);

  const [province, district] = await Promise.all([
    getProvinceOrThrow(payload.provinceId),
    getDistrictOrThrow(payload.districtId),
  ]);

  ensureDistrictBelongsToProvince(district, province.id);

  return stationsRepository.create({
    ...payload,
    isActive: payload.isActive ?? true,
  });
};

export const updateStation = async (id, payload, user) => {
  const existingStation = await stationsRepository.findById(id);

  if (!existingStation.data) {
    throw new ApiError(404, 'Police station not found.');
  }

  assertScopeAccess(user, existingStation.data, stationFieldMap);

  const nextState = {
    provinceId: payload.provinceId ?? existingStation.data.provinceId,
    districtId: payload.districtId ?? existingStation.data.districtId,
    stationId: existingStation.data.id,
  };

  assertScopeAccess(user, nextState);

  const [province, district] = await Promise.all([
    getProvinceOrThrow(nextState.provinceId),
    getDistrictOrThrow(nextState.districtId),
  ]);

  ensureDistrictBelongsToProvince(district, province.id);

  return stationsRepository.update(id, payload);
};
