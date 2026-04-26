import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export const authenticate = (req, _res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token is required.'));
  }

  const token = authorizationHeader.replace('Bearer ', '').trim();

  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
    return next();
  } catch (_error) {
    return next(new ApiError(401, 'Invalid or expired authentication token.'));
  }
};

