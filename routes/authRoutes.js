const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../config/rateLimiter');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);
router.put('/reset-password/:token', validateResetPassword, authController.resetPassword);

// Private routes (require authentication)
router.get('/me', authController.getMe);

module.exports = router;