const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || '43b17cda4398f6ba3a79d39ea30e79fbda82bca487103859664639ad1cf38a08';
  const expirySeconds = process.env.JWT_EXPIRES ? parseJWTExpiry(process.env.JWT_EXPIRES) : 604800;

  return jwt.sign(
    {
      id: String(id),
      role: role || 'admin',
    },
    secret,
    {
      expiresIn: expirySeconds,
    }
  );
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || '43b17cda4398f6ba3a79d39ea30e79fbda82bca487103859664639ad1cf38a08';
  return jwt.verify(token, secret);
};

/**
 * Parse JWT expiry string to seconds
 * Supports formats: 7d, 24h, 3600s, 1d2h30m
 */
function parseJWTExpiry(expiry) {
  if (!expiry) return 604800; // 7 days default

  const regex = /(\d+)([dhms])?/g;
  let seconds = 0;
  let match;

  while ((match = regex.exec(expiry)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'd':
        seconds += value * 24 * 60 * 60;
        break;
      case 'h':
        seconds += value * 60 * 60;
        break;
      case 'm':
        seconds += value * 60;
        break;
      case 's':
        seconds += value;
        break;
      default:
        seconds += value * 24 * 60 * 60; // Default to days
    }
  }

  return seconds > 0 ? seconds : 604800;
}

module.exports = {
  generateToken,
  verifyToken,
};
