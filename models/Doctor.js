const mongoose = require('mongoose');

const SpecialtySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a specialty name']
  },
  description: {
    type: String
  }
});

const EducationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: [true, 'Please add a degree']
  },
  university: {
    type: String,
    required: [true, 'Please add a university']
  },
  year: {
    type: Number,
    required: [true, 'Please add a graduation year']
  }
});

const ExperienceSchema = new mongoose.Schema({
  position: {
    type: String,
    required: [true, 'Please add a position']
  },
  hospital: {
    type: String,
    required: [true, 'Please add a hospital']
  },
  from: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  }
});

const ReviewSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  comment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialties: [SpecialtySchema],
  education: [EducationSchema],
  experience: [ExperienceSchema],
  fees: {
    type: Number,
    required: [true, 'Please add consultation fees']
  },
  reviews: [ReviewSchema],
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5'],
    set: val => Math.round(val * 10) / 10
  },
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average rating
DoctorSchema.statics.getAverageRating = async function(doctorId) {
  const obj = await this.aggregate([
    {
      $match: { _id: doctorId }
    },
    {
      $unwind: '$reviews'
    },
    {
      $group: {
        _id: '$reviews.patient',
        averageRating: { $avg: '$reviews.rating' }
      }
    }
  ]);

  try {
    await this.model('Doctor').findByIdAndUpdate(doctorId, {
      averageRating: obj[0] ? obj[0].averageRating : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
DoctorSchema.post('save', function() {
  this.constructor.getAverageRating(this._id);
});

// Call getAverageRating after remove
DoctorSchema.post('remove', function() {
  this.constructor.getAverageRating(this._id);
});

module.exports = mongoose.model('Doctor', DoctorSchema);