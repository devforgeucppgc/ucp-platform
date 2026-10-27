const express = require('express');
const router = express.Router();

const ContactController = require('./contact.controller');
const {
  contactFormValidator,
  contactPageValidator,
  academicProgramValidator,
  patchMessageValidator,
  mongoIdValidator,
} = require('./contact.validator');

const validate = require('../../middleware/validation.middleware');
const { protect } = require('../../middleware/auth.middleware');

// Public routes
router.post(
  '/',
  validate(contactFormValidator),
  ContactController.submitContactForm
);

router.get('/', ContactController.getContactPage);
router.get('/academic-programs', ContactController.getAcademicPrograms);

// Admin routes
router.put(
  '/',
  protect,
  validate(contactPageValidator),
  ContactController.updateContactPage
);

router.get('/messages', protect, ContactController.getAllMessages);

router.get(
  '/messages/:id',
  protect,
  validate(mongoIdValidator('id')),
  ContactController.getMessage
);

router.patch(
  '/messages/:id',
  protect,
  validate([...mongoIdValidator('id'), ...patchMessageValidator]),
  ContactController.patchMessage
);

router.delete(
  '/messages/:id',
  protect,
  validate(mongoIdValidator('id')),
  ContactController.deleteMessage
);

router.post(
  '/academic-programs',
  protect,
  validate(academicProgramValidator),
  ContactController.addAcademicProgram
);

router.delete(
  '/academic-programs/:id',
  protect,
  validate(mongoIdValidator('id')),
  ContactController.removeAcademicProgram
);

module.exports = router;