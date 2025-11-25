// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Use the DATABASE_URL from .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;