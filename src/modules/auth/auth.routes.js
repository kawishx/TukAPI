import { Router } from 'express';

import * as authController from './auth.controller.js';
import {
  authenticate,
} from '../../middlewares/authenticate.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import {
  loginRequestSchema,
} from './auth.validation.js';

const router = Router();

router.post('/login', validateRequest({ body: loginRequestSchema }), asyncHandler(authController.login));
router.get('/me', authenticate, asyncHandler(authController.getCurrentUser));

export default router;

