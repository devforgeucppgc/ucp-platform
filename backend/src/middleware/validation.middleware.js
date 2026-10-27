// backend/src/middleware/validation.middleware.js
const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // ⭐ THIS WILL SHOW THE EXACT ERROR
      console.log('=====================');
      console.log('❌ VALIDATION FAILED');
      console.log('=====================');
      console.log('Body:', JSON.stringify(req.body, null, 2));
      console.log('Files:', req.files ? Object.keys(req.files) : 'none');
      console.log('Errors:', JSON.stringify(errors.array(), null, 2));
      console.log('=====================');

      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    } catch (error) {
      console.error('❌ Middleware error:', error);
      next(error);
    }
  };
};

module.exports = validate;