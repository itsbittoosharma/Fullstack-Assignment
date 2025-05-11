const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/bulk-upload', upload.single('file'), studentController.bulkUpload);
// CRUD
router.get('/', studentController.getAllStudents);
router.post('/', studentController.addStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

// Vaccination update
router.post('/:id/vaccinate', studentController.markVaccinated);

module.exports = router;