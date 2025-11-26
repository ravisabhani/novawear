#!/usr/bin/env node
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config();

const ALLOW_WRITE = process.env.ALLOW_DB_WRITE === 'true';

const PRODUCTS = [
  {
    name: 'Handloom Kanchipuram Silk Saree - Crimson Gold',
    description: 'Traditional Kanchipuram silk saree with temple border and handwoven zari work. Perfect for weddings and festive occasions.',
    price: 349.99,
    category: 'sarees',
    brand: 'Heritage Weaves',
    image: 'https://images.unsplash.com/photo-1520975911996-7b8bd7ec7b23?w=1200&q=60',
    inStock: true,
    stockQuantity: 12,
  },
  {
    name: 'Embroidered Lehenga Set - Marigold',
    description: 'Hand-embroidered lehenga choli with mirrorwork and a coordinated dupatta. Lightweight and elegant.',
    price: 429.99,
    category: 'ethnic-wear',
    brand: 'Festive Moda',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=60',
    inStock: true,
    stockQuantity: 6,
  },
  {
    name: 'Men\'s Bandhgala Sherwani - Midnight Blue',
    description: 'Tailored bandhgala sherwani with intricate embroidery and fine lining. Ideal for ceremonies.',
    price: 269.99,
    category: 'mens-wear',
    brand: 'Groom & Co',
    image: 'https://images.unsplash.com/photo-1623290535088-670b2a4f5b38?w=1200&q=60',
    inStock: true,
    stockQuantity: 8,
  },
  {
    name: 'Chikankari Kurta Set - Ivory',
    description: 'Hand-embroidered Chikankari kurta set made from premium cotton for breathable comfort and a graceful silhouette.',
    price: 79.99,
    category: 'ethnic-wear',
    brand: 'Crafted Comforts',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=60',
    inStock: true,
    stockQuantity: 20,
  },
  {
    name: 'Bandhani Dupatta - Ruby Orbit',
    description: 'Traditional bandhani printed dupatta with bold colors and soft fabric. A perfect drape to pair with plain lehengas or kurtas.',
    price: 29.99,
    category: 'accessories',
    brand: 'Rangrez',
    image: 'https://images.unsplash.com/photo-1562158077-3b85b3d8a3e6?w=1200&q=60',
    inStock: true,
    stockQuantity: 50,
  },
  {
    name: 'Handcrafted Juttis - Embellished',
    description: 'Traditional handcrafted leather juttis with embroidered upper and comfortable sole. Available in multiple colors.',
    price: 39.99,
    category: 'footwear',
    brand: 'Steps of India',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=60',
    inStock: true,
    stockQuantity: 40,
  },
  {
    name: 'Banarasi Silk Saree - Peacock Green',
    description: 'Luxurious Banarasi silk saree with gold zari motifs and classic pallu design for special-day elegance.',
    price: 299.99,
    category: 'sarees',
    brand: 'Silk Street',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=60',
    inStock: true,
    stockQuantity: 14,
  },
  {
    name: 'Kurtapants Set - Hand Block Print',
    description: 'Comfortable kurta & pants set with hand block prints on breathable cotton. Everyday wear with a traditional touch.',
    price: 49.99,
    category: 'ethnic-wear',
    brand: 'Roots & Threads',
    image: 'https://images.unsplash.com/photo-1569742058151-9c5f9e6ccd0e?w=1200&q=60',
    inStock: true,
    stockQuantity: 30,
  },
  {
    name: 'Temple Jewellery Set - Oxidised Silver',
    description: 'Handcrafted temple jewellery with oxidized finish. Includes necklace and matching earrings for a classic ethnic look.',
    price: 49.99,
    category: 'jewellery',
    brand: 'Svara',
    image: 'https://images.unsplash.com/photo-1520975911996-7b8bd7ec7b23?w=1200&q=60',
    inStock: true,
    stockQuantity: 60,
  },
  {
    name: 'Anarkali Suit - Wine Red',
    description: 'Floor-length Anarkali suit with subtle embroidery and mulmul fabric — graceful and light.',
    price: 119.99,
    category: 'ethnic-wear',
    brand: 'Regal Attire',
    image: 'https://images.unsplash.com/photo-1536724054096-c3d4f2b65fba?w=1200&q=60',
    inStock: true,
    stockQuantity: 10,
  },
  {
    name: 'Designer Men\'s Kurta - Off-White with Zari',
    description: 'Contemporary kurta for events, with contrast piping and zari detail.',
    price: 69.99,
    category: 'mens-wear',
    brand: 'Mantra',
    image: 'https://images.unsplash.com/photo-1531347231656-3be2b8b1d38b?w=1200&q=60',
    inStock: true,
    stockQuantity: 25,
  },
  {
    name: 'Cotton Saree - Daily Charm',
    description: 'Lightweight cotton saree for everyday use with minimalistic borders for easy drape.',
    price: 24.99,
    category: 'sarees',
    brand: 'Everyday Sarees',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=60',
    inStock: true,
    stockQuantity: 100,
  },
  {
    name: 'Kids\' Ethnic Set - Festive Mini',
    description: 'Adorable kids\' kurta pajama set for festive occasions — safe fabric and fine stitching.',
    price: 29.99,
    category: 'kids',
    brand: 'Little Traditions',
    image: 'https://images.unsplash.com/photo-1567443022866-1f9a1c1ae1be?w=1200&q=60',
    inStock: true,
    stockQuantity: 35,
  }
  ,
  {
    name: 'Silk Blouse - Artisanal Print',
    description: 'Tailored silk blouse with artisanal prints to complement your saree wardrobe.',
    price: 34.99,
    category: 'accessories',
    brand: 'Silk Stories',
    image: 'https://images.unsplash.com/photo-1543865073-6b01f0f6c8a8?w=1200&q=60',
    inStock: true,
    stockQuantity: 60,
  },
  {
    name: 'Casual Men\'s Kurta - Indigo Dye',
    description: 'Hand-dyed indigo kurta made from breathable cotton — casual and elegant.',
    price: 44.99,
    category: 'mens-wear',
    brand: 'Urban Ethno',
    image: 'https://images.unsplash.com/photo-1562158077-3b85b3d8a3e6?w=1200&q=60',
    inStock: true,
    stockQuantity: 40,
  },
  {
    name: 'Brocade Clutch - Party Edition',
    description: 'A compact clutch made from brocade fabric with secure snap closure — perfect for parties and festivities.',
    price: 24.99,
    category: 'accessories',
    brand: 'Noor',
    image: 'https://images.unsplash.com/photo-1542546060-1b07b4b3a3e2?w=1200&q=60',
    inStock: true,
    stockQuantity: 18,
  },
  {
    name: 'Silk Scarf - Ajrakh Motif',
    description: 'Lightweight silk scarf featuring Ajrakh-inspired patterns and rich colors.',
    price: 19.99,
    category: 'accessories',
    brand: 'Pattern Tales',
    image: 'https://images.unsplash.com/photo-1555529771-5b0f0adf11a6?w=1200&q=60',
    inStock: true,
    stockQuantity: 80,
  },
  {
    name: 'Printed Palazzo Set - Summer Breeze',
    description: 'Flowy printed palazzo set, lightweight fabric suited for warm climates.',
    price: 39.99,
    category: 'ethnic-wear',
    brand: 'Breeze Boutique',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=60',
    inStock: true,
    stockQuantity: 45,
  },
  {
    name: 'Ethnic Sandals - Kolhapuri Inspired',
    description: 'Premium leather sandals inspired by Kolhapuri stitching with cushioned insoles.',
    price: 34.99,
    category: 'footwear',
    brand: 'Heritage Soles',
    image: 'https://images.unsplash.com/photo-1580894908360-53ea5f5f3584?w=1200&q=60',
    inStock: true,
    stockQuantity: 20,
  },
  {
    name: 'Wedding Stole - Embellished Tussar',
    description: 'Premium Tussar stole with sequin embellishments — a refined accessory for wedding attire.',
    price: 59.99,
    category: 'accessories',
    brand: 'Tussar Tales',
    image: 'https://images.unsplash.com/photo-1520975911996-7b8bd7ec7b23?w=1200&q=60',
    inStock: true,
    stockQuantity: 12,
  }
];

const run = async () => {
  console.log('Running Indian fashion seed script');

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

    console.log(`Inserting ${PRODUCTS.length} products`);
    for (const p of PRODUCTS) {
      await Product.create({
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        brand: p.brand,
        image: p.image,
        inStock: p.inStock,
        stockQuantity: p.stockQuantity,
      });
    }

    console.log('Seeding completed');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

run();
