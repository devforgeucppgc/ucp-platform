const { body, param } = require('express-validator');

const mongoIdValidator = (fieldName = 'id') =>
  param(fieldName).isMongoId().withMessage(`Invalid ${fieldName} format.`);

const heroValidator = [
  body('badge').optional().trim(),
  body('title').optional().trim(),
  body('description').optional().trim(),
];

const introductionValidator = [
  body('title').optional().trim(),
  body('paragraphOne').optional().trim(),
  body('paragraphTwo').optional().trim(),
  body('overlayText').optional().trim(),
];

const statsValidator = [
  body('experience').optional(),
  body('teams').optional(),
  body('countries').optional(),
  body('uptime').optional(),
];

const timelineValidator = [
  body('year').notEmpty().withMessage('Year is required.').toInt(),
  body('title').notEmpty().withMessage('Title is required.').trim(),
  body('description').notEmpty().withMessage('Description is required.').trim(),
  body('icon').optional(),
  body('displayOrder').optional().toInt(),
];

const timelineUpdateValidator = [
  body('year').optional().toInt(),
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('icon').optional(),
  body('displayOrder').optional().toInt(),
];

const leaderValidator = [
  body('name').notEmpty().withMessage('Name is required.').trim(),
  body('role').notEmpty().withMessage('Role is required.').trim(),
  body('joinedYear').optional().trim(),
  body('quote').optional().trim(),
  body('biography').optional().trim(),
];

const leaderUpdateValidator = [
  body('name').optional().trim(),
  body('role').optional().trim(),
  body('joinedYear').optional().trim(),
  body('quote').optional().trim(),
  body('biography').optional().trim(),
];

const valueValidator = [
  body('frontIcon').optional(),
  body('title').notEmpty().withMessage('Title is required.').trim(),
  body('frontDescription').optional().trim(),
  body('backIcon').optional(),
  body('backDescription').optional().trim(),
];

const valueUpdateValidator = [
  body('frontIcon').optional(),
  body('title').optional().trim(),
  body('frontDescription').optional().trim(),
  body('backIcon').optional(),
  body('backDescription').optional().trim(),
];

module.exports = {
  heroValidator,
  introductionValidator,
  statsValidator,
  timelineValidator,
  timelineUpdateValidator,
  leaderValidator,
  leaderUpdateValidator,
  valueValidator,
  valueUpdateValidator,
  mongoIdValidator,
};
