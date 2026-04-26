import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { httpLogger } from './config/logger.js';
import { apiRateLimit } from './config/rateLimit.js';
import { swaggerDocument } from './config/swagger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import apiRouter from './modules/index.js';

const app = express();

const allowedOrigins =
  env.CORS_ORIGIN === '*'
    ? true
    : env.CORS_ORIGIN.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(httpLogger);
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.SWAGGER_ENABLED) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
  app.get('/docs/openapi.json', (_req, res) => {
    res.json(swaggerDocument);
  });
}

app.use(env.API_PREFIX, apiRateLimit, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

