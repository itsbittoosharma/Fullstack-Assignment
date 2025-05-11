const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  vaccineName: String,
  date: Date,
  driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' }
});

const StudentSchema = new mongoose.Schema({
  name: String,
  class: String,
  studentId: { type: String, unique: true },
  vaccinations: [{
    vaccineName: String,
    date: Date,
    driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' }
  }]
});

module.exports = mongoose.model('Student', StudentSchema);