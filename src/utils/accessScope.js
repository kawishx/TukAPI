import { ApiError } from './apiError.js';
import { USER_ROLES } from './constants.js';

const resolveScopedField = (user, fieldMap) => {
  switch (user.role) {
    case USER_ROLES.HQ_ADMIN:
      return null;
    case USER_ROLES.PROVINCIAL_ADMIN:
      return fieldMap.provinceField && user.provinceId
        ? { [fieldMap.provinceField]: user.provinceId }
        : null;
    case USER_ROLES.DISTRICT_OFFICER:
      if (fieldMap.districtField && user.districtId) {
        return { [fieldMap.districtField]: user.districtId };
      }
      if (fieldMap.provinceField && user.provinceId) {
        return { [fieldMap.provinceField]: user.provinceId };
      }
      return null;
    case USER_ROLES.STATION_OFFICER:
      if (fieldMap.stationField && user.stationId) {
        return { [fieldMap.stationField]: user.stationId };
      }
      if (fieldMap.districtField && user.districtId) {
        return { [fieldMap.districtField]: user.districtId };
      }
      if (fieldMap.provinceField && user.provinceId) {
        return { [fieldMap.provinceField]: user.provinceId };
      }
      return null;
    default:
      throw new ApiError(403, 'You are not authorized to access this resource.');
  }
};

export const buildScopeContext = (user) => ({
  role: user.role,
  provinceId: user.provinceId ?? null,
  districtId: user.districtId ?? null,
  stationId: user.stationId ?? null,
});

export const buildScopeWhere = (
  user,
  fieldMap = {
    provinceField: 'provinceId',
    districtField: 'districtId',
    stationField: 'stationId',
  },
) => resolveScopedField(user, fieldMap) ?? {};

export const assertScopeAccess = (
  user,
  resource,
  fieldMap = {
    provinceField: 'provinceId',
    districtField: 'districtId',
    stationField: 'stationId',
  },
) => {
  if (!resource || user.role === USER_ROLES.HQ_ADMIN) {
    return;
  }

  if (user.role === USER_ROLES.PROVINCIAL_ADMIN && resource[fieldMap.provinceField] !== user.provinceId) {
    throw new ApiError(403, 'You are not authorized to access this resource.');
  }

  if (user.role === USER_ROLES.DISTRICT_OFFICER) {
    const districtValue = resource[fieldMap.districtField];
    const provinceValue = resource[fieldMap.provinceField];

    if (districtValue && districtValue !== user.districtId) {
      throw new ApiError(403, 'You are not authorized to access this resource.');
    }

    if (!districtValue && provinceValue && provinceValue !== user.provinceId) {
      throw new ApiError(403, 'You are not authorized to access this resource.');
    }
  }

  if (user.role === USER_ROLES.STATION_OFFICER) {
    const stationValue = resource[fieldMap.stationField];
    const districtValue = resource[fieldMap.districtField];
    const provinceValue = resource[fieldMap.provinceField];

    if (stationValue && stationValue !== user.stationId) {
      throw new ApiError(403, 'You are not authorized to access this resource.');
    }

    if (!stationValue && districtValue && districtValue !== user.districtId) {
      throw new ApiError(403, 'You are not authorized to access this resource.');
    }

    if (!stationValue && !districtValue && provinceValue && provinceValue !== user.provinceId) {
      throw new ApiError(403, 'You are not authorized to access this resource.');
    }
  }
};

