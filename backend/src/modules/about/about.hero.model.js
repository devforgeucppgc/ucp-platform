const mongoose = require('mongoose');

const aboutHeroSchema = new mongoose.Schema({
  badge: { type: String, required: [true, 'Badge is required'], trim: true },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'], trim: true },
}, { timestamps: true });

module.exports = mongoose.model('AboutHero', aboutHeroSchema);
