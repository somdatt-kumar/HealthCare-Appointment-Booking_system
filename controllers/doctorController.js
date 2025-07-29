const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Appointment = require('../models/Appointment');
const APIError = require('../utils/APIError');
const asyncHandler = require('../utils/asyncHandler');
const timeSlots = require('../utils/timeSlots');

/**
 * @desc Get all doctors
 * @route GET /api/doctors
 * @access Public
 */
exports.getDoctors = asyncHandler(async (req, res, next) => {
  const { specialty, search } = req.query;
  let query = {};

  if (specialty) {
    query.specialties = specialty;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { 'specialties.name': { $regex: search, $options: 'i' } }
    ];
  }

  const doctors = await Doctor.find(query)
    .populate('user', 'name email')
    .select('-__v');

  res.json({
    success: true,
    count: doctors.length,
    data: doctors
  });
});

/**
 * @desc Get single doctor
 * @route GET /api/doctors/:id
 * @access Public
 */
exports.getDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id)
    .populate('user', 'name email')
    .populate('reviews.patient', 'name')
    .select('-__v');

  if (!doctor) {
    throw new APIError(404, 'Doctor not found');
  }

  res.json({
    success: true,
    data: doctor
  });
});

/**
 * @desc Create doctor profile
 * @route POST /api/doctors
 * @access Private/Admin
 */
exports.createDoctor = asyncHandler(async (req, res, next) => {
  const { userId, specialties, education, experience, fees } = req.body;

  const user = await User.findById(userId);
  if (!user || user.role !== 'doctor') {
    throw new APIError(400, 'User is not a doctor or does not exist');
  }

  let doctor = await Doctor.findOne({ user: userId });
  if (doctor) {
    throw new APIError(400, 'Doctor profile already exists');
  }

  doctor = new Doctor({
    user: userId,
    specialties,
    education,
    experience,
    fees
  });

  await doctor.save();

  res.status(201).json({
    success: true,
    data: doctor
  });
});

/**
 * @desc Update doctor profile
 * @route PUT /api/doctors/:id
 * @access Private/Doctor
 */
exports.updateDoctor = asyncHandler(async (req, res, next) => {
  let doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    throw new APIError(404, 'Doctor not found');
  }

  // Make sure user is doctor owner or admin
  if (doctor.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new APIError(401, 'Not authorized to update this doctor');
  }

  doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: doctor
  });
});

/**
 * @desc Delete doctor profile
 * @route DELETE /api/doctors/:id
 * @access Private/Admin
 */
exports.deleteDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    throw new APIError(404, 'Doctor not found');
  }

  await doctor.remove();

  res.json({
    success: true,
    data: {}
  });
});

/**
 * @desc Add doctor availability
 * @route POST /api/doctors/:id/availability
 * @access Private/Doctor
 */
exports.addAvailability = asyncHandler(async (req, res, next) => {
  const { day, startTime, endTime, slotDuration } = req.body;

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    throw new APIError(404, 'Doctor not found');
  }

  // Check if the doctor owns the profile
  if (doctor.user.toString() !== req.user.id) {
    throw new APIError(401, 'Not authorized to add availability');
  }

  // Check if slot already exists for the day
  const existingSlot = await Schedule.findOne({
    doctor: req.params.id,
    day
  });

  if (existingSlot) {
    throw new APIError(400, 'Availability already exists for this day');
  }

  const schedule = new Schedule({
    doctor: req.params.id,
    day,
    startTime,
    endTime,
    slotDuration
  });

  await schedule.save();

  res.status(201).json({
    success: true,
    data: schedule
  });
});

/**
 * @desc Get doctor availability
 * @route GET /api/doctors/:id/availability
 * @access Public
 */
exports.getAvailability = asyncHandler(async (req, res, next) => {
  const availability = await Schedule.find({ doctor: req.params.id });

  res.json({
    success: true,
    count: availability.length,
    data: availability
  });
});

/**
 * @desc Get available time slots for a doctor on a specific date
 * @route GET /api/doctors/:id/slots
 * @access Public
 */
exports.getAvailableSlots = asyncHandler(async (req, res, next) => {
  const { date } = req.query;

  if (!date) {
    throw new APIError(400, 'Please provide a date');
  }

  const selectedDate = new Date(date);
  const day = selectedDate.getDay(); // 0 (Sunday) to 6 (Saturday)

  // Get doctor's schedule for the day
  const schedule = await Schedule.findOne({
    doctor: req.params.id,
    day
  });

  if (!schedule) {
    throw new APIError(400, 'Doctor not available on this day');
  }

  // Get existing appointments for the date
  const appointments = await Appointment.find({
    doctor: req.params.id,
    date: selectedDate,
    status: { $in: ['confirmed', 'pending'] }
  });

  // Generate all possible slots
  const allSlots = timeSlots.generateSlots(
    schedule.startTime,
    schedule.endTime,
    schedule.slotDuration
  );

  // Filter out booked slots
  const bookedSlots = appointments.map(app => app.timeSlot);
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

  res.json({
    success: true,
    data: availableSlots
  });
});