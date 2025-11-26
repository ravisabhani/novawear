#!/usr/bin/env node
/*
  Full demo that exercises the auth + product flows and prints HTTP traces.
  Usage: node scripts/demoFull.js
  Environment variables:
   - DEMO_API_URL (default http://localhost:5000/api)
   - ADMIN_SECRET (if you want the script to create an admin via adminSecret)
*/
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API = process.env.DEMO_API_URL || `http://localhost:${process.env.PORT || 5000}/api`;

function trace(name, url, opts, res) {
  console.log('---');
  console.log(`${name}: ${opts?.method?.toUpperCase?.() || 'GET'} ${url}`);
  if (opts?.data) console.log('>>> body:', JSON.stringify(opts.data));
  if (res) console.log('<<< status:', res.status, 'data:', JSON.stringify(res.data));
}

const randomSuffix = Math.floor(Math.random() * 100000);

const adminPayload = {
  name: `Demo Admin ${randomSuffix}`,
  email: `admin-${randomSuffix}@example.com`,
  password: 'password123',
};

const userPayload = {
  name: `Demo User ${randomSuffix}`,
  email: `user-${randomSuffix}@example.com`,
  password: 'password123',
};

async function run() {
  try {
    // Create admin (if ADMIN_SECRET present – else skip and assume admin exists)
    if (process.env.ADMIN_SECRET) {
      const opts = { method: 'post', url: `${API}/auth/register`, data: { ...adminPayload, adminSecret: process.env.ADMIN_SECRET } };
      const regAdmin = await axios(opts);
      trace('register admin', opts.url, opts, regAdmin);
    } else {
      console.log('Skipping admin register: ADMIN_SECRET not set (script will still try to log in if admin exists)');
    }

    // Login admin
    const adminLoginRes = await axios.post(`${API}/auth/login`, { email: adminPayload.email, password: adminPayload.password }).catch((e) => e.response);
    trace('admin login', `${API}/auth/login`, { method: 'post', data: { email: adminPayload.email } }, adminLoginRes);

    const adminToken = adminLoginRes?.data?.data?.token;
    if (!adminToken) {
      console.log('Admin login failed — demo will create a regular user and continue with non-admin flows.');
    }

    // Create a normal user
    const regUserRes = await axios.post(`${API}/auth/register`, userPayload).catch((e) => e.response);
    trace('register user', `${API}/auth/register`, { method: 'post', data: userPayload }, regUserRes);

    const loginUserRes = await axios.post(`${API}/auth/login`, { email: userPayload.email, password: userPayload.password }).catch((e) => e.response);
    trace('user login', `${API}/auth/login`, { method: 'post', data: { email: userPayload.email } }, loginUserRes);

    // Public: list products
    const productsList = await axios.get(`${API}/products`).catch((e) => e.response);
    trace('list products', `${API}/products`, { method: 'get' }, productsList);

    // If admin token exists: create, update and delete a product
    if (adminToken) {
      const createRes = await axios.post(
        `${API}/products`,
        { name: 'Demo Product', description: 'A short demo product', price: 9.99, category: 'demo', brand: 'demo' },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      ).catch((e) => e.response);
      trace('create product (admin)', `${API}/products`, { method: 'post', data: {} }, createRes);

      const id = createRes?.data?.data?._id;
      if (id) {
        const updateRes = await axios.put(`${API}/products/${id}`, { price: 7.99 }, { headers: { Authorization: `Bearer ${adminToken}` } }).catch((e) => e.response);
        trace('update product (admin)', `${API}/products/${id}`, { method: 'put', data: { price: 7.99 } }, updateRes);

        const deleteRes = await axios.delete(`${API}/products/${id}`, { headers: { Authorization: `Bearer ${adminToken}` } }).catch((e) => e.response);
        trace('delete product (admin)', `${API}/products/${id}`, { method: 'delete' }, deleteRes);
      }
    }

    console.log('\nDemo finished.');
  } catch (err) {
    console.error('Demo error:', err.response?.data || err.message || err);
    process.exitCode = 1;
  }
}

run();
