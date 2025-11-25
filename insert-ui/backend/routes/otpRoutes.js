// backend/routes/otpRoutes.js
const express = require('express');
const pool = require('../db');
const { generateOTP, sendEmailOTP } = require('../services/otpService');
const router = express.Router();

// Send email OTP
router.post('/send-email-otp', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    // Save OTP to database
    await pool.query(
      `INSERT INTO otp_verifications (email, otp_code, expires_at) 
       VALUES ($1, $2, $3)`,
      [email, otp, expiresAt]
    );
    
    // Send email OTP
    await sendEmailOTP(email, otp);
    
    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Email OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT * FROM otp_verifications WHERE email = $1 AND otp_code = $2 AND expires_at > NOW()',
      [email, otp]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    
    // Mark as verified
    const otpId = result.rows[0].id;
    await pool.query(
      'UPDATE otp_verifications SET is_verified = true WHERE id = $1',
      [otpId]
    );
    
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

module.exports = router;