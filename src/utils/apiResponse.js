import { applyConditionalGet } from './httpCache.js';

export const sendSuccess = (
  res,
  {
    statusCode = 200,
    message = 'Request completed successfully.',
    data = null,
    meta,
  } = {},
) => {
  const body = {
    success: true,
    message,
    data,
  };

  if (meta) {
    body.meta = meta;
  }

  return res.status(statusCode).json(body);
};

export const sendCachedSuccess = (
  req,
  res,
  {
    statusCode = 200,
    message = 'Request completed successfully.',
    data = null,
    meta,
    lastModified,
  } = {},
) => {
  const body = {
    success: true,
    message,
    data,
  };

  if (meta) {
    body.meta = meta;
  }

  if (applyConditionalGet(req, res, body, lastModified)) {
    return res;
  }

  return res.status(statusCode).json(body);
};

