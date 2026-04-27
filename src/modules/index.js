import { Router } from 'express';

import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { checkDatabaseHealth } from '../config/prisma.js';
import authRoutes from './auth/auth.routes.js';
import deviceRoutes from './devices/devices.routes.js';
import districtRoutes from './districts/districts.routes.js';
import driverRoutes from './drivers/drivers.routes.js';
import locationRoutes from './locations/locations.routes.js';
import provinceRoutes from './provinces/provinces.routes.js';
import stationRoutes from './stations/stations.routes.js';
import tukTukRoutes from './tukTuks/tukTuks.routes.js';
import userRoutes from './users/users.routes.js';

const router = Router();
const serviceStartedAt = new Date();

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    try {
      await checkDatabaseHealth();
    } catch (_error) {
      throw new ApiError(503, 'Database connectivity check failed.');
    }

    return sendSuccess(res, {
      message: 'Service is healthy.',
      data: {
        status: 'ok',
        service: 'TukAPI',
        startedAt: serviceStartedAt.toISOString(),
        uptimeSeconds: Math.round(process.uptime()),
        database: 'connected',
      },
    });
  }),
);

router.get('/health/ready', asyncHandler(async (_req, res) => {
  try {
    await checkDatabaseHealth();
  } catch (_error) {
    throw new ApiError(503, 'Database connectivity check failed.');
  }

  return sendSuccess(res, {
    message: 'Service is healthy.',
    data: {
      status: 'ok',
      service: 'TukAPI',
      startedAt: serviceStartedAt.toISOString(),
      database: 'connected',
    },
  });
}));

router.use('/auth', authRoutes);
router.use('/provinces', provinceRoutes);
router.use('/districts', districtRoutes);
router.use('/stations', stationRoutes);
router.use('/tuk-tuks', tukTukRoutes);
router.use('/drivers', driverRoutes);
router.use('/devices', deviceRoutes);
router.use('/locations', locationRoutes);
router.use('/users', userRoutes);

export default router;
