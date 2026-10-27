const mongoose = require('mongoose');

const aboutStatsSchema = new mongoose.Schema({
  experience: { type: String, required: [true, 'Experience is required'], trim: true },
  teams: { type: String, required: [true, 'Teams count is required'], trim: true },
  countries: { type: String, required: [true, 'Countries count is required'], trim: true },
  uptime: { type: String, required: [true, 'Uptime is required'], trim: true },
}, { timestamps: true });

module.exports = mongoose.model('AboutStatistics', aboutStatsSchema);
