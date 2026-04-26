import { Router } from 'express';

import * as usersController from './users.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { ALL_USER_ROLES, USER_ADMIN_ROLES } from '../../utils/constants.js';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  userListQuerySchema,
} from './users.validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  authorize(...ALL_USER_ROLES),
  validateRequest({ query: userListQuerySchema }),
  asyncHandler(usersController.listUsers),
);
router.get(
  '/:id',
  authorize(...ALL_USER_ROLES),
  validateRequest({ params: userIdSchema }),
  asyncHandler(usersController.getUserById),
);
router.post(
  '/',
  authorize(...USER_ADMIN_ROLES),
  validateRequest({ body: createUserSchema }),
  asyncHandler(usersController.createUser),
);
router.patch(
  '/:id',
  authorize(...USER_ADMIN_ROLES),
  validateRequest({ params: userIdSchema, body: updateUserSchema }),
  asyncHandler(usersController.updateUser),
);

export default router;

