import { buildScopeWhere } from '../../utils/accessScope.js';
import { ApiError } from '../../utils/apiError.js';
import { recordAuditEvent } from '../../utils/auditLogger.js';
import * as locationsRepository from './locations.repository.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';

export const createLocationPing = async (payload, device, requestContext) => {
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

  return locationsRepository.create(payload, device.id);
};

export const getLiveLocation = async (tukTukId, user) =>
  locationsRepository.findLatestByTukTukId(
    tukTukId,
    buildScopeWhere(user, {
      provinceField: 'provinceId',
      districtField: 'districtId',
      stationField: 'stationId',
    }),
  );

export const getLocationHistory = async (query, user) => {
  const options = buildListOptions(query);
  const result = await locationsRepository.findHistory(
    options,
    buildScopeWhere(user, {
      provinceField: 'provinceId',
      districtField: 'districtId',
      stationField: 'stationId',
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
