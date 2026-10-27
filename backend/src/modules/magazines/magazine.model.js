// backend/models/magazine.model.js
const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    trim: true, 
    index: true 
  },
  issue: { 
    type: String, 
    required: [true, 'Issue is required'], 
    trim: true 
  },
  coverImage: { type: String, default: '' },
  pdfUrl: { type: String, default: '' },
  publicationDate: { type: Date, default: Date.now, index: true },
  description: { type: String, default: '' },
  topics: [{ type: String }],
  folder: { type: String, default: '', trim: true },
  status: { 
    type: String, 
    enum: ['published', 'draft'], 
    default: 'published' 
  },
  downloads: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
}, { timestamps: true });

magazineSchema.index({ publicationDate: -1, title: 1 });

module.exports = mongoose.model('Magazine', magazineSchema);