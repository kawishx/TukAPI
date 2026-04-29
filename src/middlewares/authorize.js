import { buildScopeContext } from '../utils/accessScope.js';
import { ApiError } from '../utils/apiError.js';
import { USER_ROLES } from '../utils/constants.js';

export const authorizeRoles =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication is required before authorization.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You are not authorized to access this resource.'));
    }

    if (req.user.role === USER_ROLES.DEVICE_CLIENT && !roles.includes(USER_ROLES.DEVICE_CLIENT)) {
      return next(new ApiError(403, 'You are not authorized to access this resource.'));
    }

    req.accessScope = buildScopeContext(req.user);

    return next();
  };

export const authorize = authorizeRoles;

