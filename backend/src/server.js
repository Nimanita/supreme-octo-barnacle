const app = require('./app');
const Database = require('./config/database');
const config = require('./config/env');
const Logger = require('./config/logger');

let server;

const startServer = async () => {
  try {
    // Connect to database
    await Database.connect();

    // Start server
    server = app.listen(config.port, () => {
      Logger.info('Server started', {
        port: config.port,
        environment: config.nodeEnv,
        mongodb: config.mongoUri
      });
      console.log(`\n🚀 Server running on http://localhost:${config.port}`);
      console.log(`📊 API available at http://localhost:${config.port}/api`);
      console.log(`💚 Health check: http://localhost:${config.port}/api/health\n`);
    });

    // Handle graceful shutdown
    const gracefulShutdown = async (signal) => {
      Logger.info(`${signal} received, shutting down gracefully...`);
      
      if (server) {
        server.close(async () => {
          Logger.info('HTTP server closed');
          await Database.disconnect();
          process.exit(0);
        });
      }

      // Force shutdown after 10 seconds
      setTimeout(() => {
        Logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    Logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };