const config = require('./env');

class Logger {
  static log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta
    };

    if (!config.isTest) {
      console.log(JSON.stringify(logEntry, null, 2));
    }
  }

  static info(message, meta) {
    this.log('info', message, meta);
  }

  static error(message, meta) {
    this.log('error', message, meta);
  }

  static warn(message, meta) {
    this.log('warn', message, meta);
  }

  static debug(message, meta) {
    if (config.isDevelopment) {
      this.log('debug', message, meta);
    }
  }
}

module.exports = Logger;