const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');
const { validatePatientProfile } = require('../middleware/validation');

// All routes require authentication
router.use(protect);

router.get('/', authorize('admin'), patientController.getPatients);
router.get('/:id', patientController.getPatient);
router.post('/', validatePatientProfile, patientController.createPatient);
router.put('/:id', validatePatientProfile, patientController.updatePatient);
router.post('/:id/documents', patientController.uploadDocuments);

module.exports = router;