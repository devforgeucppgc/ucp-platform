// campus.routes.js
const express = require('express');
const router = express.Router();
const CampusController = require('./campus.controller');
const { campusInfoValidator } = require('./campus.validator');
const validate = require('../../middleware/validation.middleware');
const { protect } = require('../../middleware/auth.middleware');

// Public route to get all campus information
router.get('/', CampusController.getCampusInformation);

// Protected route to CREATE new campus information
router.post(
  '/',
  protect,
  validate(campusInfoValidator),
  CampusController.createCampusInformation
);

// Protected route to UPDATE existing campus information
router.put(
  '/',
  protect,
  validate(campusInfoValidator),
  CampusController.updateCampusInformation
);

// Protected route to DELETE campus information (optional, adjust if needed)
router.delete(
  '/',
  protect,
  CampusController.deleteCampusInformation
);

module.exports = router;