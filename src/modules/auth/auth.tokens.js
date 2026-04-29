import crypto from 'node:crypto';

import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';

export const buildTokenPayload = (user) => ({
  userId: user.id,
  role: user.role,
  provinceId: user.provinceId ?? null,
  districtId: user.districtId ?? null,
  stationId: user.stationId ?? null,
});

export const signAccessToken = (user) =>
  jwt.sign({ ...buildTokenPayload(user), tokenType: 'access' }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

export const signRefreshToken = (user) =>
  jwt.sign({ ...buildTokenPayload(user), tokenType: 'refresh' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

export const verifyAccessToken = (token) => {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

  if (payload.tokenType !== 'access') {
    throw new Error('Invalid access token type');
  }

  return payload;
};

export const verifyRefreshToken = (token) => {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);

  if (payload.tokenType !== 'refresh') {
    throw new Error('Invalid refresh token type');
  }

  return payload;
};

export const hashOpaqueToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const generateDeviceToken = () => crypto.randomBytes(32).toString('base64url');
