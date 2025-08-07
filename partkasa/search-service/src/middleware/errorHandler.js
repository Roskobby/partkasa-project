const logger = require('../utils/logger');

/**
 * Global error handling middleware
 * Catches errors and sends a standardized response
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Create error response
  const errorResponse = {
    status: 'error',
    message: statusCode === 500 ? 'Internal server error' : err.message || 'Something went wrong',
    requestId: req.id // Assuming you're using a request ID middleware
  };

  // Add error details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err.details || null;
  }

  // Send response
  res.status(statusCode).json(errorResponse);
};

/**
 * Custom error class with status code
 */
class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details) {
    return new ApiError(message || 'Bad Request', 400, details);
  }

  static unauthorized(message, details) {
    return new ApiError(message || 'Unauthorized', 401, details);
  }

  static forbidden(message, details) {
    return new ApiError(message || 'Forbidden', 403, details);
  }

  static notFound(message, details) {
    return new ApiError(message || 'Not Found', 404, details);
  }

  static methodNotAllowed(message, details) {
    return new ApiError(message || 'Method Not Allowed', 405, details);
  }

  static conflict(message, details) {
    return new ApiError(message || 'Conflict', 409, details);
  }

  static tooMany(message, details) {
    return new ApiError(message || 'Too Many Requests', 429, details);
  }

  static internal(message, details) {
    return new ApiError(message || 'Internal Server Error', 500, details);
  }

  static serviceUnavailable(message, details) {
    return new ApiError(message || 'Service Unavailable', 503, details);
  }
}

module.exports = {
  errorHandler,
  ApiError
};
