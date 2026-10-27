const { ERROR_CODES } = require('../constants/errorCodes');

/**
 * Operational error used across services.
 *
 * - Passing a known `code` (from ERROR_CODES.md) sets status + message.
 * - Passing a raw message + statusCode keeps AppError usable as a plain
 *   operational error (e.g. `new AppError('Timeline item not found', 404)`).
 */
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    this.code = code || 'INTERNAL_SERVER_ERROR';

    if (message && typeof message === 'string' && ERROR_CODES[message]) {
      const mapped = ERROR_CODES[message];
      this.statusCode = mapped.statusCode;
      this.message = mapped.message;
      this.code = message;
    }

    Error.captureStackTrace(this, this.constructor);
  }

  static fromCode(code) {
    return new AppError(code);
  }
}

module.exports = AppError;
