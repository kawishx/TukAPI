import { Router } from 'express';

import * as stationsController from './stations.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticateUser } from '../../middlewares/authenticate.js';
import { authorizeRoles } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { HUMAN_USER_ROLES, WRITE_ACCESS_ROLES } from '../../utils/constants.js';
import {
  createStationSchema,
  stationIdSchema,
  stationListQuerySchema,
  updateStationSchema,
} from './stations.validation.js';

const router = Router();

router.use(asyncHandler(authenticateUser));

router.get(
  '/',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ query: stationListQuerySchema }),
  asyncHandler(stationsController.listStations),
);
router.get(
  '/:id',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ params: stationIdSchema }),
  asyncHandler(stationsController.getStationById),
);
router.post(
  '/',
  authorizeRoles(...WRITE_ACCESS_ROLES),
  validateRequest({ body: createStationSchema }),
  asyncHandler(stationsController.createStation),
);
router.patch(
  '/:id',
  authorizeRoles(...WRITE_ACCESS_ROLES),
  validateRequest({ params: stationIdSchema, body: updateStationSchema }),
  asyncHandler(stationsController.updateStation),
);

export default router;
