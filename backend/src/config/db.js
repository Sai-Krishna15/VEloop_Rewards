// src/config/db.js
const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas.
 * Exits the process if the initial connection fails so the server never
 * silently runs without a DB.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('[DB] MONGO_URI is not set in environment. Exiting.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('[DB] Connected to MongoDB Atlas');
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
