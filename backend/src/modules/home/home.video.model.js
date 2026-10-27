const mongoose = require('mongoose');

const homeVideoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: [true, 'Video URL is required'], trim: true },
}, { timestamps: true });

module.exports = mongoose.model('HomeVideo', homeVideoSchema);
