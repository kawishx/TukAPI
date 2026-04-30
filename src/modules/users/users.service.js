import * as usersRepository from './users.repository.js';
import { assertScopeAccess, buildScopeWhere } from '../../utils/accessScope.js';
import { ApiError } from '../../utils/apiError.js';
import { buildListOptions, buildPaginationMeta } from '../../utils/queryOptions.js';
import { hashPassword } from '../../utils/password.js';
import {
  ensureDistrictBelongsToProvince,
  ensureStationMatchesRegion,
  ensureUserRoleScope,
  getDistrictOrThrow,
  getProvinceOrThrow,
  getStationOrThrow,
} from '../../utils/regionValidation.js';

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { passwordHash, refreshTokenHash, ...safeUser } = user;
  return safeUser;
};

const validateUserScopeManagement = (actor, targetRole, targetScope) => {
  if (actor.role === 'PROVINCIAL_ADMIN') {
    if (targetRole === 'HQ_ADMIN' || targetRole === 'PROVINCIAL_ADMIN') {
      throw new ApiError(403, 'Provincial administrators cannot create or manage admin users above district level.');
    }

    if (targetScope.provinceId !== actor.provinceId) {
      throw new ApiError(403, 'You are not authorized to manage users outside your province.');
    }
  }
};

const validateUserRegionRelationships = async ({ provinceId, districtId, stationId, role }) => {
  ensureUserRoleScope({ role, provinceId, districtId, stationId });

  if (provinceId) {
    await getProvinceOrThrow(provinceId);
  }

  if (districtId) {
    const district = await getDistrictOrThrow(districtId);
    if (provinceId) {
      ensureDistrictBelongsToProvince(district, provinceId);
    }
  }

  if (stationId) {
    const station = await getStationOrThrow(stationId);
    ensureStationMatchesRegion(station, {
      provinceId,
      districtId,
    });
  }
};

export const listUsers = async (query, user) => {
  const options = buildListOptions(query, {
    sorting: {
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  });
  const result = await usersRepository.findMany(options, buildScopeWhere(user));

  return {
    items: result.items.map(sanitizeUser),
    meta: buildPaginationMeta({
      page: options.page,
      limit: options.limit,
      totalItems: result.totalItems,
    }),
    lastModified: result.lastModified,
  };
};

export const getUserById = async (id, user) => {
  const result = await usersRepository.findById(id);

  if (!result.data) {
    throw new ApiError(404, 'Authorized user not found.');
  }

  assertScopeAccess(user, result.data);

  return {
    data: sanitizeUser(result.data),
    lastModified: result.lastModified,
  };
};

export const createUser = async (payload, actor) => {
  const targetScope = {
    provinceId: payload.provinceId ?? null,
    districtId: payload.districtId ?? null,
    stationId: payload.stationId ?? null,
  };

  validateUserScopeManagement(actor, payload.role, targetScope);
  assertScopeAccess(actor, targetScope);
  await validateUserRegionRelationships({
    provinceId: payload.provinceId ?? null,
    districtId: payload.districtId ?? null,
    stationId: payload.stationId ?? null,
    role: payload.role,
  });

  const createdUser = await usersRepository.create({
    fullName: payload.fullName,
    email: payload.email,
    badgeNumber: payload.badgeNumber ?? null,
    passwordHash: await hashPassword(payload.password),
    role: payload.role,
    phoneNumber: payload.phoneNumber ?? null,
    isActive: payload.isActive ?? true,
    provinceId: payload.provinceId ?? null,
    districtId: payload.districtId ?? null,
    stationId: payload.stationId ?? null,
  });

  return sanitizeUser(createdUser);
};

export const updateUser = async (id, payload, actor) => {
  const existingUser = await usersRepository.findById(id);

  if (!existingUser.data) {
    throw new ApiError(404, 'Authorized user not found.');
  }

  assertScopeAccess(actor, existingUser.data);

  const nextState = {
    role: payload.role ?? existingUser.data.role,
    provinceId: payload.provinceId ?? existingUser.data.provinceId ?? null,
    districtId: payload.districtId ?? existingUser.data.districtId ?? null,
    stationId: payload.stationId ?? existingUser.data.stationId ?? null,
  };

  validateUserScopeManagement(actor, nextState.role, nextState);
  assertScopeAccess(actor, nextState);
  await validateUserRegionRelationships(nextState);

  const updatedUser = await usersRepository.update(id, {
    fullName: payload.fullName,
    email: payload.email,
    badgeNumber: payload.badgeNumber,
    role: payload.role,
    phoneNumber: payload.phoneNumber,
    isActive: payload.isActive,
    provinceId: payload.provinceId,
    districtId: payload.districtId,
    stationId: payload.stationId,
    ...(payload.password ? { passwordHash: await hashPassword(payload.password) } : {}),
  });

  return sanitizeUser(updatedUser);
};
