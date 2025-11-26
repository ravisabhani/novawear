import test from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import crypto from 'crypto';

import User from '../models/User.js';
import Order from '../models/Order.js';

// Set a flag for tests to avoid starting the server listener
process.env.NODE_ENV = 'test';

let mongoServer;
let app;
let request;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'test_jwt_secret';
  process.env.ADMIN_SECRET = 'test_admin_secret';

  // Import app after setting MONGODB_URI
  // server.js exports the express app (without starting the server in test mode)
  const serverModule = await import('../server.js');
  app = serverModule.default;

  // connect mongoose
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test' });

  request = supertest(app);
});

test.after(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

test.beforeEach(async () => {
  // Clear DB collections before each test
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
});

test('POST /api/auth/register - missing fields returns 400', async () => {
  const res = await request.post('/api/auth/register').send({ email: 'a@example.com' });
  assert.equal(res.status, 400);
  assert.ok(res.body.message.includes('Please provide all required'));
});

test('Register -> Login -> Me flow works and assigns user role', async () => {
  const user = { name: 'Alice Tester', email: 'alice@example.com', password: 'password123' };

  const reg = await request.post('/api/auth/register').send(user);
  assert.equal(reg.status, 201);
  assert.equal(reg.body.success, true);
  assert.equal(reg.body.data.role, 'user');
  assert.ok(reg.body.data.token);

  const login = await request.post('/api/auth/login').send({ email: user.email, password: user.password });
  assert.equal(login.status, 200);
  assert.ok(login.body.data.token);

  const token = login.body.data.token;
  const me = await request.get('/api/auth/me').set('Authorization', `Bearer ${token}`);
  assert.equal(me.status, 200);
  assert.equal(me.body.data.email, user.email);
});

test('Creating admin requires correct adminSecret and sets admin role', async () => {
  const admin = { name: 'Admin One', email: 'admin1@example.com', password: 'password123', adminSecret: 'test_admin_secret' };

  const reg = await request.post('/api/auth/register').send(admin);
  assert.equal(reg.status, 201);
  assert.equal(reg.body.data.role, 'admin');

  // Login and check me
  const login = await request.post('/api/auth/login').send({ email: admin.email, password: admin.password });
  assert.equal(login.status, 200);

  const me = await request.get('/api/auth/me').set('Authorization', `Bearer ${login.body.data.token}`);
  assert.equal(me.status, 200);
  assert.equal(me.body.data.role, 'admin');
});

test('POST /api/auth/forgot should return 200 and set reset token on user', async () => {
  const user = { name: 'Reset Me', email: 'resetme@example.com', password: 'password123' };

  const reg = await request.post('/api/auth/register').send(user);
  assert.equal(reg.status, 201);

  const forgot = await request.post('/api/auth/forgot').send({ email: user.email });
  assert.equal(forgot.status, 200);
  assert.equal(forgot.body.success, true);

  // Verify reset token and expiry set on user in DB
  const dbUser = await User.findOne({ email: user.email }).select('+resetPasswordToken').lean();
  assert.ok(dbUser.resetPasswordToken);
  assert.ok(dbUser.resetPasswordExpires > Date.now());
});

test('POST /api/auth/forgot is rate-limited after repeated attempts', async () => {
  const user = { name: 'Rate Limit', email: 'ratelimit@example.com', password: 'password123' };

  await request.post('/api/auth/register').send(user);

  // send allowed number of requests
  // use a test-specific IP header so we don't clash with calls from other tests
  const TEST_IP = '203.0.113.42';

  for (let i = 0; i < 5; i += 1) {
    const r = await request.post('/api/auth/forgot').set('X-Test-Ip', TEST_IP).send({ email: user.email });
    // should be allowed (200)
    assert.equal(r.status, 200);
  }

  // the next request should be rate limited
  const blocked = await request.post('/api/auth/forgot').set('X-Test-Ip', TEST_IP).send({ email: user.email });
  assert.equal(blocked.status, 429);
  assert.equal(blocked.body.success, false);
});

test('POST /api/auth/reset/:token resets password when token valid', async () => {
  const user = { name: 'Do Reset', email: 'doreset@example.com', password: 'oldpass123' };

  await request.post('/api/auth/register').send(user);

  // Create a token and set hashed token in DB
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');

  const dbUser = await User.findOne({ email: user.email });
  dbUser.resetPasswordToken = hashed;
  dbUser.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await dbUser.save({ validateBeforeSave: false });

  // Now call reset endpoint
  const newPassword = 'brandNew123';
  const res = await request.post(`/api/auth/reset/${resetToken}`).send({ password: newPassword });
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.token);

  // Attempt login with new password
  const login = await request.post('/api/auth/login').send({ email: user.email, password: newPassword });
  assert.equal(login.status, 200);
});

