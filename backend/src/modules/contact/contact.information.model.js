const mongoose = require('mongoose');

const contactInformationSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    phone:   { type: String, required: true },
    email:   { type: String, required: true },
    // ✅ FIX: Added postalCode — was in admin UI but missing from model (got silently dropped)
    postalCode: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactInformation', contactInformationSchema);