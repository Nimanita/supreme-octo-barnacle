const Logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const config = require('../config/env');

const errorHandler = (err, req, res, next) => {
  // Log the error
  Logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Handle known ApiError instances
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(error => ({
      field: error.path,
      issue: error.message
    }));

    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      code: 'DUPLICATE_ERROR',
      message: `${field} already exists`,
      details: [{ field, issue: 'must be unique' }]
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      code: 'INVALID_ID',
      message: `Invalid ${err.path}: ${err.value}`
    });
  }

  // Handle generic errors
  const statusCode = err.statusCode || 500;
  const message = config.isProduction && statusCode === 500 
    ? 'Internal Server Error' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message,
    ...(config.isDevelopment && { stack: err.stack })
  });
};

// Handle 404 - Not Found
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Route ${req.originalUrl} not found`
  });
};

module.exports = { errorHandler, notFoundHandler };