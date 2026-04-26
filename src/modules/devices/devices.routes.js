import { Router } from 'express';

import * as devicesController from './devices.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { ALL_USER_ROLES, WRITE_ACCESS_ROLES } from '../../utils/constants.js';
import {
  createDeviceSchema,
  deviceIdSchema,
  deviceListQuerySchema,
  updateDeviceSchema,
} from './devices.validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize(...ALL_USER_ROLES),
  validateRequest({ query: deviceListQuerySchema }),
  asyncHandler(devicesController.listDevices),
);
router.get(
  '/:id',
  authorize(...ALL_USER_ROLES),
  validateRequest({ params: deviceIdSchema }),
  asyncHandler(devicesController.getDeviceById),
);
router.post(
  '/',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ body: createDeviceSchema }),
  asyncHandler(devicesController.createDevice),
);
router.patch(
  '/:id',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ params: deviceIdSchema, body: updateDeviceSchema }),
  asyncHandler(devicesController.updateDevice),
);

export default router;

