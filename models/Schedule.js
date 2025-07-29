const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    required: true
  },
  day: {
    type: Number,
    required: [true, 'Please add day of week (0-6)'],
    min: 0,
    max: 6
  },
  startTime: {
    type: String,
    required: [true, 'Please add start time (HH:MM)'],
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please add time in HH:MM format'
    ]
  },
  endTime: {
    type: String,
    required: [true, 'Please add end time (HH:MM)'],
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please add time in HH:MM format'
    ]
  },
  slotDuration: {
    type: Number,
    required: [true, 'Please add slot duration in minutes'],
    min: [15, 'Minimum slot duration is 15 minutes'],
    max: [60, 'Maximum slot duration is 60 minutes']
  }
});

// Prevent duplicate schedules for same doctor and day
ScheduleSchema.index({ doctor: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);