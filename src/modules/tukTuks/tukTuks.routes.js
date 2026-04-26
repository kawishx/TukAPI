import { Router } from 'express';

import * as tukTuksController from './tukTuks.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { ALL_USER_ROLES, WRITE_ACCESS_ROLES } from '../../utils/constants.js';
import {
  createTukTukSchema,
  tukTukIdSchema,
  tukTukListQuerySchema,
  updateTukTukSchema,
} from './tukTuks.validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize(...ALL_USER_ROLES),
  validateRequest({ query: tukTukListQuerySchema }),
  asyncHandler(tukTuksController.listTukTuks),
);
router.get(
  '/:id',
  authorize(...ALL_USER_ROLES),
  validateRequest({ params: tukTukIdSchema }),
  asyncHandler(tukTuksController.getTukTukById),
);
router.post(
  '/',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ body: createTukTukSchema }),
  asyncHandler(tukTuksController.createTukTuk),
);
router.patch(
  '/:id',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ params: tukTukIdSchema, body: updateTukTukSchema }),
  asyncHandler(tukTuksController.updateTukTuk),
);

export default router;

