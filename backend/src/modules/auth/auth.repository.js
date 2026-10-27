const Admin = require('./auth.model');

class AuthRepository {
  async findByEmail(email) {
    return await Admin.findOne({ email });
  }

  /**
   * Login lookup: explicitly includes the password field which is
   * `select: false` on the model by default.
   */
  async findByEmailWithPassword(email) {
    return await Admin.findOne({ email }).select('+password');
  }

  /**
   * Used by change-password: req.admin is loaded without the password,
   * so we re-fetch it with the password included.
   */
  async findByIdWithPassword(id) {
    return await Admin.findById(id).select('+password');
  }

  async createAdmin(adminData) {
    return await Admin.create(adminData);
  }

  async updateLastLogin(adminId) {
    return await Admin.findByIdAndUpdate(adminId, { lastLogin: new Date() });
  }
}

module.exports = new AuthRepository();