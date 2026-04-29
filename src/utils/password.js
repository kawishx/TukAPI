import bcrypt from 'bcrypt';

import { env } from '../config/env.js';

export const hashPassword = async (password) => bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

export const comparePassword = async (password, passwordHash) => bcrypt.compare(password, passwordHash);

