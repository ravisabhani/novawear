#!/usr/bin/env node
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';

dotenv.config();

const ALLOW_WRITE = process.env.ALLOW_DB_WRITE === 'true';

const run = async () => {
  console.log('Running sample data seeder');

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Aborting.');
    process.exit(2);
  }

  if (!ALLOW_WRITE) {
    console.error('ALLOW_DB_WRITE is not true. To write sample data, run with ALLOW_DB_WRITE=true');
    process.exit(2);
  }

  try {
    await connectDB();

    const productSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      image: String,
      category: String,
      countInStock: Number,
    }, { timestamps: true });

    const SampleProduct = mongoose.model('SampleProduct', productSchema);

    const doc = await SampleProduct.create({
      name: 'DB Check Tee',
      description: 'A sample product created to verify DB write access',
      price: 15.0,
      image: '/images/db-check.png',
      category: 'checks',
      countInStock: 10,
    });

    console.log('Created sample product id:', doc._id.toString());
    await mongoose.disconnect();
    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

run();
