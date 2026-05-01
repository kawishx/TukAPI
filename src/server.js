import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectPrisma, disconnectPrisma } from './config/prisma.js';

let server;
let isShuttingDown = false;

const closeHttpServer = () =>
  new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info({ signal }, 'Shutdown signal received');
  await closeHttpServer();
  logger.info('HTTP server closed');
  await disconnectPrisma();
  process.exit(0);
};

const startServer = async () => {
  await connectPrisma();

  server = app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
        apiPrefix: env.API_PREFIX,
        swaggerEnabled: env.SWAGGER_ENABLED,
      },
      'TukAPI started',
    );
  });

  server.on('error', (error) => {
    logger.fatal({ err: error }, 'HTTP server failed');
    process.exit(1);
  });
};

process.on('SIGINT', () => {
  shutdown('SIGINT').catch((error) => {
    logger.error({ err: error }, 'Failed to shut down cleanly after SIGINT');
    process.exit(1);
  });
});
process.on('SIGTERM', () => {
  shutdown('SIGTERM').catch((error) => {
    logger.error({ err: error }, 'Failed to shut down cleanly after SIGTERM');
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught exception');
  process.exit(1);
});

startServer().catch((error) => {
  logger.fatal({ err: error }, 'Failed to start TukAPI');
  process.exit(1);
});
