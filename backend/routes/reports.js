const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/', reportController.getVaccinationReport);
router.get('/download', reportController.downloadVaccinationReport);

module.exports = router;