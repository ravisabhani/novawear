import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 */
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/novawear';

    if (!mongoURI) {
      throw new Error('Missing MongoDB connection string. Set MONGODB_URI in your .env file.');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Exit process if database connection fails
    process.exit(1);
  }
};

export default connectDB;

