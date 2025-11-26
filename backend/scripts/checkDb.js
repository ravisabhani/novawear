#!/usr/bin/env node
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';

dotenv.config();

const ALLOW_WRITE = process.env.ALLOW_DB_WRITE === 'true';

const run = async () => {
  console.log('Running DB check script');

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Aborting.');
    process.exit(2);
  }

  try {
    await connectDB();

    // Show basic connection state
    const state = mongoose.connection.readyState; // 1 = connected
    console.log('Mongoose readyState:', state);

    // If allowed, write a small test document into a diagnostics collection
    if (ALLOW_WRITE) {
      const diagSchema = new mongoose.Schema({ key: String, createdAt: { type: Date, default: Date.now } });
      const Diag = mongoose.model('Diag', diagSchema);

      const doc = await Diag.create({ key: 'db-check-' + Date.now() });
      console.log('Wrote test document:', doc._id.toString());
      await Diag.deleteOne({ _id: doc._id });
      console.log('Cleaned up test document');
    } else {
      console.log('ALLOW_DB_WRITE is not set => no write performed. Set ALLOW_DB_WRITE=true to create a sample document.');
    }

    // Close connection
    await mongoose.disconnect();

    console.log('DB check completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('DB check failed:', err);
    process.exit(1);
  }
};

run();
