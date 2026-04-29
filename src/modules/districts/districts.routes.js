import { Router } from 'express';

import * as districtsController from './districts.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticateUser } from '../../middlewares/authenticate.js';
import { authorizeRoles } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { HUMAN_USER_ROLES, WRITE_ACCESS_ROLES } from '../../utils/constants.js';
import {
  createDistrictSchema,
  districtIdSchema,
  districtListQuerySchema,
  updateDistrictSchema,
} from './districts.validation.js';

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
router.post(
  '/',
  authorizeRoles(...WRITE_ACCESS_ROLES),
  validateRequest({ body: createDistrictSchema }),
  asyncHandler(districtsController.createDistrict),
);
router.patch(
  '/:id',
  authorizeRoles(...WRITE_ACCESS_ROLES),
  validateRequest({ params: districtIdSchema, body: updateDistrictSchema }),
  asyncHandler(districtsController.updateDistrict),
);

export default router;
