const mongoose = require('mongoose');

const homeStatisticsSchema = new mongoose.Schema({
  students: { type: Number, required: [true, 'Students count is required'] },
  faculty: { type: Number, required: [true, 'Faculty count is required'] },
  programs: { type: Number, required: [true, 'Programs count is required'] },
}, { timestamps: true });

module.exports = mongoose.model('HomeStatistics', homeStatisticsSchema);
