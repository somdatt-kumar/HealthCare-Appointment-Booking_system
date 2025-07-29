const APIError = require('../utils/APIError');

// Check if user has permission to access resource
exports.checkPermission = (resourceType) => {
  return async (req, res, next) => {
    try {
      // Admin can access anything
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user is accessing their own resource
      let resource;
      switch (resourceType) {
        case 'doctor':
          resource = await Doctor.findById(req.params.id);
          if (!resource) {
            throw new APIError(404, 'Doctor not found');
          }
          if (resource.user.toString() !== req.user.id) {
            throw new APIError(403, 'Not authorized to access this doctor');
          }
          break;
        case 'patient':
          resource = await Patient.findById(req.params.id);
          if (!resource) {
            throw new APIError(404, 'Patient not found');
          }
          if (resource.user.toString() !== req.user.id) {
            throw new APIError(403, 'Not authorized to access this patient');
          }
          break;
        case 'appointment':
          resource = await Appointment.findById(req.params.id);
          if (!resource) {
            throw new APIError(404, 'Appointment not found');
          }
          
          const doctor = await Doctor.findOne({ user: req.user.id });
          const patient = await Patient.findOne({ user: req.user.id });
          
          if (
            (req.user.role === 'doctor' && resource.doctor.toString() !== doctor._id.toString()) ||
            (req.user.role === 'patient' && resource.patient.toString() !== patient._id.toString())
          ) {
            throw new APIError(403, 'Not authorized to access this appointment');
          }
          break;
        default:
          throw new APIError(400, 'Invalid resource type');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};