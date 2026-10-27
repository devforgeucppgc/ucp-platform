const responseHelper = require('../utils/responseHelper');
const { ERROR_CODES } = require('../constants/errorCodes');

/**
 * Centralized error handler (ERROR_CODES.md §15).
 *
 * Maps every error to a stable client response. Internal details (stack
 * traces, queries, env variables) are only logged, never returned.
 */
const errorHandler = (err, req, res, next) => {
  // Normalize thrown code strings (services often throw 'CODE_NAME')
  if (typeof err === 'string' && ERROR_CODES[err]) {
    err = { code: err, statusCode: ERROR_CODES[err].statusCode, message: ERROR_CODES[err].message };
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred.';
  let errors = err.errors || [];
  let code = err.code || 'INTERNAL_SERVER_ERROR';

  // Validate known error codes against the registry
  if (ERROR_CODES[code]) {
    statusCode = ERROR_CODES[code].statusCode;
    if (!message || message === code || message === 'An unexpected error occurred.') {
      message = ERROR_CODES[code].message;
    }
  }

  // express-validator errors carry .errors array with { path, msg }
  if (err.array && typeof err.array === 'function') {
    statusCode = 422;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed.';
    errors = err.array().map((e) => ({ field: e.path || e.param, message: e.msg }));
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 422;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed.';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_OBJECT_ID';
    message = 'Invalid resource identifier.';
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_RESOURCE';
    message = 'Resource already exists.';
    const key = Object.keys(err.keyValue || {})[0];
    errors = key ? [{ field: key, message: `${key} already exists.` }] : [];
  }

  // Multer file errors
  if (err instanceof Error && err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    code = 'FILE_TOO_LARGE';
    message = 'Uploaded file exceeds maximum allowed size.';
  }

  // Multer / file filter rejects with INVALID_FILE_TYPE
  if (err.message === 'INVALID_FILE_TYPE') {
    statusCode = 415;
    code = 'INVALID_FILE_TYPE';
    message = 'Unsupported file format.';
  }

  // Log internally — never expose these to the client.
  const requestId = req.requestId || 'n/a';
  console.error(`[ERROR][${requestId}] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack || '');
  }

  return responseHelper.error(res, message, errors, statusCode, code);
};

module.exports = errorHandler;
