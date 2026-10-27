const mongoose = require('mongoose');

const aboutStatisticsSchema = new mongoose.Schema({
  experience: { type: String, required: [true, 'Experience is required'] },
  teams: { type: String, required: [true, 'Teams are required'] },
  countries: { type: String, required: [true, 'Countries are required'] },
  uptime: { type: String, required: [true, 'Uptime is required'] },
}, { timestamps: true });

module.exports = mongoose.model('AboutStatistic', aboutStatisticsSchema);
