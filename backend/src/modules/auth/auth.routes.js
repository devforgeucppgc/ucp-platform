const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const { loginValidator, changePasswordValidator } = require('./auth.validator');
const validate = require('../../middleware/validation.middleware');
const { protect } = require('../../middleware/auth.middleware');

router.post('/login', validate(loginValidator), AuthController.login);
router.get('/me', protect, AuthController.me);
router.post('/logout', protect, AuthController.logout);

router.put(
  '/change-password',
  protect,
  validate(changePasswordValidator),
  AuthController.changePassword
);

// ✅ ADD THIS BLOCK
router.put(
  '/update-account',
  protect,
  AuthController.updateAccount
);

module.exports = router;