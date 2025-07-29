const { Resend } = require('resend');
const logger = require('../utils/logger');
const config = require('../config/config');

const resend = new Resend(process.env.RESEND_API_KEY);

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
    logger.error(`Error sending welcome email: ${err.message}`);
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
    logger.error(`Error sending password reset email: ${err.message}`);
    throw new Error('Failed to send password reset email');
  }
};

exports.sendAppointmentConfirmation = async (email, patientName, doctorName, date, timeSlot) => {
  try {
    await resend.emails.send({
      from: config.emailFrom,
      to: email,
      subject: 'Appointment Confirmed',
      html: `
        <h2>Appointment Confirmed</h2>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${timeSlot}</p>
      `,
    });
    logger.info(`Appointment confirmation sent to ${email}`);
  } catch (err) {
    logger.error(`Error sending appointment confirmation: ${err.message}`);
    throw new Error('Failed to send appointment confirmation');
  }
};

// Similar for other email functions (cancellation, etc.)