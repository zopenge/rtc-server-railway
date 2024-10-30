const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // get mongodb url from railway environment variable
    const mongoUrl = process.env.MONGODB_URL;
    
    if (!mongoUrl) {
      throw new Error('MONGODB_URL environment variable is not defined');
    }

    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB; 