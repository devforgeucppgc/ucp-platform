const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const AuthService = require('./auth.service');

class AuthController {
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    return responseHelper.success(res, 'Login successful.', result);
  });

  me = asyncHandler(async (req, res) => {
    return responseHelper.success(res, 'Admin details fetched.', req.admin);
  });

  logout = asyncHandler(async (req, res) => {
    // JWT is stateless; the client discards the token.
    return responseHelper.success(res, 'Logged out successfully.', null);
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await AuthService.changePassword(req.admin._id, currentPassword, newPassword);
    return responseHelper.success(res, 'Password changed successfully.', null);
  });

  updateAccount = asyncHandler(async (req, res) => {
    const { currentPassword, newEmail, newPassword } = req.body;
    const admin = await AuthService.updateAccount(req.admin._id, {
      currentPassword,
      newEmail,
      newPassword,
    });
    return responseHelper.success(res, 'Account updated successfully.', { admin });
  });
}

module.exports = new AuthController();