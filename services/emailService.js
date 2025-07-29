const { Resend } = require('resend');
const logger = require('../utils/logger');
const config = require('../config/config');

const resend = new Resend(config.resendApiKey);

exports.sendWelcomeEmail = async (email, name) => {
  try {
    await resend.emails.send({
      from: config.emailFrom,
      to: email,
      subject: 'Welcome to Hospital Booking System',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Your account has been successfully created.</p>
        <p>Start booking appointments with our doctors today!</p>
      `,
    });
    logger.info(`Welcome email sent to ${email}`);
  } catch (err) {
    logger.error(`Resend failed: ${err.message}`);
    throw new Error('Failed to send welcome email');
  }
};

exports.sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    await resend.emails.send({
      from: config.emailFrom,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset. Click below to proceed:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>Link expires in 10 minutes.</p>
      `,
    });
    logger.info(`Password reset email sent to ${email}`);
  } catch (err) {
    logger.error(`Resend failed: ${err.message}`);
    throw new Error('Failed to send password reset email');
  }
};

// Similar updates for other email functions...