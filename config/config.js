require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
  mongoUri: process.env.MONGODB_URI || 
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' + 
    (process.env.MONGO_PORT || '27017') + '/hospital-booking',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.RESEND_EMAIL_FROM || 'no-reply@hospitalbooking.com',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};

module.exports = config;