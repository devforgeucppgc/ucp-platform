const AppError = require('../utils/AppError');

/**
 * 404 handler for unmatched routes. Must be registered after all API routes.
 */
const notFound = (req, res, next) => {
  return next(new AppError('NOT_FOUND'));
};

module.exports = notFound;
