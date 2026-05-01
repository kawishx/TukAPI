import * as authRepository from './auth.repository.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/apiError.js';
import { comparePassword } from '../../utils/password.js';
import { recordAuditEvent } from '../../utils/auditLogger.js';
import { USER_ROLES } from '../../utils/constants.js';
import {
  hashOpaqueToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './auth.tokens.js';

const toSafeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  badgeNumber: user.badgeNumber,
  role: user.role,
  provinceId: user.provinceId,
  districtId: user.districtId,
  stationId: user.stationId,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildAuthResponse = async (user, options = {}) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshTokenHash = hashOpaqueToken(refreshToken);

  if (options.updateLoginState) {
    await authRepository.updateUserSession(user.id, refreshTokenHash);
  } else {
    await authRepository.rotateRefreshToken(user.id, refreshTokenHash);
  }

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshTokenExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    tokenType: 'Bearer',
    user: toSafeUser(user),
  };
};

export const login = async (credentials, requestContext) => {
  const user = await authRepository.findUserByEmail(credentials.email);

  if (!user || !user.isActive || user.role === USER_ROLES.DEVICE_CLIENT) {
    await recordAuditEvent({
      actorType: 'SYSTEM',
      action: 'AUTH_LOGIN_FAILURE',
      entityName: 'User',
      httpMethod: requestContext.method,
      requestPath: requestContext.path,
      statusCode: 401,
      ipAddress: requestContext.ip,
      userAgent: requestContext.userAgent,
      metadata: {
        email: credentials.email,
      },
    });

    throw new ApiError(401, 'Invalid credentials.');
  }

  const isPasswordValid = await comparePassword(credentials.password, user.passwordHash);

  if (!isPasswordValid) {
    await recordAuditEvent({
      actorType: 'USER',
      actorUserId: user.id,
      provinceId: user.provinceId,
      districtId: user.districtId,
      stationId: user.stationId,
      action: 'AUTH_LOGIN_FAILURE',
      entityName: 'User',
      entityId: user.id,
      httpMethod: requestContext.method,
      requestPath: requestContext.path,
      statusCode: 401,
      ipAddress: requestContext.ip,
      userAgent: requestContext.userAgent,
    });

    throw new ApiError(401, 'Invalid credentials.');
  }

  const data = await buildAuthResponse(user, {
    updateLoginState: true,
  });

  await recordAuditEvent({
    actorType: 'USER',
    actorUserId: user.id,
    provinceId: user.provinceId,
    districtId: user.districtId,
    stationId: user.stationId,
    action: 'AUTH_LOGIN_SUCCESS',
    entityName: 'User',
    entityId: user.id,
    httpMethod: requestContext.method,
    requestPath: requestContext.path,
    statusCode: 200,
    ipAddress: requestContext.ip,
    userAgent: requestContext.userAgent,
  });

  return {
    message: 'Login successful.',
    data,
  };
};

export const refresh = async ({ refreshToken }, requestContext) => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, 'Invalid refresh token.');
  }

  const user = await authRepository.findUserById(payload.userId);

  if (!user || !user.isActive || user.refreshTokenHash !== hashOpaqueToken(refreshToken)) {
    throw new ApiError(401, 'Invalid refresh token.');
  }

  const data = await buildAuthResponse(user);

  await recordAuditEvent({
    actorType: 'USER',
    actorUserId: user.id,
    provinceId: user.provinceId,
    districtId: user.districtId,
    stationId: user.stationId,
    action: 'AUTH_REFRESH',
    entityName: 'User',
    entityId: user.id,
    httpMethod: requestContext.method,
    requestPath: requestContext.path,
    statusCode: 200,
    ipAddress: requestContext.ip,
    userAgent: requestContext.userAgent,
  });

  return {
    message: 'Token refreshed successfully.',
    data,
  };
};

export const logout = async ({ refreshToken }, requestContext) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await authRepository.findUserById(payload.userId);

    if (user && user.refreshTokenHash === hashOpaqueToken(refreshToken)) {
      await authRepository.clearRefreshToken(user.id);

      await recordAuditEvent({
        actorType: 'USER',
        actorUserId: user.id,
        provinceId: user.provinceId,
        districtId: user.districtId,
        stationId: user.stationId,
        action: 'AUTH_LOGOUT',
        entityName: 'User',
        entityId: user.id,
        httpMethod: requestContext.method,
        requestPath: requestContext.path,
        statusCode: 200,
        ipAddress: requestContext.ip,
        userAgent: requestContext.userAgent,
      });
    }
  } catch {
    return {
      message: 'Logout successful.',
      data: null,
    };
  }

  return {
    message: 'Logout successful.',
    data: null,
  };
};

export const getCurrentUser = async (authUser) => {
  const user = await authRepository.findUserById(authUser.userId);

  if (!user || !user.isActive) {
    throw new ApiError(404, 'Authenticated user not found.');
  }

  return toSafeUser(user);
};
