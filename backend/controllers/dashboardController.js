const Student = require('../models/students');
const Drive = require('../models/drives');

exports.getSummary = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const vaccinatedStudents = await Student.countDocuments({ vaccinations: { $exists: true, $ne: [] } });

    const vaccinationRate = totalStudents > 0
      ? ((vaccinatedStudents / totalStudents) * 100).toFixed(2)
      : '0.00';

    const now = new Date();
    const upcomingDrives = await Drive.find({
      date: {
        $gte: now,
        $lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      totalStudents,
      vaccinatedStudents,
      vaccinationRate,
      upcomingDrives
    });
  } catch (err) {
    res.status(500).json({ error: 'Dashboard summary error', details: err.message });
  }
};