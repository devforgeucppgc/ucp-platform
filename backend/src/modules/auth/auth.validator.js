const { body } = require('express-validator');

const loginValidator = [
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const registerValidator = [
  body('fullName').notEmpty().withMessage('Full name is required.').trim(),
  body('email').isEmail().withMessage('Invalid email address.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
  body('role').optional().isIn(['super-admin', 'admin']).withMessage('Invalid role.'),
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long.')
    .bail()
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from the current password.'),
];

const updateAccountValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),

  body('newEmail')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Invalid email address.')
    .normalizeEmail(),

  body('newPassword')
    .optional({ checkFalsy: true })
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long.')
    .bail()
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from the current password.'),

  // At least one of newEmail / newPassword must be provided
  body().custom((body) => {
    if (!body.newEmail && !body.newPassword) {
      throw new Error('Provide a new email, a new password, or both.');
    }
    return true;
  }),
];

module.exports = {
  loginValidator,
  registerValidator,
  changePasswordValidator,
  updateAccountValidator,
};