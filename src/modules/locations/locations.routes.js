import { Router } from 'express';

import * as locationsController from './locations.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { ALL_USER_ROLES, WRITE_ACCESS_ROLES } from '../../utils/constants.js';
import {
  locationHistoryQuerySchema,
  locationPingSchema,
  liveLocationParamSchema,
} from './locations.validation.js';

const router = Router();

router.use(authenticate);

router.post(
  '/ping',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ body: locationPingSchema }),
  asyncHandler(locationsController.createLocationPing),
);
router.get(
  '/live/:tukTukId',
  authorize(...ALL_USER_ROLES),
  validateRequest({ params: liveLocationParamSchema }),
  asyncHandler(locationsController.getLiveLocation),
);
router.get(
  '/history',
  authorize(...ALL_USER_ROLES),
  validateRequest({ query: locationHistoryQuerySchema }),
  asyncHandler(locationsController.getLocationHistory),
);

export default router;

