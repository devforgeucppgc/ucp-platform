const { body, param } = require('express-validator');

const sanitizeTechnologies = (value) => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return value;
};

const sanitizeBoolean = (value) => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
};

const projectValidator = [
  body('title').notEmpty().withMessage('Title is required.').trim(),
  body('description').notEmpty().withMessage('Description is required.').trim(),
  body('category').notEmpty().withMessage('Category is required.').trim(),
  body('technologies')
    .customSanitizer(sanitizeTechnologies)
    .isArray({ min: 1 })
    .withMessage('At least one technology is required.'),
  body('github').optional().trim(),
  body('demo').optional().trim(),
  body('featured').optional().customSanitizer(sanitizeBoolean),
];

const projectUpdateValidator = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty.').trim(),
  body('description').optional().notEmpty().withMessage('Description cannot be empty.').trim(),
  body('category').optional().notEmpty().withMessage('Category cannot be empty.').trim(),
  body('technologies')
    .optional()
    .customSanitizer(sanitizeTechnologies)
    .isArray({ min: 1 })
    .withMessage('At least one technology is required.'),
  body('github').optional().trim(),
  body('demo').optional().trim(),
  body('featured').optional().customSanitizer(sanitizeBoolean),
];

const projectIdValidator = [
  param('id').isMongoId().withMessage('Invalid project ID format.'),
];

module.exports = {
  projectValidator,
  projectUpdateValidator,
  projectIdValidator,
};