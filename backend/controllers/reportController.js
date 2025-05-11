const Student = require('../models/students');
const { Parser } = require('json2csv');

exports.getVaccinationReport = async (req, res) => {
  const { vaccineName, class: classFilter, status = 'all', page = 1, limit = 10 } = req.query;
  const filter = {};

  if (classFilter) filter.class = classFilter;
  if (status === 'vaccinated') filter.vaccinations = { $exists: true, $ne: [] };
  if (status === 'not_vaccinated') filter.vaccinations = { $eq: [] };

  let students = await Student.find(filter);

  if (vaccineName) {
    students = students.filter(s =>
      s.vaccinations.some(v => v.vaccineName === vaccineName)
    );
  }

  const start = (page - 1) * limit;
  const paginated = students.slice(start, start + parseInt(limit));

  res.json({
    data: paginated,
    total: students.length,
    page: parseInt(page),
    pages: Math.ceil(students.length / limit)
  });
};

exports.downloadVaccinationReport = async (req, res) => {
  const students = await Student.find();

  const reportData = students.map(student => ({
    name: student.name,
    class: student.class,
    studentId: student.studentId,
    vaccinations: student.vaccinations.map(v => `${v.vaccineName} (${v.date.toISOString().split('T')[0]})`).join(', ')
  }));

  const fields = ['name', 'class', 'studentId', 'vaccinations'];
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(reportData);

  res.header('Content-Type', 'text/csv');
  res.attachment('vaccination_report.csv');
  res.send(csv);
};