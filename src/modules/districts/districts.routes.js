import { Router } from 'express';

import * as districtsController from './districts.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticateUser } from '../../middlewares/authenticate.js';
import { authorizeRoles } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { HUMAN_USER_ROLES } from '../../utils/constants.js';
import { districtIdSchema, districtListQuerySchema } from './districts.validation.js';

const router = Router();

router.use(asyncHandler(authenticateUser));

router.get(
  '/',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ query: districtListQuerySchema }),
  asyncHandler(districtsController.listDistricts),
);
router.get(
  '/:id',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ params: districtIdSchema }),
  asyncHandler(districtsController.getDistrictById),
);

export default router;
