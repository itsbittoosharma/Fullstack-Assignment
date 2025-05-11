const mongoose = require('mongoose');

const DriveSchema = new mongoose.Schema({
  vaccineName: String,
  date: Date,
  dosesAvailable: Number,
  grades: [String] // e.g., ['Grade 5', 'Grade 6']
});

module.exports = mongoose.model('Drive', DriveSchema);