const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');
const { validateDoctorProfile, validateAvailability } = require('../middleware/validation');

// Public routes
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctor);
router.get('/:id/availability', doctorController.getAvailability);
router.get('/:id/slots', doctorController.getAvailableSlots);

// Protected routes
router.use(protect);

// Doctor and admin routes
router.post('/', authorize('admin'), validateDoctorProfile, doctorController.createDoctor);
router.put('/:id', authorize('doctor', 'admin'), validateDoctorProfile, doctorController.updateDoctor);
router.delete('/:id', authorize('admin'), doctorController.deleteDoctor);

// Doctor-only routes
router.post('/:id/availability', authorize('doctor'), validateAvailability, doctorController.addAvailability);

module.exports = router;