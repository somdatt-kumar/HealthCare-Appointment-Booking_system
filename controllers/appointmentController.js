const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const APIError = require('../utils/APIError');
const asyncHandler = require('../utils/asyncHandler');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const paymentService = require('../services/paymentService');

/**
 * @desc Create new appointment
 * @route POST /api/appointments
 * @access Private
 */
exports.createAppointment = asyncHandler(async (req, res, next) => {
  const { doctorId, date, timeSlot, reason } = req.body;

  // Check if doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new APIError(404, 'Doctor not found');
  }

  // Check if patient exists
  const patient = await Patient.findOne({ user: req.user.id });
  if (!patient) {
    throw new APIError(404, 'Patient profile not found');
  }

  // Check if slot is available
  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date,
    timeSlot,
    status: { $in: ['confirmed', 'pending'] }
  });

  if (existingAppointment) {
    throw new APIError(400, 'Time slot already booked');
  }

  // Create payment intent
  const paymentIntent = await paymentService.createPaymentIntent(doctor.fees);

  // Create appointment
  const appointment = new Appointment({
    doctor: doctorId,
    patient: patient._id,
    date,
    timeSlot,
    reason,
    status: 'pending',
    paymentIntentId: paymentIntent.id,
    amount: doctor.fees
  });

  await appointment.save();

  // Send notifications
  await emailService.sendAppointmentConfirmation(
    req.user.email,
    req.user.name,
    doctor.user.name,
    date,
    timeSlot
  );

  await smsService.sendAppointmentSMS(
    req.user.phone,
    `Your appointment with Dr. ${doctor.user.name} is scheduled for ${date} at ${timeSlot}`
  );

  res.status(201).json({
    success: true,
    data: appointment,
    clientSecret: paymentIntent.client_secret
  });
});

/**
 * @desc Get all appointments
 * @route GET /api/appointments
 * @access Private
 */
exports.getAppointments = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user.id });
    query.patient = patient._id;
  } else if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user.id });
    query.doctor = doctor._id;
  }

  const appointments = await Appointment.find(query)
    .populate('doctor', 'user specialties')
    .populate('patient', 'user')
    .populate('doctor.user', 'name')
    .populate('patient.user', 'name')
    .sort({ date: 1, timeSlot: 1 });

  res.json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

/**
 * @desc Get single appointment
 * @route GET /api/appointments/:id
 * @access Private
 */
exports.getAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('doctor', 'user specialties')
    .populate('patient', 'user')
    .populate('doctor.user', 'name email')
    .populate('patient.user', 'name email');

  if (!appointment) {
    throw new APIError(404, 'Appointment not found');
  }

  // Check if user is authorized to view this appointment
  if (req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user.id });
    if (appointment.patient._id.toString() !== patient._id.toString()) {
      throw new APIError(401, 'Not authorized to view this appointment');
    }
  } else if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (appointment.doctor._id.toString() !== doctor._id.toString()) {
      throw new APIError(401, 'Not authorized to view this appointment');
    }
  } else if (req.user.role !== 'admin') {
    throw new APIError(401, 'Not authorized to view this appointment');
  }

  res.json({
    success: true,
    data: appointment
  });
});

/**
 * @desc Update appointment status
 * @route PUT /api/appointments/:id/status
 * @access Private/Doctor
 */
exports.updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw new APIError(404, 'Appointment not found');
  }

  // Check if user is the doctor for this appointment
  const doctor = await Doctor.findOne({ user: req.user.id });
  if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
    throw new APIError(401, 'Not authorized to update this appointment');
  }

  // Validate status transition
  if (
    (appointment.status === 'pending' && status !== 'confirmed') ||
    (appointment.status === 'confirmed' && status !== 'completed') ||
    appointment.status === 'cancelled' ||
    appointment.status === 'completed'
  ) {
    throw new APIError(400, 'Invalid status transition');
  }

  appointment.status = status;
  await appointment.save();

  // Send notification to patient
  if (status === 'confirmed') {
    const patient = await Patient.findById(appointment.patient)
      .populate('user', 'email phone');
    
    await emailService.sendAppointmentConfirmation(
      patient.user.email,
      patient.user.name,
      req.user.name,
      appointment.date,
      appointment.timeSlot
    );

    await smsService.sendAppointmentSMS(
      patient.user.phone,
      `Your appointment with Dr. ${req.user.name} has been confirmed for ${appointment.date} at ${appointment.timeSlot}`
    );
  }

  res.json({
    success: true,
    data: appointment
  });
});

/**
 * @desc Cancel appointment
 * @route PUT /api/appointments/:id/cancel
 * @access Private/Patient
 */
exports.cancelAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw new APIError(404, 'Appointment not found');
  }

  // Check if user is the patient for this appointment
  const patient = await Patient.findOne({ user: req.user.id });
  if (!patient || appointment.patient.toString() !== patient._id.toString()) {
    throw new APIError(401, 'Not authorized to cancel this appointment');
  }

  // Check if appointment can be cancelled
  if (appointment.status !== 'pending' && appointment.status !== 'confirmed') {
    throw new APIError(400, 'Appointment cannot be cancelled');
  }

  // Check if it's too close to appointment time
  const now = new Date();
  const appointmentDate = new Date(appointment.date);
  const timeDiff = appointmentDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff < 24) {
    throw new APIError(400, 'Appointments can only be cancelled at least 24 hours in advance');
  }

  appointment.status = 'cancelled';
  await appointment.save();

  // Refund payment if already paid
  if (appointment.paymentStatus === 'paid') {
    await paymentService.createRefund(appointment.paymentIntentId);
  }

  // Send notification to doctor
  const doctor = await Doctor.findById(appointment.doctor)
    .populate('user', 'email phone');

  await emailService.sendAppointmentCancellation(
    doctor.user.email,
    patient.user.name,
    doctor.user.name,
    appointment.date,
    appointment.timeSlot
  );

  await smsService.sendAppointmentSMS(
    doctor.user.phone,
    `Appointment with ${patient.user.name} on ${appointment.date} at ${appointment.timeSlot} has been cancelled`
  );

  res.json({
    success: true,
    data: appointment
  });
});

/**
 * @desc Complete payment for appointment
 * @route POST /api/appointments/:id/payment
 * @access Private
 */
exports.completePayment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw new APIError(404, 'Appointment not found');
  }

  // Check if user is the patient for this appointment
  const patient = await Patient.findOne({ user: req.user.id });
  if (!patient || appointment.patient.toString() !== patient._id.toString()) {
    throw new APIError(401, 'Not authorized to pay for this appointment');
  }

  // Check if payment is needed
  if (appointment.paymentStatus === 'paid') {
    throw new APIError(400, 'Appointment already paid');
  }

  const { paymentMethodId } = req.body;

  // Confirm payment
  const payment = await paymentService.confirmPayment(
    appointment.paymentIntentId,
    paymentMethodId
  );

  appointment.paymentStatus = 'paid';
  appointment.paymentDate = new Date();
  await appointment.save();

  res.json({
    success: true,
    data: appointment
  });
});