const Joi = require('joi');
const APIError = require('../utils/APIError');

// Validation middleware
exports.validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw new APIError(400, errorMessages.join(', '));
    }
    
    next();
  };
};

// Schemas
exports.validationSchemas = {
  register: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('patient', 'doctor').required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),
  
  resetPassword: Joi.object({
    password: Joi.string().min(6).required()
  }),
  
  doctorProfile: Joi.object({
    specialties: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow('')
      })
    ).required(),
    education: Joi.array().items(
      Joi.object({
        degree: Joi.string().required(),
        university: Joi.string().required(),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required()
      })
    ).required(),
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
    ).required(),
    fees: Joi.number().min(0).required()
  }),
  
  availability: Joi.object({
    day: Joi.number().integer().min(0).max(6).required(),
    startTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    endTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    slotDuration: Joi.number().integer().min(15).max(60).required()
  }),
  
  appointment: Joi.object({
    doctorId: Joi.string().hex().length(24).required(),
    date: Joi.date().min('now').required(),
    timeSlot: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    reason: Joi.string().required()
  }),
  
  patientProfile: Joi.object({
    phone: Joi.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).required(),
    address: Joi.string().required(),
    dateOfBirth: Joi.date().max('now').required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
    allergies: Joi.array().items(Joi.string())
  }),
  
  payment: Joi.object({
    paymentMethodId: Joi.string().required()
  })
};

// Middleware exports
exports.validateRegister = this.validate(this.validationSchemas.register, 'body');
exports.validateLogin = this.validate(this.validationSchemas.login, 'body');
exports.validateForgotPassword = this.validate(this.validationSchemas.forgotPassword, 'body');
exports.validateResetPassword = this.validate(this.validationSchemas.resetPassword, 'body');
exports.validateDoctorProfile = this.validate(this.validationSchemas.doctorProfile, 'body');
exports.validateAvailability = this.validate(this.validationSchemas.availability, 'body');
exports.validateAppointment = this.validate(this.validationSchemas.appointment, 'body');
exports.validatePatientProfile = this.validate(this.validationSchemas.patientProfile, 'body');
exports.validatePayment = this.validate(this.validationSchemas.payment, 'body');