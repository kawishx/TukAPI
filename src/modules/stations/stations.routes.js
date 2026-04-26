import { Router } from 'express';

import * as stationsController from './stations.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { ALL_USER_ROLES, WRITE_ACCESS_ROLES } from '../../utils/constants.js';
import {
  createStationSchema,
  stationIdSchema,
  stationListQuerySchema,
  updateStationSchema,
} from './stations.validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize(...ALL_USER_ROLES),
  validateRequest({ query: stationListQuerySchema }),
  asyncHandler(stationsController.listStations),
);
router.get(
  '/:id',
  authorize(...ALL_USER_ROLES),
  validateRequest({ params: stationIdSchema }),
  asyncHandler(stationsController.getStationById),
);
router.post(
  '/',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ body: createStationSchema }),
  asyncHandler(stationsController.createStation),
);
router.patch(
  '/:id',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ params: stationIdSchema, body: updateStationSchema }),
  asyncHandler(stationsController.updateStation),
);

export default router;

