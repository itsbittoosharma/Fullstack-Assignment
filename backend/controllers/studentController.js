const Student = require('../models/students');
const Drive = require('../models/drives');

exports.getAllStudents = async (req, res) => {
  const { name, class: studentClass, studentId, status } = req.query;
  const filter = {};

  if (name) filter.name = new RegExp(name, 'i');
  if (studentClass) filter.class = studentClass;
  if (studentId) filter.studentId = studentId;
  if (status === 'vaccinated') filter.vaccinations = { $exists: true, $ne: [] };
  if (status === 'not_vaccinated') filter.vaccinations = { $eq: [] };

  const students = await Student.find(filter);
  res.json(students);
};

exports.addStudent = async (req, res) => {
  console.log('Received at backend:', req.body); // 👀 log incoming data
  const student = new Student(req.body);
  await student.save();
  res.status(201).json(student);
};

exports.updateStudent = async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

exports.markVaccinated = async (req, res) => {
  const { vaccineName, driveId } = req.body;
  const student = await Student.findById(req.params.id);

  const alreadyVaccinated = student.vaccinations.find(v => v.driveId.toString() === driveId && v.vaccineName === vaccineName);
  if (alreadyVaccinated) return res.status(400).json({ error: "Already vaccinated for this drive." });

  student.vaccinations.push({ vaccineName, driveId, date: new Date() });
  await student.save();
  res.json(student);
};

const fs = require('fs');
const csv = require('csv-parser');

exports.bulkUpload = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const formatted = results.map(row => ({
          name: row.name,
          class: row.class,
          studentId: row.studentId
        }));
        console.log(formatted)
        await Student.insertMany(formatted, { ordered: false });
        res.status(201).json({ message: `${formatted.length} students uploaded` });
      } catch (err) {
        res.status(400).json({ error: 'Error uploading CSV', details: err });
      }
    });
};