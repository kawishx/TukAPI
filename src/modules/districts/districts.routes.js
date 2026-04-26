import { Router } from 'express';

import * as districtsController from './districts.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { ALL_USER_ROLES, WRITE_ACCESS_ROLES } from '../../utils/constants.js';
import {
  createDistrictSchema,
  districtIdSchema,
  districtListQuerySchema,
  updateDistrictSchema,
} from './districts.validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize(...ALL_USER_ROLES),
  validateRequest({ query: districtListQuerySchema }),
  asyncHandler(districtsController.listDistricts),
);
router.get(
  '/:id',
  authorize(...ALL_USER_ROLES),
  validateRequest({ params: districtIdSchema }),
  asyncHandler(districtsController.getDistrictById),
);
router.post(
  '/',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ body: createDistrictSchema }),
  asyncHandler(districtsController.createDistrict),
);
router.patch(
  '/:id',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ params: districtIdSchema, body: updateDistrictSchema }),
  asyncHandler(districtsController.updateDistrict),
);

export default router;

