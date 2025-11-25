// backend/services/otpService.js
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email OTP
const sendEmailOTP = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: 'inserthelp@outlook.com', // Must match your verified sender
      subject: 'Your In$€₹T Verification Code',
      text: `Your verification code is: ${otp}. Valid for 5 minutes.`,
      html: `<p>Your In$€₹T verification code is: <strong>${otp}</strong></p><p>Valid for 5 minutes.</p>`
    };
    
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Email OTP error:', error);
    throw new Error('Failed to send email OTP');
  }
};

module.exports = { generateOTP, sendEmailOTP };