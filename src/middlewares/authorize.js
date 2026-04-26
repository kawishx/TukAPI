import { ApiError } from '../utils/apiError.js';

export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication is required before authorization.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You are not authorized to access this resource.'));
    }

    return next();
  };

