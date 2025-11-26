# NovaWear Backend

Backend API for NovaWear MERN e-commerce application.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/novawear
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_SECRET=optional_admin_secret_to_create_admins_securely
PORT=5000
NODE_ENV=development

### Email / SMTP configuration
The application can send emails (password reset, notifications) using either SMTP credentials or SendGrid's API key.

Example `.env` entries for SMTP:

```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=username@example.com
EMAIL_PASS=super_secret_email_password
EMAIL_FROM="NovaWear <no-reply@yourdomain.com>"
CLIENT_URL=http://localhost:5173
```

Or, to use SendGrid (recommended) via SMTP relay (no extra dependency required):

```
SENDGRID_API_KEY=SG.xxxxxxxx
CLIENT_URL=http://localhost:5173
```

If no email configuration is present the server will *log* email content during development and tests.
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Run the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── productController.js # Product CRUD operations
├── models/
│   ├── User.js            # User schema
│   └── Product.js         # Product schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── productRoutes.js   # Product endpoints
├── middleware/
│   ├── authMiddleware.js  # JWT authentication
│   └── errorHandler.js   # Error handling
├── utils/
│   └── generateToken.js   # JWT token generation
├── server.js              # Entry point
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with search & filter)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

## 🔍 Product Search & Filter

### Query Parameters for GET /api/products:
- `search` - Text search in name and description
- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `inStock` - Filter by stock availability (true/false)
- `sort` - Sort options: `price_asc`, `price_desc`, `name_asc`, `name_desc`, `newest`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

### Example:
```
GET /api/products?search=shirt&category=clothing&minPrice=10&maxPrice=100&sort=price_asc&page=1&limit=12
```

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>

### Quick examples (curl)

Register a new user (regular user):

```bash
curl -X POST http://localhost:5000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Regular User","email":"user@example.com","password":"password123"}'
```

Register an admin (requires ADMIN_SECRET to be set on the server):

```bash
curl -X POST http://localhost:5000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Admin User","email":"admin@example.com","password":"password123","adminSecret":"<ADMIN_SECRET_HERE>"}'
```

Login & use protected route (/api/auth/me):

```bash
# 1) login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password123"}' | jq -r '.data.token')

# 2) call protected route
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/me
```

### Demo script

There's also a tiny demo script that uses axios to register and log in a user (useful for CI or presentation):

```bash
node scripts/demoAuth.js
```

Make sure the server is running before running the demo script.

### Full demo script (auth + product flows)

There's a presentation-friendly demo that exercises admin and public product flows and prints HTTP traces. It will try to create an admin (if `ADMIN_SECRET` is set), create a normal user, list products, and if admin is available create/update/delete a product.

```bash
# Run the full demo
node scripts/demoFull.js

# or via npm
npm run demo:full
```

Environment variables:
- `DEMO_API_URL` to control the API base URL (defaults to http://localhost:5000/api)
- `ADMIN_SECRET` to allow the demo to programmatically create an admin account


## ✅ Running tests

Automated tests are included for the auth endpoints and run against an in-memory MongoDB.

Install dev dependencies and run tests:

```bash
cd backend
npm ci
npm test
```

## 🔎 DB connectivity check

You can manually verify the backend can connect and (optionally) write a small test document to your configured MongoDB instance.

By default the script only checks connectivity. To run it:

```bash
cd backend
npm run check-db
```

If you want the script to write and remove a sample record, set ALLOW_DB_WRITE=true and then run it:

```bash
ALLOW_DB_WRITE=true npm run check-db
```

Make sure `MONGODB_URI` in `.env` is configured before running the script.

### Seed sample product data
If you'd like to add a small sample product to verify DB writes you can use the seeder. This is intentionally gated — set ALLOW_DB_WRITE=true before running.

```bash
ALLOW_DB_WRITE=true npm run seed-sample

### Seed Indian fashion catalogue

We added a larger seeder containing Indian fashion products (sarees, lehengas, kurta sets, footwear, jewellery, and accessories). This is intentionally gated and will only run when `ALLOW_DB_WRITE=true` is set.

```bash
# Set your MongoDB URI in .env and then run:
ALLOW_DB_WRITE=true npm run seed-indian
```

The script creates multiple curated products intended to reflect Indian fashion and will print completion message when finished.
```

The script prints the created document id and exits.


CI: The repository contains a GitHub Actions workflow at `.github/workflows/ci-backend.yml` which runs the test suite on pushes and pull requests that affect the `backend/` directory.
```

## 👤 User Roles

- `user` - Default role for registered users
- `admin` - Can create, update, and delete products

### Creating an admin user

The registration endpoint (`POST /api/auth/register`) accepts an optional `adminSecret` field.
If you include `adminSecret` and its value matches the `ADMIN_SECRET` environment variable, the created account will be given the `admin` role.

This keeps admin creation gated behind a secret only known to the server operators. If `ADMIN_SECRET` is not set on the server, attempts to create an admin will be rejected.

## 📝 Notes

- Passwords are automatically hashed using bcrypt
- JWT tokens expire in 30 days
- All timestamps are automatically managed by Mongoose
- Error handling is centralized in the errorHandler middleware
