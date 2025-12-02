class ApiError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', details = null) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static validationError(message = 'Validation Error', details = null) {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(409, 'CONFLICT', message);
  }

  static internal(message = 'Internal Server Error') {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  toJSON() {
    const response = {
      success: false,
      code: this.code,
      message: this.message
    };

    if (this.details) {
      response.details = this.details;
    }

    return response;
  }
}

module.exports = ApiError;