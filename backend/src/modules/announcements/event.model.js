
 


const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  day: { type: Number, required: [true, 'Day is required'] },
  month: { type: String, required: [true, 'Month is required'], trim: true },
  color: { type: String, required: [true, 'Color is required'], trim: true },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  time: { type: String, required: [true, 'Time is required'] },
  location: { type: String, required: [true, 'Location is required'] },
}, {
  timestamps: true
});

// Correct index definition
eventSchema.index({ month: 1, color: 1, title: 1, createdAt: -1 });

module.exports = mongoose.model('Event', eventSchema);
