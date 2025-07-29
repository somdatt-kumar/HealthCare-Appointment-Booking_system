const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config/config');

exports.sendSMS = async (phone, message) => {
  try {
    // Format Indian numbers (+91XXXXXXXXXX → 91XXXXXXXXXX)
    const formattedPhone = phone.replace('+', '').replace(/\s/g, '');

    const response = await axios.get('https://api.textlocal.in/send/', {
      params: {
        apikey: config.textlocalApiKey,
        numbers: formattedPhone,
        message: message,
        sender: config.textlocalSender,
        test: config.env === 'development' ? 'true' : 'false' // Enable test mode in dev
      }
    });

    logger.info(`SMS sent to ${phone} via TextLocal: ${response.data.status}`);
    return response.data;
  } catch (err) {
    logger.error(`TextLocal SMS failed to ${phone}: ${err.response?.data || err.message}`);
    throw new Error('Failed to send SMS');
  }  
};

exports.sendAppointmentSMS = async (phone, message) => {
  // Prefix hospital branding
  const formattedMsg = `🏥 Hospital Booking:\n${message}`;
  return this.sendSMS(phone, formattedMsg);
};

