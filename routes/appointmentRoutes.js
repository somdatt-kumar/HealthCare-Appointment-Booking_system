const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

router.use(protect); // Protect all routes below

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointment);
router.put('/:id/status', authorize('doctor'), appointmentController.updateAppointmentStatus);
router.put('/:id/cancel', authorize('patient'), appointmentController.cancelAppointment);

module.exports = router;