import { Router } from 'express';

import * as provincesController from './provinces.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { ALL_USER_ROLES, WRITE_ACCESS_ROLES } from '../../utils/constants.js';
import {
  createProvinceSchema,
  provinceIdSchema,
  provinceListQuerySchema,
  updateProvinceSchema,
} from './provinces.validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize(...ALL_USER_ROLES),
  validateRequest({ query: provinceListQuerySchema }),
  asyncHandler(provincesController.listProvinces),
);
router.get(
  '/:id',
  authorize(...ALL_USER_ROLES),
  validateRequest({ params: provinceIdSchema }),
  asyncHandler(provincesController.getProvinceById),
);
router.post(
  '/',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ body: createProvinceSchema }),
  asyncHandler(provincesController.createProvince),
);
router.patch(
  '/:id',
  authorize(...WRITE_ACCESS_ROLES),
  validateRequest({ params: provinceIdSchema, body: updateProvinceSchema }),
  asyncHandler(provincesController.updateProvince),
);

export default router;

