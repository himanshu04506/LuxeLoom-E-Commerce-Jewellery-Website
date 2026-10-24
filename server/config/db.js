const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/luxeloom';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${mongoUri}.`);
    console.warn(`[Database Warning] Error: ${error.message}`);
    console.warn(`[Database Warning] Operating with graceful fallback mode.`);
  }
};

module.exports = connectDB;
