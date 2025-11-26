#!/usr/bin/env node
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    console.log('Starting in-memory MongoDB for E2E...');
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri();
    process.env.MONGODB_URI = uri;
    // ensure an ADMIN_SECRET is available for E2E admin creation
    process.env.ADMIN_SECRET = process.env.ADMIN_SECRET || 'e2e_secret';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e_jwt_secret';
    // set a sensible NODE_ENV
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';

    // import server after env is set
    // server.js will call connectDB using MONGODB_URI and start the app
    await import('../server.js');

    console.log('E2E backend started with in-memory MongoDB');

    // keep process alive until killed
    process.on('SIGINT', async () => {
      console.log('Shutting down in-memory MongoDB...');
      await mem.stop();
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to start E2E in-memory DB', err);
    process.exit(1);
  }
})();
