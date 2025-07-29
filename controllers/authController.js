const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const User = require('../models/User');
const APIError = require('../utils/APIError');
const asyncHandler = require('../utils/asyncHandler');
const config = require('../config/config');
const emailService = require('../services/emailService');

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, name, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new APIError(400, 'Email already in use');
  }

  // Create new user
  const user = new User({
    email,
    password,
    name,
    role
  });

  await user.save();

  // Generate JWT token
  const token = jwt.sign({ sub: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: '7d'
  });

  // Send welcome email
  await emailService.sendWelcomeEmail(user.email, user.name);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError(401, 'Incorrect email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new APIError(401, 'Incorrect email or password');
  }

  const token = jwt.sign({ sub: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: '7d'
  });

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * @desc Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (!user) {
    throw new APIError(404, 'User not found');
  }

  res.json({
    success: true,
    user
  });
});

/**
 * @desc Forgot password - send reset email
 * @route POST /api/auth/forgot-password
 * @access Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError(404, 'No account with that email exists');
  }

  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;

  try {
    await emailService.sendPasswordResetEmail(user.email, resetUrl);
    res.json({ success: true, message: 'Email sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new APIError(500, 'Email could not be sent');
  }
});

/**
 * @desc Reset password
 * @route PUT /api/auth/reset-password/:token
 * @access Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new APIError(400, 'Invalid or expired token');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});