import { Router } from 'express';

import * as authController from './auth.controller.js';
import { authenticateUser } from '../../middlewares/authenticate.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { authRateLimit } from '../../config/rateLimit.js';
import { loginRequestSchema, logoutRequestSchema, refreshRequestSchema } from './auth.validation.js';

const router = Router();

router.use(authRateLimit);

router.post('/login', validateRequest({ body: loginRequestSchema }), asyncHandler(authController.login));
router.post('/refresh', validateRequest({ body: refreshRequestSchema }), asyncHandler(authController.refresh));
router.post('/logout', validateRequest({ body: logoutRequestSchema }), asyncHandler(authController.logout));
router.get('/me', authenticateUser, asyncHandler(authController.getCurrentUser));

export default router;
