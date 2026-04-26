import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const login = async (req, res) => {
  const result = await authService.login(req.body);

  return sendSuccess(res, {
    statusCode: 200,
    message: result.message,
    data: result.data,
  });
};

export const getCurrentUser = async (req, res) => {
  const result = await authService.getCurrentUser(req.user);

  return sendSuccess(res, {
    message: 'Authenticated user resolved successfully.',
    data: result,
  });
};

