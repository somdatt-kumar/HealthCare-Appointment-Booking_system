const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../config/rateLimiter');

// Apply rate limiting to all routes
router.use(apiLimiter);

// Route files
const authRoutes = require('./authRoutes');
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const patientRoutes = require('./patientRoutes');
const adminRoutes = require('./adminRoutes');

// Mount routers
router.use('/api/auth', authRoutes);
router.use('/api/doctors', doctorRoutes);
router.use('/api/appointments', appointmentRoutes);
router.use('/api/patients', patientRoutes);
router.use('/api/admin', adminRoutes);

module.exports = router;  