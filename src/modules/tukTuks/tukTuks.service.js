import * as tukTuksRepository from './tukTuks.repository.js';
import * as locationsService from '../locations/locations.service.js';
import { assertScopeAccess, buildScopeWhere } from '../../utils/accessScope.js';
import { ApiError } from '../../utils/apiError.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';
import {
  ensureDistrictBelongsToProvince,
  ensureDriverMatchesRegion,
  ensureStationMatchesRegion,
  getDeviceOrThrow,
  getDistrictOrThrow,
  getDriverOrThrow,
  getProvinceOrThrow,
  getStationOrThrow,
} from '../../utils/regionValidation.js';

const ensureDeviceAvailability = async (deviceId, currentTukTukId = null) => {
  if (!deviceId) {
    return null;
  }

  const device = await getDeviceOrThrow(deviceId);

  if (device.status === 'RETIRED') {
    throw new ApiError(422, 'Retired devices cannot be assigned to a tuk-tuk.');
  }

  const assignedTukTuk = await tukTuksRepository.findByDeviceId(deviceId);

  if (assignedTukTuk && assignedTukTuk.id !== currentTukTukId) {
    throw new ApiError(422, 'Tracking device is already assigned to another tuk-tuk.');
  }

  return device;
};

const validateTukTukRegion = async ({ provinceId, districtId, stationId }) => {
  const [province, district, station] = await Promise.all([
    getProvinceOrThrow(provinceId),
    getDistrictOrThrow(districtId),
    getStationOrThrow(stationId),
  ]);

  ensureDistrictBelongsToProvince(district, province.id);
  ensureStationMatchesRegion(station, {
    provinceId: province.id,
    districtId: district.id,
  });

  return { province, district, station };
};

export const listTukTuks = async (query, user) => {
  const options = buildListOptions(query, {
    sorting: {
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  });
  const result = await tukTuksRepository.findMany(options, buildScopeWhere(user));

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

export const getTukTukById = async (id, user) => {
  const result = await tukTuksRepository.findById(id);

  if (!result.data) {
    throw new ApiError(404, 'Tuk-tuk not found.');
  }

  assertScopeAccess(user, result.data);

  return result;
};

export const getTukTukLocationHistory = async (id, query, user) => {
  const existingTukTuk = await tukTuksRepository.findById(id);

  if (!existingTukTuk.data) {
    throw new ApiError(404, 'Tuk-tuk not found.');
  }

  assertScopeAccess(user, existingTukTuk.data);

  return locationsService.getLocationHistory(
    {
      ...query,
      tukTukId: id,
    },
    user,
  );
};

export const createTukTuk = async (payload, user) => {
  assertScopeAccess(user, payload);

  await validateTukTukRegion(payload);

  if (payload.driverId) {
    const driver = await getDriverOrThrow(payload.driverId);
    ensureDriverMatchesRegion(driver, payload);
  }

  if (payload.deviceId) {
    await ensureDeviceAvailability(payload.deviceId);
  }

  return tukTuksRepository.create({
    ...payload,
    color: payload.color ?? null,
    notes: payload.notes ?? null,
  });
};

export const updateTukTuk = async (id, payload, user) => {
  const existingTukTuk = await tukTuksRepository.findById(id);

  if (!existingTukTuk.data) {
    throw new ApiError(404, 'Tuk-tuk not found.');
  }

  assertScopeAccess(user, existingTukTuk.data);

  const nextState = {
    provinceId: payload.provinceId ?? existingTukTuk.data.provinceId,
    districtId: payload.districtId ?? existingTukTuk.data.districtId,
    stationId: payload.stationId ?? existingTukTuk.data.stationId,
    driverId: payload.driverId === undefined ? existingTukTuk.data.driverId : payload.driverId,
    deviceId: payload.deviceId === undefined ? existingTukTuk.data.deviceId : payload.deviceId,
  };

  assertScopeAccess(user, nextState);
  await validateTukTukRegion(nextState);

  if (nextState.driverId) {
    const driver = await getDriverOrThrow(nextState.driverId);
    ensureDriverMatchesRegion(driver, nextState);
  }

  if (nextState.deviceId) {
    await ensureDeviceAvailability(nextState.deviceId, existingTukTuk.data.id);
  }

  return tukTuksRepository.update(id, payload);
};
