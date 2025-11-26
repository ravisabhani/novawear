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

  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test-products' });

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

test('GET /api/products returns empty list initially', async () => {
  const res = await request.get('/api/products');
  assert.equal(res.status, 200);
  assert.equal(res.body.count, 0);
  assert.equal(res.body.total, 0);
});

test('POST /api/products requires admin and returns 401/403 appropriately', async () => {
  const newProduct = { name: 'T-shirt', description: 'Cool tee', price: 19.99, category: 'clothing' };

  // no token -> should be 401
  const res1 = await request.post('/api/products').send(newProduct);
  assert.equal(res1.status, 401);

  // create a regular user and login
  const user = { name: 'Bob', email: 'bob@example.com', password: 'password123' };
  await request.post('/api/auth/register').send(user);
  const login = await request.post('/api/auth/login').send({ email: user.email, password: user.password });
  assert.equal(login.status, 200);

  // user token but not admin -> 403 (access denied by admin middleware)
  const userToken = login.body.data.token;
  const res2 = await request.post('/api/products').set('Authorization', `Bearer ${userToken}`).send(newProduct);
  assert.equal(res2.status, 403);
});

test('Admin can create, update, read and delete products', async () => {
  // create admin
  const admin = { name: 'Admin', email: 'admin@example.com', password: 'password123', adminSecret: 'test_admin_secret' };
  const reg = await request.post('/api/auth/register').send(admin);
  assert.equal(reg.status, 201);

  const login = await request.post('/api/auth/login').send({ email: admin.email, password: admin.password });
  assert.equal(login.status, 200);
  const token = login.body.data.token;

  // create product
  const newProduct = { name: 'T-shirt', description: 'Cool tee', price: 19.99, category: 'clothing', brand: 'NovaWear' };
  const createRes = await request.post('/api/products').set('Authorization', `Bearer ${token}`).send(newProduct);
  assert.equal(createRes.status, 201);
  assert.equal(createRes.body.data.name, newProduct.name);
  const productId = createRes.body.data._id;

  // get product by id
  const single = await request.get(`/api/products/${productId}`);
  assert.equal(single.status, 200);
  assert.equal(single.body.data._id, productId);

  // update product
  const updateRes = await request.put(`/api/products/${productId}`).set('Authorization', `Bearer ${token}`).send({ price: 29.99, name: 'T-shirt 2.0' });
  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.body.data.price, 29.99);
  assert.equal(updateRes.body.data.name, 'T-shirt 2.0');

  // delete product
  const delRes = await request.delete(`/api/products/${productId}`).set('Authorization', `Bearer ${token}`);
  assert.equal(delRes.status, 200);

  // confirm deleted
  const getAfter = await request.get(`/api/products/${productId}`);
  assert.equal(getAfter.status, 404);
});
