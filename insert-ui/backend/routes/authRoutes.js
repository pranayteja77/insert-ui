// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Import the database connection pool

const router = express.Router();

// Helper function to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// REGISTER USER
// backend/routes/authRoutes.js
router.post('/register', async (req, res) => {
  const { full_name, email, phone, aadhaar_number, pan_card_number, password } = req.body;
  
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, aadhaar_number, pan_card_number, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, full_name, email, phone, aadhaar_number, pan_card_number, profile_picture_url`,
      [full_name, email, phone, aadhaar_number, pan_card_number, passwordHash]
    );
    
    // Generate JWT token
    const token = jwt.sign(
    { id: result.rows[0].id }, // ✅ Use 'id' instead of 'userId'
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
    )
    
    res.json({ user: result.rows[0], token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN USER
// backend/routes/authRoutes.js
// backend/routes/authRoutes.js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // ✅ Select password_hash along with other fields
    const result = await pool.query(
      'SELECT id, full_name, email, phone, aadhaar_number, pan_card_number, profile_picture_url, password_hash FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // ✅ Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
    { id: user.id }, // ✅ Use 'id' instead of 'userId'
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
    );
    
    // ✅ Add avatar field for frontend compatibility
    const userWithAvatar = {
      ...user,
      avatar: user.profile_picture_url // Map profile_picture_url to avatar
    };
    
    res.json({ user: userWithAvatar, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// FORGOT PASSWORD (Simplified - You'd typically send an email/OTP)
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // In a real app, you would:
        // 1. Generate a unique reset token.
        // 2. Store it in the database with an expiration time.
        // 3. Send an email with a link containing the token to the user.
        // 4. The frontend would then use this token to reset the password.

        // For now, we'll just simulate success.
        res.json({ message: 'Password reset instructions sent to your email.' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;