import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

import { logger } from '../config/logger.js';
import { ApiError } from '../utils/apiError.js';

export const errorHandler = (error, _req, res, next) => {
  void next;

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

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A unique constraint would be violated by this request.',
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Requested resource was not found.',
      });
    }
  }

  logger.error({ err: error }, 'Unhandled application error');

  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
};
