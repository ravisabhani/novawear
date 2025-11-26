#!/usr/bin/env node
/*
  Demo script to exercise the auth REST API routes.
  Usage: node scripts/demoAuth.js
  Make sure the backend server is running (default http://localhost:5000)
*/
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API = process.env.DEMO_API_URL || `http://localhost:${process.env.PORT || 5000}/api`;

const randomSuffix = Math.floor(Math.random() * 10000);
const demoUser = {
  name: `Demo User ${randomSuffix}`,
  email: `demo-${randomSuffix}@example.com`,
  password: 'password123',
};

async function run() {
  try {
    console.log('Registering user (POST /api/auth/register)...');
    const regRes = await axios.post(`${API}/auth/register`, demoUser);
    console.log('Register response:', regRes.data);

    console.log('Logging in user (POST /api/auth/login)...');
    const loginRes = await axios.post(`${API}/auth/login`, { email: demoUser.email, password: demoUser.password });
    console.log('Login response:', { token: !!loginRes.data.data.token, user: loginRes.data.data })

    const token = loginRes.data.data.token;

    console.log('Getting current user (GET /api/auth/me) with token...');
    const meRes = await axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Me response:', meRes.data);

    console.log('\nSuccess — these calls demonstrate register → login → protected route flow.');
  } catch (err) {
    console.error('Demo failed:', err.response?.data || err.message);
    process.exitCode = 1;
  }
}

run();
