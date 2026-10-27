const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  day: { type: Number, required: [true, 'Day is required'] },
  month: { type: String, required: [true, 'Month is required'], trim: true },
  tag: { type: String, required: [true, 'Tag is required'], trim: true },
  tagClass: { type: String, required: [true, 'Tag class is required'], trim: true },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'] },
}, {
  timestamps: true,
  index: {
    // Index on month for date-based filtering
    'createdAt': 1,
    'month': 1,
    'tag': 1,
    'tagClass': 1,
    'title': 1,
    'createdAt': 1
  }
});

module.exports = mongoose.model('Announcement', announcementSchema);
