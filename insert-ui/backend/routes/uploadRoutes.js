// backend/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../services/cloudinary');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

// Profile picture
router.post('/profile-picture', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await uploadFile(req.file.buffer, 'profile-pictures');
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Payslip
router.post('/payslip', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await uploadFile(req.file.buffer, 'payslips');
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Payslip upload error:', error);
    res.status(500).json({ error: 'Failed to upload payslip' });
  }
});

// Agreement
router.post('/agreement', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await uploadFile(req.file.buffer, 'agreements');
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Agreement upload error:', error);
    res.status(500).json({ error: 'Failed to upload agreement' });
  }
});

// Schedule
router.post('/schedule', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await uploadFile(req.file.buffer, 'schedules');
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Schedule upload error:', error);
    res.status(500).json({ error: 'Failed to upload schedule' });
  }
});

// Bank Statement
router.post('/bank-statement', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const result = await uploadFile(req.file.buffer, 'bank-statements');
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Bank statement upload error:', error);
    res.status(500).json({ error: 'Failed to upload bank statement' });
  }
});

module.exports = router;