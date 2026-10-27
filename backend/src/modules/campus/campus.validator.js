const { body } = require('express-validator');

const campusInfoValidator = [
  body('hero').optional().isObject().withMessage('Hero must be an object.'),
  body('stats').optional().isArray().withMessage('Stats must be an array.'),
  body('admissionPolicy').optional().isObject().withMessage('Admission policy must be an object.'),
  body('degreePrograms').optional().isArray().withMessage('Degree programs must be an array.'),
  body('feeStructures').optional().isArray().withMessage('Fee structures must be an array.'),
  body('scholarships').optional().isArray().withMessage('Scholarships must be an array.'),
  body('features').optional().isArray().withMessage('Features must be an array.'),
  body('clubs').optional().isArray().withMessage('Clubs must be an array.'),
  body('campusDetails').optional().isObject().withMessage('Campus details must be an object.'),
];

module.exports = {
  campusInfoValidator,
};
