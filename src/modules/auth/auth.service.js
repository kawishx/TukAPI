import * as authRepository from './auth.repository.js';
import { ApiError } from '../../utils/apiError.js';

export const login = async (credentials) => {
  await authRepository.findUserByEmail(credentials.email);

  throw new ApiError(
    501,
    'Login flow is scaffolded but not implemented yet. Add password hashing and database-backed credential verification next.',
  );
};

export const getCurrentUser = async (user) => ({
  ...user,
  permissions: ['scaffold:read'],
});

