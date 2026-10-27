const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, index: true },
  description: { type: String, required: [true, 'Description is required'] },
  image: { type: String, required: [true, 'Image URL is required'] },
  category: { type: String, required: [true, 'Category is required'], index: true },
  technologies: [{ type: String, required: true }],
  github: { type: String, trim: true },
  demo: { type: String, trim: true },
  featured: { type: Boolean, default: false, index: true },
}, { timestamps: true });

// Compound index for efficient sorting by featured + createdAt (common query pattern)
projectSchema.index({ featured: 1, createdAt: -1 });

// Text index for faster searching on title and category
projectSchema.index({ title: 'text', category: 'text' });

module.exports = mongoose.model('Project', projectSchema);
