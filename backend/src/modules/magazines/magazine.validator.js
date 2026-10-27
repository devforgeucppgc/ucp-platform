// backend/src/modules/magazines/magazine.validator.js
const { body, param } = require('express-validator');

const sanitizeTopics = (value, { req }) => {
  if (req.body && req.body['topics[]']) {
    const arr = req.body['topics[]'];
    return Array.isArray(arr) ? arr : [arr];
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
  }
  if (Array.isArray(value)) return value;
  return [];
};

const sanitizeBoolean = (value) => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
};

const createMagazineValidator = [
  // ⭐ Make ALL fields optional except title and issue
  body('title')
    .optional()  // CHANGED: optional instead of required
    .trim(),
  body('issue')
    .optional()  // CHANGED: optional instead of required
    .trim(),
  body('description').optional().trim(),
  body('topics').optional().customSanitizer(sanitizeTopics),
  body('topics[]').optional().customSanitizer((v) => Array.isArray(v) ? v : [v]),
  body('publicationDate').optional(),
  body('date').optional(),
  body('folder').optional().trim(),
  body('status').optional(),
  body('pinned').optional().customSanitizer(sanitizeBoolean),
  body('hidden').optional().customSanitizer(sanitizeBoolean),
];

const updateMagazineValidator = [
  body('title').optional().trim(),
  body('issue').optional().trim(),
  body('description').optional().trim(),
  body('topics').optional().customSanitizer(sanitizeTopics),
  body('topics[]').optional().customSanitizer((v) => Array.isArray(v) ? v : [v]),
  body('publicationDate').optional(),
  body('date').optional(),
  body('folder').optional().trim(),
  body('status').optional(),
  body('pinned').optional().customSanitizer(sanitizeBoolean),
  body('hidden').optional().customSanitizer(sanitizeBoolean),
  body('downloads').optional().toInt(),
];

const magazineIdValidator = [
  param('id').isMongoId().withMessage('Invalid magazine ID format.'),
];

module.exports = {
  magazineValidator: updateMagazineValidator,
  createMagazineValidator,
  updateMagazineValidator,
  magazineIdValidator,
};