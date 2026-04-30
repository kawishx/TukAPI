import prisma from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { recordAuditEvent } from '../utils/auditLogger.js';
import { hashOpaqueToken } from '../modules/auth/auth.tokens.js';

const DEVICE_TOKEN_HEADER = 'x-device-token';

export const authenticateDevice = async (req, _res, next) => {
  const rawToken = req.headers[DEVICE_TOKEN_HEADER];
  const deviceToken = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  const { deviceId } = req.body ?? {};

  if (!deviceToken || !deviceId) {
    await recordAuditEvent({
      actorType: 'DEVICE',
      actorDeviceId: deviceId ?? null,
      action: 'DEVICE_AUTH_FAILURE',
      entityName: 'LocationPing',
      httpMethod: req.method,
      requestPath: req.originalUrl,
      statusCode: 401,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      metadata: {
        reason: 'missing_device_token_or_device_id',
      },
    });

    return next(new ApiError(401, 'Invalid device credentials.'));
  }

  const tokenHash = hashOpaqueToken(deviceToken);
  const device = await prisma.trackingDevice.findFirst({
    where: {
      id: deviceId,
      authTokenHash: tokenHash,
      status: 'ACTIVE',
    },
    include: {
      assignedTukTuk: {
        select: {
          id: true,
          provinceId: true,
          districtId: true,
          stationId: true,
          status: true,
        },
      },
    },
  });

  if (!device) {
    await recordAuditEvent({
      actorType: 'DEVICE',
      actorDeviceId: deviceId,
      action: 'DEVICE_AUTH_FAILURE',
      entityName: 'LocationPing',
      entityId: deviceId,
      httpMethod: req.method,
      requestPath: req.originalUrl,
      statusCode: 401,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      metadata: {
        reason: 'invalid_device_token',
      },
    });

    return next(new ApiError(401, 'Invalid device credentials.'));
  }

  req.device = device;
  return next();
};
