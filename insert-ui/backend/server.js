// backend/server.js
const express = require('express');
const pool = require('./db'); // Import the database connection pool
const authRoutes = require('./routes/authRoutes');
const financialRoutes = require('./routes/financialRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const profileRoutes = require('./routes/profileRoutes');
const otpRoutes = require('./routes/otpRoutes');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS for production
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    process.env.FRONTEND_URL || 'https://insert-ui.vercel.app', // Production frontend
    (process.env.FRONTEND_URL || 'https://insert-ui.vercel.app').replace('https://', 'https://www.') // WWW version
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

const cors = require('cors');
app.use(cors(corsOptions));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/otp', otpRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('In$€₹T Backend is running!');
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Database connection successful!',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`CORS origins: ${corsOptions.origin.join(', ')}`);
});