const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  role: { type: String, required: [true, 'Role is required'], trim: true },
  joinedYear: { type: String, required: [true, 'Joined year is required'] },
  quote: { type: String, required: [true, 'Quote is required'] },
  biography: { type: String, required: [true, 'Biography is required'] },
  image: { type: String, required: [true, 'Image URL is required'] },
}, { timestamps: true });

module.exports = mongoose.model('Leader', leaderSchema);
