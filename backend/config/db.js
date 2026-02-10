const mongoose = require('mongoose');

async function connect() {
  const uri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/watezero';
  try {
    // mongoose v6+ doesn't require useNewUrlParser/useUnifiedTopology options
    // connect with default options
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = { connect };
