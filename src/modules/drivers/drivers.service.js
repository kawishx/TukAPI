import * as driversRepository from './drivers.repository.js';
import { assertScopeAccess, buildScopeWhere } from '../../utils/accessScope.js';
import { ApiError } from '../../utils/apiError.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';
import { getStationOrThrow } from '../../utils/regionValidation.js';

export const listDrivers = async (query, user) => {
  const options = buildListOptions(query, {
    sorting: {
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  });
  const result = await driversRepository.findMany(options, buildScopeWhere(user));

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

export const getDriverById = async (id, user) => {
  const result = await driversRepository.findById(id);

  if (!result.data) {
    throw new ApiError(404, 'Driver not found.');
  }

  assertScopeAccess(user, result.data);

  return result;
};

export const createDriver = async (payload, user) => {
  const station = await getStationOrThrow(payload.stationId);

  assertScopeAccess(user, station);

  return driversRepository.create({
    ...payload,
    provinceId: station.provinceId,
    districtId: station.districtId,
    stationId: station.id,
    isActive: payload.isActive ?? true,
  });
};

export const updateDriver = async (id, payload, user) => {
  const existingDriver = await driversRepository.findById(id);

  if (!existingDriver.data) {
    throw new ApiError(404, 'Driver not found.');
  }

  assertScopeAccess(user, existingDriver.data);

  let regionUpdate = {};

  if (payload.stationId) {
    const station = await getStationOrThrow(payload.stationId);
    assertScopeAccess(user, station);
    regionUpdate = {
      provinceId: station.provinceId,
      districtId: station.districtId,
      stationId: station.id,
    };
  }

  const nextState = {
    ...existingDriver.data,
    ...regionUpdate,
    ...payload,
  };

  assertScopeAccess(user, nextState);

  return driversRepository.update(id, {
    ...payload,
    ...regionUpdate,
  });
};
