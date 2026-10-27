const express = require('express');
const router = express.Router();
const SocietyController = require('./society.controller');
const {
  societyValidator,
  societyUpdateValidator,
  societyIdValidator,
  societyIdentifierValidator,
} = require('./society.validator');
const validate = require('../../middleware/validation.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { upload, uploadToCloudinary } = require('../../middleware/upload.middleware');

// Public routes
router.get('/', SocietyController.getAllSocieties);
router.get('/:identifier', validate(societyIdentifierValidator), SocietyController.getSociety);

// Protected (admin) routes
router.post(
  '/',
  protect,
  validate(societyValidator),
  SocietyController.createSociety
);

router.put(
  '/:id',
  protect,
  validate(societyIdValidator),
  validate(societyUpdateValidator),
  SocietyController.updateSociety
);

router.delete('/:id', protect, validate(societyIdValidator), SocietyController.deleteSociety);

module.exports = router;