const mongoose = require('mongoose');

const homeHeroSchema = new mongoose.Schema({
  badge: { type: String, required: [true, 'Badge is required'], trim: true },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'], trim: true },
  studentsJoined: { type: Number, required: [true, 'Students joined count is required'] },
  rating: { type: Number, required: [true, 'Rating is required'], min: 0, max: 5 },
  heroImage: { type: String, required: [true, 'Hero image URL is required'] },
}, { timestamps: true });

module.exports = mongoose.model('HomeHero', homeHeroSchema);
