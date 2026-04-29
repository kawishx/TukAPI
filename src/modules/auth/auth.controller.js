import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const login = async (req, res) => {
  const result = await authService.login(req.body, {
    ip: req.ip,
    path: req.originalUrl,
    method: req.method,
    userAgent: req.get('user-agent'),
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: result.message,
    data: result.data,
  });
};

export const refresh = async (req, res) => {
  const result = await authService.refresh(req.body, {
    ip: req.ip,
    path: req.originalUrl,
    method: req.method,
    userAgent: req.get('user-agent'),
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: result.message,
    data: result.data,
  });
};

export const logout = async (req, res) => {
  const result = await authService.logout(req.body, {
    ip: req.ip,
    path: req.originalUrl,
    method: req.method,
    userAgent: req.get('user-agent'),
  });

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
