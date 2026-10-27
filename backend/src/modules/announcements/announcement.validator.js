const { body, param } = require('express-validator');

const mongoIdValidator = (fieldName = 'id') =>
  param(fieldName).isMongoId().withMessage(`Invalid ID format.`);

const announcementValidator = [
  body('day').toInt().isInt({ min: 1, max: 31 }).withMessage('Day must be a valid number between 1 and 31.'),
  body('month').notEmpty().withMessage('Month is required.').trim(),
  body('tag').notEmpty().withMessage('Tag is required.').trim(),
  body('tagClass').optional().trim(),
  body('title').notEmpty().withMessage('Title is required.').trim(),
  body('description').notEmpty().withMessage('Description is required.'),
];

const updateAnnouncementValidator = [
  body('day').optional().toInt(),
  body('month').optional().trim(),
  body('tag').optional().trim(),
  body('tagClass').optional().trim(),
  body('title').optional().trim(),
  body('description').optional(),
];

const eventValidator = [
  body('day').toInt().isInt({ min: 1, max: 31 }).withMessage('Day must be a valid number between 1 and 31.'),
  body('month').notEmpty().withMessage('Month is required.').trim(),
  body('color').optional().trim(),
  body('title').notEmpty().withMessage('Title is required.').trim(),
  body('time').notEmpty().withMessage('Time is required.'),
  body('location').notEmpty().withMessage('Location is required.'),
];

const updateEventValidator = [
  body('day').optional().toInt(),
  body('month').optional().trim(),
  body('color').optional().trim(),
  body('title').optional().trim(),
  body('time').optional(),
  body('location').optional(),
];

module.exports = {
  announcementValidator,
  updateAnnouncementValidator,
  eventValidator,
  updateEventValidator,
  mongoIdValidator,
};
