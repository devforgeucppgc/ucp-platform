const { body, param } = require('express-validator');

const contactFormValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .trim(),

  body('email')
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Valid email is required.')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim(),

  body('city')
    .optional()
    .trim(),

  body('subject')
    .optional()
    .trim(),

  body('interest')
    .notEmpty()
    .withMessage('Interest is required.')
    .trim(),

  body('message')
    .notEmpty()
    .withMessage('Message is required.')
    .trim(),
];

const contactPageValidator = [
  body('hero.title').optional().trim(),
  body('hero.subtitle').optional().trim(),
  body('hero.icon').optional().trim(),
  body('contactInfo.address').optional().trim(),
  body('contactInfo.phone').optional().trim(),
  body('contactInfo.email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Valid email required.'),
  body('contactInfo.postalCode').optional().trim(),
  body('emailSettings.receiverEmail')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Valid receiver email required.'),
  body('emailSettings.subject').optional().trim(),
  body('emailSettings.autoReply').optional().trim(),
];

const academicProgramValidator = [
  body('name')
    .notEmpty()
    .withMessage('Program name is required.')
    .trim(),
];

const patchMessageValidator = [
  body('status')
    .optional()
    .isIn(['unread', 'read', 'replied'])
    .withMessage('Status must be unread, read, or replied.'),

  body('replyMessage')
    .optional()
    .trim(),
];

const mongoIdValidator = (field = 'id') => [
  param(field)
    .isMongoId()
    .withMessage(`Invalid ${field}.`),
];

module.exports = {
  contactFormValidator,
  contactPageValidator,
  academicProgramValidator,
  patchMessageValidator,
  mongoIdValidator,
};