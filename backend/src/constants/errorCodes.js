/**
 * Centralized error code registry (ERROR_CODES.md).
 *
 * Every ApiError thrown with a `code` from this map is converted by the
 * global error middleware into the documented HTTP status + message, keeping
 * client responses stable and internal details hidden.
 */
const ERROR_CODES = {
  // General
  BAD_REQUEST: { statusCode: 400, message: 'Malformed request.' },
  NOT_FOUND: { statusCode: 404, message: 'Requested resource not found.' },
  METHOD_NOT_ALLOWED: { statusCode: 405, message: 'HTTP method not supported.' },
  CONFLICT: { statusCode: 409, message: 'Resource already exists.' },
  DUPLICATE_RESOURCE: { statusCode: 409, message: 'Resource already exists.' },
  RESOURCE_ALREADY_DELETED: { statusCode: 404, message: 'Resource no longer exists.' },
  INTERNAL_SERVER_ERROR: { statusCode: 500, message: 'An unexpected error occurred.' },
  SERVICE_UNAVAILABLE: { statusCode: 503, message: 'Service temporarily unavailable.' },

  // Authentication
  AUTH_INVALID_CREDENTIALS: { statusCode: 401, message: 'Invalid email or password.' },
  AUTH_TOKEN_REQUIRED: { statusCode: 401, message: 'Authentication token is required.' },
  AUTH_INVALID_TOKEN: { statusCode: 401, message: 'Invalid authentication token.' },
  AUTH_TOKEN_EXPIRED: { statusCode: 401, message: 'Authentication token has expired.' },
  AUTH_ACCOUNT_DISABLED: { statusCode: 403, message: 'This account has been disabled.' },
  AUTH_FORBIDDEN: { statusCode: 403, message: 'You are not authorized to perform this action.' },

  // Validation
  VALIDATION_ERROR: { statusCode: 422, message: 'Validation failed.' },
  INVALID_OBJECT_ID: { statusCode: 400, message: 'Invalid resource identifier.' },
  INVALID_EMAIL: { statusCode: 422, message: 'Invalid email address.' },
  INVALID_PHONE: { statusCode: 422, message: 'Invalid phone number.' },
  INVALID_URL: { statusCode: 422, message: 'Invalid URL.' },

  // Resources
  RESOURCE_NOT_FOUND: { statusCode: 404, message: 'Requested resource not found.' },

  // Database
  DATABASE_CONNECTION_ERROR: { statusCode: 500, message: 'Database connection failed.' },
  DATABASE_QUERY_ERROR: { statusCode: 500, message: 'Database query failed.' },
  DATABASE_TIMEOUT: { statusCode: 500, message: 'Database request timed out.' },

  // Cloudinary
  CLOUDINARY_UPLOAD_FAILED: { statusCode: 500, message: 'Unable to upload file.' },
  CLOUDINARY_DELETE_FAILED: { statusCode: 500, message: 'Unable to delete file.' },
  CLOUDINARY_RESOURCE_NOT_FOUND: { statusCode: 404, message: 'Media resource not found.' },

  // File upload
  FILE_REQUIRED: { statusCode: 400, message: 'File is required.' },
  INVALID_FILE_TYPE: { statusCode: 415, message: 'Unsupported file format.' },
  FILE_TOO_LARGE: { statusCode: 413, message: 'Uploaded file exceeds maximum allowed size.' },
  FILE_UPLOAD_FAILED: { statusCode: 500, message: 'File upload failed.' },

  // Rate limiting
  RATE_LIMIT_EXCEEDED: { statusCode: 429, message: 'Too many requests. Please try again later.' },
};

module.exports = { ERROR_CODES };
