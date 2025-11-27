import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const exampleProducts = [
  {
    name: 'Luxe Linen Shirt',
    description: 'Breathable linen blend with tailored fit and premium buttons.',
    price: 89,
    category: 'Tops',
    brand: 'NovaWear',
    image: 'https://images.unsplash.com/photo-1484519332611-516457305ff6?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 30,
  },
  {
    name: 'AeroFlex Joggers',
    description: 'Lightweight joggers with adaptive waistband and water repellent finish.',
    price: 125,
    category: 'Bottoms',
    brand: 'NovaWear',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 45,
  },
  {
    name: 'Sculpted Overshirt',
    description: 'Minimal overshirt with hidden snaps and brushed stretch twill.',
    price: 149,
    category: 'Outerwear',
    brand: 'NovaWear Studio',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 25,
  },
  {
    name: 'CloudKnit Hoodie',
    description: 'Ultra-soft fleece hoodie with drop shoulders and cropped hem.',
    price: 99,
    category: 'Tops',
    brand: 'NOVA Sport',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 40,
  },
  {
    name: 'Cascade Rain Shell',
    description: 'Technical shell with taped seams and packable pouch.',
    price: 175,
    category: 'Outerwear',
    brand: 'NovaWear Lab',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 20,
  },
  {
    name: 'Terra Knit Dress',
    description: 'Sculpted knit midi with contour ribbing and open back detail.',
    price: 135,
    category: 'Dresses',
    brand: 'NovaWear Atelier',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 18,
  },
  {
    name: 'Monolith Chelsea Boots',
    description: 'Italian leather Chelsea boots with stacked sole and elastic gusset.',
    price: 210,
    category: 'Footwear',
    brand: 'NovaWear Atelier',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 15,
  },
  {
    name: 'Halo Performance Tee',
    description: 'Moisture-wicking tee with bonded seams and UV protection.',
    price: 65,
    category: 'Tops',
    brand: 'NOVA Sport',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    stockQuantity: 60,
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
