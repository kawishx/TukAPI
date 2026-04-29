import prisma from '../config/prisma.js';
import { logger } from '../config/logger.js';

export const recordAuditEvent = async ({
  actorType,
  actorUserId,
  actorDeviceId,
  provinceId,
  districtId,
  stationId,
  action,
  entityName,
  entityId,
  httpMethod,
  requestPath,
  statusCode,
  ipAddress,
  userAgent,
  metadata,
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        actorType,
        actorUserId,
        actorDeviceId,
        provinceId,
        districtId,
        stationId,
        action,
        entityName,
        entityId,
        httpMethod,
        requestPath,
        statusCode,
        ipAddress,
        userAgent,
        metadata,
      },
    });
  } catch (error) {
    logger.warn({ err: error, action, entityName }, 'Audit log write failed');
  }
};

