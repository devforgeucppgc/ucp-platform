const { body } = require('express-validator');

const heroValidator = [
  body('badge').optional().trim(),
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('studentsJoined').optional().toInt(),
  body('rating').optional().toFloat(),
];

const aboutValidator = [
  body('title').optional().trim(),
  body('paragraphOne').optional().trim(),
  body('paragraphTwo').optional().trim(),
];

const statsValidator = [
  body('students').optional().toInt(),
  body('faculty').optional().toInt(),
  body('programs').optional().toInt(),
];

const videoValidator = [
  body('videoUrl').optional().trim(),
];

module.exports = {
  heroValidator,
  aboutValidator,
  statsValidator,
  videoValidator,
};
