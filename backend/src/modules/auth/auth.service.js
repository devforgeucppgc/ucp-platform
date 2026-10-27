const bcrypt = require('bcrypt');
const AuthRepository = require('./auth.repository');
const AppError = require('../../utils/AppError');
const { generateToken } = require('../../config/jwt');

class AuthService {
  async login(email, password) {
    const admin = await AuthRepository.findByEmailWithPassword(email);
    if (!admin) {
      throw new AppError('AUTH_INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new AppError('AUTH_INVALID_CREDENTIALS');
    }

    if (!admin.isActive) {
      throw new AppError('AUTH_ACCOUNT_DISABLED');
    }

    const token = generateToken(admin._id, admin.role);
    await AuthRepository.updateLastLogin(admin._id);

    return {
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async registerAdmin(adminData) {
    const existingAdmin = await AuthRepository.findByEmail(adminData.email);
    if (existingAdmin) {
      throw new AppError('DUPLICATE_RESOURCE');
    }

    // Password hashing is handled by the Admin model's pre-save hook.
    const admin = await AuthRepository.createAdmin(adminData);

    return {
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    };
  }

  async changePassword(adminId, currentPassword, newPassword) {
    const admin = await AuthRepository.findByIdWithPassword(adminId);
    if (!admin) {
      throw new AppError('AUTH_INVALID_TOKEN');
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      throw new AppError('AUTH_INVALID_CREDENTIALS');
    }

    // Do NOT hash here. The model's pre-save hook hashes it.
    admin.password = newPassword;
    await admin.save();
  }

  /**
   * Update email and/or password. Current password is always required.
   * The pre-save hook hashes the password only if it was modified.
   */
  async updateAccount(adminId, { currentPassword, newEmail, newPassword }) {
    const admin = await AuthRepository.findByIdWithPassword(adminId);
    if (!admin) {
      throw new AppError('AUTH_INVALID_TOKEN');
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      throw new AppError('AUTH_INVALID_CREDENTIALS');
    }

    if (newEmail) {
      const email = String(newEmail).toLowerCase().trim();
      if (email !== admin.email) {
        const existing = await AuthRepository.findByEmail(email);
        if (existing && String(existing._id) !== String(admin._id)) {
          throw new AppError('DUPLICATE_RESOURCE');
        }
        admin.email = email;
      }
    }

    if (newPassword) {
      // Do NOT hash here. The model's pre-save hook hashes it.
      admin.password = newPassword;
    }

    await admin.save();

    return {
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    };
  }
}

module.exports = new AuthService();