const mongoose = require('mongoose');
const config = require('./env');
const Logger = require('./logger');

class Database {
  static async connect() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      await mongoose.connect(config.mongoUri, options);
      
      Logger.info('MongoDB connected successfully', { 
        database: mongoose.connection.name 
      });

      mongoose.connection.on('error', (err) => {
        Logger.error('MongoDB connection error', { error: err.message });
      });

      mongoose.connection.on('disconnected', () => {
        Logger.warn('MongoDB disconnected');
      });

      return mongoose.connection;
    } catch (error) {
      Logger.error('MongoDB connection failed', { error: error.message });
      throw error;
    }
  }

  static async disconnect() {
    try {
      await mongoose.connection.close();
      Logger.info('MongoDB disconnected successfully');
    } catch (error) {
      Logger.error('Error disconnecting from MongoDB', { error: error.message });
      throw error;
    }
  }

  static async clearDatabase() {
    if (config.isTest) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
      Logger.info('Test database cleared');
    }
  }
}

module.exports = Database;