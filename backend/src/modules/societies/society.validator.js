const { body, param } = require('express-validator');

const mongoIdValidator = (fieldName = 'id') =>
  param(fieldName).isMongoId().withMessage(`Invalid ${fieldName} format.`);

const sanitizeArray = (value) => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return Array.isArray(value) ? value : [];
};

const societyValidator = [
  body('name').notEmpty().withMessage('Society name is required.').trim(),
  body('slug').optional().trim(),
  body('tagline').optional().trim(),
  body('description').optional().trim(),
  body('mission').optional().trim(),
  body('vision').optional().trim(),
  body('logo').optional().trim(),
  body('icon').optional().trim(),
  body('tag').optional().trim(),
  body('objectives').optional().customSanitizer(sanitizeArray),
  body('activities').optional().customSanitizer(sanitizeArray),
  body('contact.email').optional({ checkFalsy: true }).isEmail().withMessage('Please enter a valid contact email.'),
  body('team').optional().isArray().withMessage('Team must be an array.'),
  body('teamMembers').optional().isArray().withMessage('TeamMembers must be an array.'),
  body('team.*.name').optional().trim(),
  body('team.*.designation').optional().trim(),
  body('team.*.image').optional().trim(),
  body('team.*.linkedin').optional().trim(),
  body('team.*.github').optional().trim(),
  body('team.*.skills').optional().customSanitizer(sanitizeArray),
  body('teamMembers.*.name').optional().trim(),
  body('teamMembers.*.designation').optional().trim(),
  body('teamMembers.*.image').optional().trim(),
  body('teamMembers.*.linkedin').optional().trim(),
  body('teamMembers.*.github').optional().trim(),
  body('teamMembers.*.skills').optional().customSanitizer(sanitizeArray),
];

const societyUpdateValidator = [
  body('name').optional().notEmpty().withMessage('Society name cannot be empty.').trim(),
  body('slug').optional().trim(),
  body('tagline').optional().trim(),
  body('description').optional().trim(),
  body('mission').optional().trim(),
  body('vision').optional().trim(),
  body('logo').optional().trim(),
  body('icon').optional().trim(),
  body('tag').optional().trim(),
  body('objectives').optional().customSanitizer(sanitizeArray),
  body('activities').optional().customSanitizer(sanitizeArray),
  body('contact.email').optional({ checkFalsy: true }).isEmail().withMessage('Please enter a valid contact email.'),
  body('team').optional().isArray().withMessage('Team must be an array.'),
  body('teamMembers').optional().isArray().withMessage('TeamMembers must be an array.'),
  body('team.*.name').optional().trim(),
  body('team.*.designation').optional().trim(),
  body('team.*.image').optional().trim(),
  body('team.*.linkedin').optional().trim(),
  body('team.*.github').optional().trim(),
  body('team.*.skills').optional().customSanitizer(sanitizeArray),
  body('teamMembers.*.name').optional().trim(),
  body('teamMembers.*.designation').optional().trim(),
  body('teamMembers.*.image').optional().trim(),
  body('teamMembers.*.linkedin').optional().trim(),
  body('teamMembers.*.github').optional().trim(),
  body('teamMembers.*.skills').optional().customSanitizer(sanitizeArray),
];

const societyIdValidator = [
  param('id').isMongoId().withMessage('Invalid society ID format.'),
];

const societyIdentifierValidator = [
  param('identifier').notEmpty().withMessage('Society ID or slug is required.'),
];

module.exports = {
  societyValidator,
  societyUpdateValidator,
  societyIdValidator,
  societyIdentifierValidator,
  mongoIdValidator,
};
