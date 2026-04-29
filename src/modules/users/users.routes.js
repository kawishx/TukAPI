import { Router } from 'express';

import * as usersController from './users.controller.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { authenticateUser } from '../../middlewares/authenticate.js';
import { authorizeRoles } from '../../middlewares/authorize.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { HUMAN_USER_ROLES, USER_ADMIN_ROLES } from '../../utils/constants.js';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  userListQuerySchema,
} from './users.validation.js';

const router = Router();

router.use(asyncHandler(authenticateUser));

router.get(
  '/',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ query: userListQuerySchema }),
  asyncHandler(usersController.listUsers),
);
router.get(
  '/:id',
  authorizeRoles(...HUMAN_USER_ROLES),
  validateRequest({ params: userIdSchema }),
  asyncHandler(usersController.getUserById),
);
router.post(
  '/',
  authorizeRoles(...USER_ADMIN_ROLES),
  validateRequest({ body: createUserSchema }),
  asyncHandler(usersController.createUser),
);
router.patch(
  '/:id',
  authorizeRoles(...USER_ADMIN_ROLES),
  validateRequest({ params: userIdSchema, body: updateUserSchema }),
  asyncHandler(usersController.updateUser),
);

export default router;
