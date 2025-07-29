const Patient = require('../models/Patient');
const User = require('../models/User');
const APIError = require('../utils/APIError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc Get all patients (admin only)
 * @route GET /api/patients
 * @access Private/Admin
 */
exports.getPatients = asyncHandler(async (req, res, next) => {
  const patients = await Patient.find()
    .populate('user', 'name email')
    .select('-__v');

  res.json({
    success: true,
    count: patients.length,
    data: patients
  });
});

/**
 * @desc Get single patient
 * @route GET /api/patients/:id
 * @access Private
 */
exports.getPatient = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id)
    .populate('user', 'name email')
    .select('-__v');

  if (!patient) {
    throw new APIError(404, 'Patient not found');
  }

  // Check if user is authorized to view this patient
  if (req.user.role !== 'admin' && patient.user._id.toString() !== req.user.id) {
    throw new APIError(401, 'Not authorized to view this patient');
  }

  res.json({
    success: true,
    data: patient
  });
});

/**
 * @desc Create patient profile
 * @route POST /api/patients
 * @access Private
 */
exports.createPatient = asyncHandler(async (req, res, next) => {
  const { phone, address, dateOfBirth, gender, bloodGroup, allergies } = req.body;

  // Check if user already has a patient profile
  const existingPatient = await Patient.findOne({ user: req.user.id });
  if (existingPatient) {
    throw new APIError(400, 'Patient profile already exists');
  }

  const patient = new Patient({
    user: req.user.id,
    phone,
    address,
    dateOfBirth,
    gender,
    bloodGroup,
    allergies
  });

  await patient.save();

  res.status(201).json({
    success: true,
    data: patient
  });
});

/**
 * @desc Update patient profile
 * @route PUT /api/patients/:id
 * @access Private
 */
exports.updatePatient = asyncHandler(async (req, res, next) => {
  let patient = await Patient.findById(req.params.id);

  if (!patient) {
    throw new APIError(404, 'Patient not found');
  }

  // Make sure user is patient owner or admin
  if (patient.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new APIError(401, 'Not authorized to update this patient');
  }

  patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: patient
  });
});

/**
 * @desc Upload patient documents
 * @route POST /api/patients/:id/documents
 * @access Private
 */
exports.uploadDocuments = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    throw new APIError(404, 'Patient not found');
  }

  // Make sure user is patient owner or admin
  if (patient.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new APIError(401, 'Not authorized to upload documents');
  }

  if (!req.files) {
    throw new APIError(400, 'Please upload a file');
  }

  const file = req.files.file;

  // Check file type
  if (!file.mimetype.startsWith('image') && !file.mimetype.startsWith('application/pdf')) {
    throw new APIError(400, 'Please upload an image or PDF file');
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    throw new APIError(400, `Please upload a file less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`);
  }

  // Create custom filename
  file.name = `document_${patient._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/patients/${file.name}`, async err => {
    if (err) {
      console.error(err);
      throw new APIError(500, 'Problem with file upload');
    }

    await Patient.findByIdAndUpdate(req.params.id, {
      $push: { documents: file.name }
    });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});