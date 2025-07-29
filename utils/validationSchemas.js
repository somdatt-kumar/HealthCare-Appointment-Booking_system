const Joi = require('joi');

module.exports = {
  // User validation schemas
  userRegister: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('patient', 'doctor').required()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    password: Joi.string().min(6).required()
  }),

  // Doctor validation schemas
  doctorCreate: Joi.object({
    userId: Joi.string().hex().length(24).required(),
    specialties: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow('')
      })
    ).min(1).required(),
    education: Joi.array().items(
      Joi.object({
        degree: Joi.string().required(),
        university: Joi.string().required(),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required()
      })
    ).min(1).required(),
    experience: Joi.array().items(
      Joi.object({
        position: Joi.string().required(),
        hospital: Joi.string().required(),
        from: Joi.date().required(),
        to: Joi.date().when('current', {
          is: true,
          then: Joi.forbidden(),
          otherwise: Joi.date().min(Joi.ref('from')).required()
        }),
        current: Joi.boolean(),
        description: Joi.string().allow('')
      })
    ).min(1).required(),
    fees: Joi.number().min(0).required()
  }),

  doctorAvailability: Joi.object({
    day: Joi.number().integer().min(0).max(6).required(),
    startTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    endTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    slotDuration: Joi.number().integer().min(15).max(60).required()
  }),

  // Appointment validation schemas
  appointmentCreate: Joi.object({
    doctorId: Joi.string().hex().length(24).required(),
    date: Joi.date().min('now').required(),
    timeSlot: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    reason: Joi.string().required()
  }),

  appointmentStatus: Joi.object({
    status: Joi.string().valid('confirmed', 'completed').required()
  }),

  // Patient validation schemas
  patientCreate: Joi.object({
    phone: Joi.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).required(),
    address: Joi.string().required(),
    dateOfBirth: Joi.date().max('now').required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
    allergies: Joi.array().items(Joi.string())
  }),

  // Payment validation schemas
  paymentCreate: Joi.object({
    paymentMethodId: Joi.string().required()
  })
};