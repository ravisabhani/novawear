import test from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env.NODE_ENV = 'test';

let mongoServer;
let app;
let request;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'test_jwt_secret';
  process.env.ADMIN_SECRET = 'test_admin_secret';

  const serverModule = await import('../server.js');
  app = serverModule.default;

  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test-invite' });

  request = supertest(app);
});

test.after(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

test.beforeEach(async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
});

test('Invite endpoints are disabled', async () => {
  const res = await request.get('/api/admin');
  // admin routes removed — expect 404 Not Found
  assert.equal(res.status, 404);
});
