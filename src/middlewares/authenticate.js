import prisma from '../config/prisma.js';
import { verifyAccessToken } from '../modules/auth/auth.tokens.js';
import { ApiError } from '../utils/apiError.js';

export const authenticateUser = async (req, _res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token is required.'));
  }

  const token = authorizationHeader.replace('Bearer ', '').trim();

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        role: true,
        provinceId: true,
        districtId: true,
        stationId: true,
        isActive: true,
      },
    });

    if (!user?.isActive) {
      throw new ApiError(401, 'Invalid or expired authentication token.');
    }

    req.user = {
      userId: user.id,
      role: user.role,
      provinceId: user.provinceId,
      districtId: user.districtId,
      stationId: user.stationId,
    };

    return next();
  } catch (_error) {
    return next(new ApiError(401, 'Invalid or expired authentication token.'));
  }
};

export const authenticate = authenticateUser;
