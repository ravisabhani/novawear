# NovaWear - MERN E-commerce Project

A full-stack e-commerce application built with MongoDB, Express, React, and Node.js.

## Project Structure

```
novawear-mern/
├── backend/          # Node.js + Express + MongoDB backend
├── frontend/         # React + Vite + Tailwind frontend
└── README.md         # This file
```

## Features

### Backend
- User authentication (register, login)
- Product CRUD operations
- Search and filter capabilities
- JWT-based authentication
- RESTful API design

### Frontend
- Product listing page with search and filters
- Product detail page
- User authentication (login/register)
- Admin panel for product management
- Responsive design with Tailwind CSS

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### E2E tests (Playwright)

We provide Playwright tests that exercise full user flows (signup/login/add-to-cart/checkout).

Install browsers and run the tests from the repo root:

```powershell
cd backend; npm ci
cd ../frontend; npm ci
cd ..
npm ci
npx playwright install --with-deps
npm run e2e:test
```

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT
- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Authentication**: JWT (JSON Web Tokens)

