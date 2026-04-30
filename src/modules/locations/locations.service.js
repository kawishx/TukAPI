import { buildScopeWhere } from '../../utils/accessScope.js';
import { ApiError } from '../../utils/apiError.js';
import { recordAuditEvent } from '../../utils/auditLogger.js';
import * as locationsRepository from './locations.repository.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

const MAX_FUTURE_PING_MS = 5 * 60 * 1000;
const scopeFieldMap = {
  provinceField: 'provinceId',
  districtField: 'districtId',
  stationField: 'stationId',
};

const buildLocationScopeWhere = (user) => buildScopeWhere(user, scopeFieldMap);

const validateHistoryWindow = (filters) => {
  if (!filters.from || !filters.to) {
    return;
  }

  if (new Date(filters.from).getTime() > new Date(filters.to).getTime()) {
    throw new ApiError(422, 'The requested time window is invalid.');
  }
};

const ensureDevicePingAuthorization = async (payload, device, requestContext) => {
  if (!device?.assignedTukTuk || device.id !== payload.deviceId || device.assignedTukTuk.id !== payload.tukTukId) {
    await recordAuditEvent({
      actorType: 'DEVICE',
      actorDeviceId: payload.deviceId,
      provinceId: payload.provinceId,
      districtId: payload.districtId,
      stationId: payload.stationId,
      action: 'DEVICE_AUTH_FAILURE',
      entityName: 'LocationPing',
      entityId: payload.tukTukId,
      httpMethod: requestContext.method,
      requestPath: requestContext.path,
      statusCode: 403,
      ipAddress: requestContext.ip,
      userAgent: requestContext.userAgent,
      metadata: {
        reason: 'device_tuk_tuk_assignment_mismatch',
      },
    });

    throw new ApiError(403, 'Device is not authorized for this tuk-tuk.');
  }

  if (payload.provinceId !== device.assignedTukTuk.provinceId || payload.districtId !== device.assignedTukTuk.districtId) {
    throw new ApiError(422, 'Location ping region does not match the assigned tuk-tuk.');
  }

  if ((payload.stationId ?? null) !== (device.assignedTukTuk.stationId ?? null)) {
    throw new ApiError(422, 'Location ping station does not match the assigned tuk-tuk.');
  }
};

const validateRecordedAt = (recordedAt) => {
  const recordedAtDate = new Date(recordedAt);
  const now = Date.now();

  if (recordedAtDate.getTime() > now + MAX_FUTURE_PING_MS) {
    throw new ApiError(422, 'Location ping timestamp is too far in the future.');
  }

  return recordedAtDate;
};

const mapListResult = (options, result) => ({
  items: result.items,
  meta: buildPaginationMeta({
    page: options.page,
    limit: options.limit,
    totalItems: result.totalItems,
  }),
  lastModified: result.lastModified,
});

export const createLocationPing = async (payload, device, requestContext) => {
  await ensureDevicePingAuthorization(payload, device, requestContext);
  validateRecordedAt(payload.recordedAt);

  return locationsRepository.create(payload, device.id);
};

export const listLiveLocations = async (query, user) => {
  const options = buildListOptions(query, {
    sorting: {
      sortBy: 'recordedAt',
      sortOrder: 'desc',
    },
  });
  const result = await locationsRepository.findLive(options, buildLocationScopeWhere(user));

  return mapListResult(options, result);
};

export const getLiveLocation = async (tukTukId, user) => {
  const result = await locationsRepository.findLatestByTukTukId(tukTukId, buildLocationScopeWhere(user));

  if (!result.data) {
    throw new ApiError(404, 'Current live location not found for this tuk-tuk.');
  }

  return result;
};

export const getLocationHistory = async (query, user) => {
  const options = buildListOptions(query, {
    sorting: {
      sortBy: 'recordedAt',
      sortOrder: 'desc',
    },
  });

  validateHistoryWindow(options.filters);

  const result = await locationsRepository.findHistory(options, buildLocationScopeWhere(user));

  return mapListResult(options, result);
};
