const { body } = require('express-validator');

const uploadValidator = [
  body('file').exists().withMessage('File is required.'),
];

module.exports = {
  uploadValidator,
};
