import { signAccessToken } from '../../modules/auth/auth.tokens.js';
import { getMockState } from './mockPrisma.js';

export const getUserByEmail = (email) => getMockState().users.find((user) => user.email === email);

export const createAccessTokenForUser = (email) => {
  const user = getUserByEmail(email);

  if (!user) {
    throw new Error(`Unknown test user: ${email}`);
  }

  return signAccessToken(user);
};

export const buildBearerHeader = (email) => `Bearer ${createAccessTokenForUser(email)}`;

export const getDeviceToken = (deviceId) => {
  const deviceTokens = {
    'dev-1': 'device-token-001',
    'dev-2': 'device-token-002',
    'dev-3': 'device-token-003',
  };

  return deviceTokens[deviceId];
};
