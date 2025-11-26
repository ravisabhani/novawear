import test from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Environment for tests
process.env.NODE_ENV = 'test';

let mongoServer;
let app;
let request;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'test_jwt_secret';

  const serverModule = await import('../server.js');
  app = serverModule.default;

  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test' });
  request = supertest(app);
});

test.after(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

test('E2E password reset flow using logged email output', async () => {
  const user = { name: 'End2End', email: 'e2e@example.com', password: 'initPass12' };

  // register
  const reg = await request.post('/api/auth/register').send(user);
  assert.equal(reg.status, 201);

  // capture console output where sendEmail logs when SMTP not configured
  let logged = '';
  const oldLog = console.log;
  console.log = (...args) => {
    logged += args.join(' ');
    oldLog.apply(console, args);
  };

  try {
    const forgot = await request.post('/api/auth/forgot').send({ email: user.email });
    assert.equal(forgot.status, 200);

    // parse token from logged content
    const match = logged.match(/reset\/(\w+)/);
    assert.ok(match, 'Reset URL did not appear in logs');
    const rawToken = match[1];

    // reset using token
    const newPw = 'superNewPass99';
    const resetRes = await request.post(`/api/auth/reset/${rawToken}`).send({ password: newPw });
    assert.equal(resetRes.status, 200);
    assert.equal(resetRes.body.success, true);

    // login with new password
    const login = await request.post('/api/auth/login').send({ email: user.email, password: newPw });
    assert.equal(login.status, 200);
  } finally {
    console.log = oldLog;
  }
});
