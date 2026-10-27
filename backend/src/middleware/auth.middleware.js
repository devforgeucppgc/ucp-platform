const AppError = require('../utils/AppError');
const { verifyToken } = require('../config/jwt');
const Admin = require('../modules/auth/auth.model');

/**
 * Protect: verifies the Bearer JWT, loads the Admin document, and attaches it
 * to req.admin. Attaching the full document enables role-based authorization.
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('AUTH_TOKEN_REQUIRED'));
  }

  try {
    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return next(new AppError('AUTH_INVALID_TOKEN'));
    }

    if (!admin.isActive) {
      return next(new AppError('AUTH_ACCOUNT_DISABLED'));
    }

    req.admin = admin;
    req.user = admin;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('AUTH_TOKEN_EXPIRED'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('AUTH_INVALID_TOKEN'));
    }
    return next(error);
  }
};

/**
 * Authorize: restricts a protected route to specific admin roles.
 * Must be mounted after `protect`.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return next(new AppError('AUTH_TOKEN_REQUIRED'));
    }
    if (!roles.includes(req.admin.role)) {
      return next(new AppError('AUTH_FORBIDDEN'));
    }
    return next();
  };
};

module.exports = { protect, authorize };
