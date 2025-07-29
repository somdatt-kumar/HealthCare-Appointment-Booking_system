const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add appointment date']
  },
  timeSlot: {
    type: String,
    required: [true, 'Please add time slot']
  },
  reason: {
    type: String,
    required: [true, 'Please add reason for appointment']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  paymentIntentId: {
    type: String
  },
  amount: {
    type: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate appointments
AppointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 }, { unique: true });

// Populate with doctor and patient on find
AppointmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'doctor',
    select: 'user specialties',
    populate: {
      path: 'user',
      select: 'name'
    }
  }).populate({
    path: 'patient',
    select: 'user',
    populate: {
      path: 'user',
      select: 'name'
    }
  });
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);