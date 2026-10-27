const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin'],
    default: 'admin',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

/**
 * Hash the password before saving whenever it is modified.
 *
 * Hashing is enforced at the data layer so that EVERY admin creation path
 * (service methods, seed scripts, direct Model.create(), future controllers)
 * stores a bcrypt hash — never a plain-text password. The auth service must
 * NOT hash again, or the password would be double-hashed.
 *
 * Note: Mongoose 9 (Kareem) treats async middleware specially — it does not
 * pass `next`. Async middleware just returns/awaits a promise; thrown errors
 * propagate automatically. Do not add a `next` parameter.
 */
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (!this.password) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

/**
 * Hash the password on findOneAndUpdate/update-style queries too, so an
 * admin password updated through updateMany/findByIdAndUpdate is never
 * stored in plain text.
 */
adminSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  const password =
    (update && update.password) ||
    (update && update.$set && update.$set.password);

  if (!password) return;

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  if (update.password) update.password = hashed;
  if (update.$set && update.$set.password) update.$set.password = hashed;
});

module.exports = mongoose.model('Admin', adminSchema);
