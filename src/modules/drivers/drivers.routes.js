import { Router } from 'express';

import * as driversController from './drivers.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { ALL_USER_ROLES, WRITE_ACCESS_ROLES } from '../../utils/constants.js';
import {
  createDriverSchema,
  driverIdSchema,
  driverListQuerySchema,
  updateDriverSchema,
} from './drivers.validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize(...ALL_USER_ROLES),
  validateRequest({ query: driverListQuerySchema }),
  asyncHandler(driversController.listDrivers),
);
router.get(
  '/:id',
  authorize(...ALL_USER_ROLES),
  validateRequest({ params: driverIdSchema }),
  asyncHandler(driversController.getDriverById),
);
router.post(
  '/',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ body: createDriverSchema }),
  asyncHandler(driversController.createDriver),
);
router.patch(
  '/:id',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ params: driverIdSchema, body: updateDriverSchema }),
  asyncHandler(driversController.updateDriver),
);

export default router;

