const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Please add a valid phone number'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add date of birth']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Please select gender']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Please select blood group']
  },
  allergies: {
    type: [String]
  },
  medicalHistory: [
    {
      condition: {
        type: String,
        required: [true, 'Please add medical condition']
      },
      diagnosedDate: {
        type: Date
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'resolved'],
        default: 'active'
      },
      notes: {
        type: String
      }
    }
  ],
  documents: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patient', PatientSchema);