const mongoose = require('mongoose');

const homeAboutSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  paragraphOne: { type: String, required: [true, 'Paragraph one is required'], trim: true },
  paragraphTwo: { type: String, required: [true, 'Paragraph two is required'], trim: true },
  image: { type: String, required: [true, 'Image URL is required'] },
}, { timestamps: true });

module.exports = mongoose.model('HomeAbout', homeAboutSchema);
