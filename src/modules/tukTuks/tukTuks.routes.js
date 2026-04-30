import { Router } from 'express';

import * as tukTuksController from './tukTuks.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticateUser } from '../../middlewares/authenticate.js';
import { authorizeRoles } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { HUMAN_USER_ROLES, WRITE_ACCESS_ROLES } from '../../utils/constants.js';
import {
  createTukTukSchema,
  tukTukIdSchema,
  tukTukLocationHistoryQuerySchema,
  tukTukListQuerySchema,
  updateTukTukSchema,
} from './tukTuks.validation.js';

const router = Router();

router.use(asyncHandler(authenticateUser));

router.get(
  '/',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ query: tukTukListQuerySchema }),
  asyncHandler(tukTuksController.listTukTuks),
);
router.get(
  '/:id/location-history',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ params: tukTukIdSchema, query: tukTukLocationHistoryQuerySchema }),
  asyncHandler(tukTuksController.getTukTukLocationHistory),
);
router.get(
  '/:id',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ params: tukTukIdSchema }),
  asyncHandler(tukTuksController.getTukTukById),
);
router.post(
  '/',
  authorizeRoles(...WRITE_ACCESS_ROLES),
  validateRequest({ body: createTukTukSchema }),
  asyncHandler(tukTuksController.createTukTuk),
);
router.patch(
  '/:id',
  authorizeRoles(...WRITE_ACCESS_ROLES),
  validateRequest({ params: tukTukIdSchema, body: updateTukTukSchema }),
  asyncHandler(tukTuksController.updateTukTuk),
);

export default router;
