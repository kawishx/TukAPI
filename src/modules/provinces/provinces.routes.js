import { Router } from 'express';

import * as provincesController from './provinces.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticateUser } from '../../middlewares/authenticate.js';
import { authorizeRoles } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { HUMAN_USER_ROLES } from '../../utils/constants.js';
import { provinceIdSchema, provinceListQuerySchema } from './provinces.validation.js';

const router = Router();

router.use(asyncHandler(authenticateUser));

router.get(
  '/',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ query: provinceListQuerySchema }),
  asyncHandler(provincesController.listProvinces),
);
router.get(
  '/:id',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ params: provinceIdSchema }),
  asyncHandler(provincesController.getProvinceById),
);

export default router;