test('POST /api/auth/reset/:token rejects expired or invalid token', async () => {
  const user = { name: 'Expired Reset', email: 'expired@example.com', password: 'oldpass123' };

  await request.post('/api/auth/register').send(user);

  // Create an expired token on user
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');

  const dbUser = await User.findOne({ email: user.email });
  dbUser.resetPasswordToken = hashed;
  dbUser.resetPasswordExpires = Date.now() - 1000; // expired
  await dbUser.save({ validateBeforeSave: false });

  const res = await request.post(`/api/auth/reset/${resetToken}`).send({ password: 'whatever' });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

// CART tests
test('Cart lifecycle: add, update, remove items, checkout', async () => {
  const user = { name: 'Cart User', email: 'cartuser@example.com', password: 'cartpass' };
  await request.post('/api/auth/register').send(user);

  // login to get token
  const login = await request.post('/api/auth/login').send({ email: user.email, password: user.password });
  const token = login.body.data.token;

  // create a product to add
  process.env.ADMIN_SECRET = 'test_admin_secret';
  const admin = { name: 'AdminCart', email: 'admincart@example.com', password: 'adminpass', adminSecret: 'test_admin_secret' };
  await request.post('/api/auth/register').send(admin);
  const adminLogin = await request.post('/api/auth/login').send({ email: admin.email, password: admin.password });
  const adminToken = adminLogin.body.data.token;

  const newProduct = await request
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Cart Product', description: 'A product for cart tests', price: 20, category: 'tests', stockQuantity: 10 });

  assert.equal(newProduct.status, 201);
  const productId = newProduct.body.data._id;

  // add item to cart
  const add = await request.post('/api/cart/item').set('Authorization', `Bearer ${token}`).send({ productId, quantity: 2 });
  assert.equal(add.status, 200);
  assert.equal(add.body.data.items.length, 1);

  // update item
  const update = await request.put(`/api/cart/item/${productId}`).set('Authorization', `Bearer ${token}`).send({ quantity: 3 });
  assert.equal(update.status, 200);
  assert.equal(update.body.data.items[0].quantity, 3);

  // remove item
  const remove = await request.delete(`/api/cart/item/${productId}`).set('Authorization', `Bearer ${token}`);
  assert.equal(remove.status, 200);
  assert.equal(remove.body.data.items.length, 0);

  // add item and checkout
  await request.post('/api/cart/item').set('Authorization', `Bearer ${token}`).send({ productId, quantity: 2 });
  const chk = await request.post('/api/cart/checkout').set('Authorization', `Bearer ${token}`).send({});
  assert.equal(chk.status, 200);
  assert.equal(chk.body.success, true);

  // Verify order persisted
  const createdOrder = await Order.findById(chk.body.data._id).lean();
  assert.ok(createdOrder);

  // Verify cart is empty for user
  const afterCart = await request.get('/api/cart').set('Authorization', `Bearer ${token}`);
  assert.equal(afterCart.status, 200);
  assert.equal(afterCart.body.data.items.length, 0);
});
