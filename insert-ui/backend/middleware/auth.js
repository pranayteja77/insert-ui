// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ✅ This should match your JWT payload
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;