import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectPrisma, disconnectPrisma } from './config/prisma.js';

let server;

const shutdown = async (signal) => {
  logger.info({ signal }, 'Shutdown signal received');

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectPrisma();
      process.exit(0);
    });
    return;
  }

  await disconnectPrisma();
  process.exit(0);
};

const startServer = async () => {
  await connectPrisma();

  server = app.listen(env.PORT, () => {
    logger.info(`TukAPI listening on port ${env.PORT}`);
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
