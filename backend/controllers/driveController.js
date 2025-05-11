const Drive = require('../models/drives');

exports.getAllDrives = async (req, res) => {
  const drives = await Drive.find();
  res.json(drives);
};

exports.createDrive = async (req, res) => {
  const { vaccineName, date, dosesAvailable, grades } = req.body;
  const driveDate = new Date(date);
  const now = new Date();

  if ((driveDate - now) / (1000 * 60 * 60 * 24) < 15) {
    return res.status(400).json({ error: "Drives must be scheduled at least 15 days in advance." });
  }

  const overlap = await Drive.findOne({
    date: driveDate,
    grades: { $in: grades }
  });

  if (overlap) {
    return res.status(400).json({ error: "Overlapping drive already exists for one of the grades." });
  }

  const newDrive = new Drive({ vaccineName, date: driveDate, dosesAvailable, grades });
  await newDrive.save();
  res.status(201).json(newDrive);
};

exports.updateDrive = async (req, res) => {
  const drive = await Drive.findById(req.params.id);
  const now = new Date();

  if (new Date(drive.date) <= now) {
    return res.status(400).json({ error: "Cannot edit past drives." });
  }

  // Recheck overlap if date or grades change
  const { date, grades } = req.body;
  if (date && grades) {
    const overlap = await Drive.findOne({
      _id: { $ne: req.params.id },
      date: new Date(date),
      grades: { $in: grades }
    });
    if (overlap) {
      return res.status(400).json({ error: "Overlapping drive exists." });
    }
  }

  Object.assign(drive, req.body);
  await drive.save();
  res.json(drive);
};