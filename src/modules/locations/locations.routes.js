import { Router } from 'express';

import * as locationsController from './locations.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticateUser } from '../../middlewares/authenticate.js';
import { authenticateDevice } from '../../middlewares/authenticateDevice.js';
import { authorizeRoles } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { HUMAN_USER_ROLES } from '../../utils/constants.js';
import {
  liveLocationQuerySchema,
  locationHistoryQuerySchema,
  locationPingSchema,
  liveLocationParamSchema,
} from './locations.validation.js';

const router = Router();

router.post(
  '/pings',
  validateRequest({ body: locationPingSchema }),
  asyncHandler(authenticateDevice),
  asyncHandler(locationsController.createLocationPing),
);
router.post(
  '/ping',
  validateRequest({ body: locationPingSchema }),
  asyncHandler(authenticateDevice),
  asyncHandler(locationsController.createLocationPing),
);
router.get(
  '/live',
  asyncHandler(authenticateUser),
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ query: liveLocationQuerySchema }),
  asyncHandler(locationsController.listLiveLocations),
);
router.get(
  '/live/:tukTukId',
  asyncHandler(authenticateUser),
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ params: liveLocationParamSchema }),
  asyncHandler(locationsController.getLiveLocation),
);
router.get(
  '/history',
  asyncHandler(authenticateUser),
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ query: locationHistoryQuerySchema }),
  asyncHandler(locationsController.getLocationHistory),
);

export default router;
