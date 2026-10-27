const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  frontIcon: { type: String, required: [true, 'Front icon is required'] },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  frontDescription: { type: String, required: [true, 'Front description is required'] },
  backIcon: { type: String, required: [true, 'Back icon is required'] },
  backDescription: { type: String, required: [true, 'Back description is required'] },
}, { timestamps: true });

module.exports = mongoose.model('Value', valueSchema);
