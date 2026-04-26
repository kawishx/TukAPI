import { Router } from 'express';

import authRoutes from './auth/auth.routes.js';
import deviceRoutes from './devices/devices.routes.js';
import districtRoutes from './districts/districts.routes.js';
import driverRoutes from './drivers/drivers.routes.js';
import locationRoutes from './locations/locations.routes.js';
import provinceRoutes from './provinces/provinces.routes.js';
import stationRoutes from './stations/stations.routes.js';
import tukTukRoutes from './tukTuks/tukTuks.routes.js';
import userRoutes from './users/users.routes.js';
import { sendCachedSuccess } from '../utils/apiResponse.js';

const router = Router();
const serviceStartedAt = new Date().toISOString();

router.get('/health', (req, res) => {
  sendCachedSuccess(req, res, {
    message: 'Service is healthy.',
    data: {
      status: 'ok',
      service: 'TukAPI',
      startedAt: serviceStartedAt,
    },
    lastModified: serviceStartedAt,
  });
});

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
