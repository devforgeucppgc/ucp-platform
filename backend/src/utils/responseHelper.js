/**
 * Standard API response helpers (API_SPEC.md §2, ERROR_CODES.md §2).
 *
 * Success: { success: true,  message, data }
 * Error:   { success: false, message, errors, code }
 */
const responseHelper = {
  success: (res, message = 'Operation completed successfully.', data = null, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  error: (res, message = 'An error occurred', errors = [], statusCode = 500, code = 'INTERNAL_SERVER_ERROR') => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      code,
    });
  },
};

module.exports = responseHelper;
