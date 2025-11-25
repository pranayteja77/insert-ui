// backend/routes/profileRoutes.js
const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.put('/profile', authMiddleware, async (req, res) => {
  console.log('Profile update request:', req.body);
  
  const { 
    full_name, 
    phone, 
    aadhaar_number, 
    pan_card_number, 
    profile_picture_url 
  } = req.body;
  
  try {
    // Validate required fields
    if (!full_name) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    
    const result = await pool.query(
      `UPDATE users 
       SET full_name = $1, 
           phone = $2, 
           aadhaar_number = $3, 
           pan_card_number = $4, 
           profile_picture_url = $5, 
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, full_name, email, phone, aadhaar_number, pan_card_number, profile_picture_url`,
      [full_name, phone, aadhaar_number, pan_card_number, profile_picture_url, req.user.id]
    );

    console.log('Database update result:', result.rows[0]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;