import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const exampleProducts = [
  {
    name: 'Seeder Tee',
    description: 'A sample product added by the safe seeder endpoint',
    price: 19.99,
    image: '/images/sample-seed.png',
    category: 'sample',
    countInStock: 50,
  },
];

export const seedProducts = async (req, res) => {
  if (process.env.ALLOW_DB_WRITE !== 'true') {
    return res.status(403).json({ success: false, message: 'DB writes are disabled on this server' });
  }

  const seedSecret = req.headers['x-seed-secret'] || req.body?.seedSecret;
  if (!process.env.SEED_SECRET || seedSecret !== process.env.SEED_SECRET) {
    return res.status(401).json({ success: false, message: 'Missing or invalid seed secret' });
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/novawear';

    // Reuse mongoose connection for simple scripts
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI);
    }

    // Insert example products (don't delete existing products by default)
    const inserted = await Product.insertMany(exampleProducts);

    return res.status(201).json({ success: true, message: `Inserted ${inserted.length} sample products`, data: inserted });
  } catch (err) {
    console.error('Seed failed:', err);
    return res.status(500).json({ success: false, message: 'Seeding failed', error: err.message });
  }
};

export const seedSample = async (req, res) => {
  // Same protection as seedProducts — can be expanded to insert larger datasets
  if (process.env.ALLOW_DB_WRITE !== 'true') {
    return res.status(403).json({ success: false, message: 'DB writes are disabled on this server' });
  }

  const seedSecret = req.headers['x-seed-secret'] || req.body?.seedSecret;
  if (!process.env.SEED_SECRET || seedSecret !== process.env.SEED_SECRET) {
    return res.status(401).json({ success: false, message: 'Missing or invalid seed secret' });
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/novawear';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI);
    }

    const doc = await Product.create({
      name: 'DB Check Tee',
      description: 'A sample product created to verify DB write access',
      price: 15.0,
      image: '/images/db-check.png',
      category: 'checks',
      countInStock: 10,
    });

    return res.status(201).json({ success: true, message: 'Seed completed', data: doc });
  } catch (err) {
    console.error('Seeding failed:', err);
    return res.status(500).json({ success: false, message: 'Seeding failed', error: err.message });
  }
};
