const jwt = require('jsonwebtoken');
const User = require('../models/User');
const APIError = require('../utils/APIError');
const config = require('../config/config');

// Generate JWT token
exports.generateToken = (userId, role) => {
  return jwt.sign({ sub: userId, role }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

// Verify JWT token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    throw new APIError(401, 'Invalid or expired token');
  }
};

// Check if email is already registered
exports.checkEmailExists = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
};

// Validate user credentials
exports.validateCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new APIError(401, 'Incorrect email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new APIError(401, 'Incorrect email or password');
  }

  return user;
};

// Create new user
exports.createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

// Get user by ID
exports.getUserById = async (userId) => {
  return await User.findById(userId).select('-password');
};

// Update user password
exports.updatePassword = async (userId, newPassword) => {
  const user = await User.findById(userId).select('+password');
  user.password = newPassword;
  await user.save();
  return user;
};