import { ZodError } from 'zod';

import { logger } from '../config/logger.js';
import { ApiError } from '../utils/apiError.js';

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  logger.error({ err: error }, 'Unhandled application error');

  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
};

