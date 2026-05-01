import { buildBearerHeader, getDeviceToken } from './testAuth.js';

export const asUser = (requestBuilder, email) =>
  requestBuilder.set('Authorization', buildBearerHeader(email));

export const asDevice = (requestBuilder, deviceId) =>
  requestBuilder.set('X-Device-Token', getDeviceToken(deviceId));
