const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  year: { type: Number, required: [true, 'Year is required'] },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'], trim: true },
  icon: { type: String, required: [true, 'Icon is required'] },
  displayOrder: { type: Number, required: [true, 'Display order is required'], index: true },
}, { timestamps: true });

module.exports = mongoose.model('Timeline', timelineSchema);
