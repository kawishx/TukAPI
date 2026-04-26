export const validateRequest = (schemas = {}) => (req, _res, next) => {
  try {
    for (const [requestProperty, schema] of Object.entries(schemas)) {
      req[requestProperty] = schema.parse(req[requestProperty]);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

