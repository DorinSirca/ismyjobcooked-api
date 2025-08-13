const { logger } = require('../utils/logger');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Determine error type and create appropriate response
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  let errorDetails = null;

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = 'Validation Error';
    errorDetails = err.details || err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorMessage = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorMessage = 'Not Found';
  } else if (err.name === 'RateLimitError') {
    statusCode = 429;
    errorMessage = 'Too Many Requests';
  } else if (err.code === 'ENOTFOUND') {
    statusCode = 503;
    errorMessage = 'Service Unavailable';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    errorMessage = 'Service Unavailable';
  } else if (err.message && err.message.includes('timeout')) {
    statusCode = 408;
    errorMessage = 'Request Timeout';
  } else if (err.message && err.message.includes('invalid')) {
    statusCode = 400;
    errorMessage = 'Bad Request';
  }

  // Create error response
  const errorResponse = {
    error: errorMessage,
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Add error details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = errorDetails;
  }

  // Add request ID if available
  if (req.id) {
    errorResponse.requestId = req.id;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * Async error wrapper for route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function with error handling
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Custom error classes
 */
class ValidationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Access forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

class RateLimitError extends Error {
  constructor(message = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * 404 handler for unmatched routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFoundHandler(req, res) {
  const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
  
  res.status(404).json({
    error: 'Not Found',
    message: error.message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    availableEndpoints: [
      'GET /health',
      'GET /',
      'POST /api/jobs/analyze',
      'GET /api/jobs/random',
      'GET /api/jobs/categories',
      'GET /api/memes/daily',
      'POST /api/analytics/track'
    ]
  });
}

module.exports = {
  errorHandler,
  asyncHandler,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  RateLimitError,
  notFoundHandler
};
