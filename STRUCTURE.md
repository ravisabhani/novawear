# NovaWear - Complete Folder Structure

```
novawear-mern/
│
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── README.md
│   │
│   ├── controllers/
│   │   ├── authController.js     # Register, login logic
│   │   ├── productController.js   # Product CRUD, search, filter
│   │   └── README.md
│   │
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   └── README.md
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── productRoutes.js      # /api/products routes
│   │   └── README.md
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorHandler.js       # Error handling
│   │   ├── validator.js          # Request validation
│   │   └── README.md
│   │
│   ├── utils/
│   │   ├── generateToken.js      # JWT token generation
│   │   ├── validators.js         # Input validation
│   │   ├── constants.js          # App constants
│   │   └── README.md
│   │
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── server.js                 # Entry point
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── README.md
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   │   └── Navbar.jsx
│   │   │   ├── ProductCard/
│   │   │   │   └── ProductCard.jsx
│   │   │   ├── ProductList/
│   │   │   │   └── ProductList.jsx
│   │   │   ├── SearchBar/
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── Filter/
│   │   │   │   └── Filter.jsx
│   │   │   ├── Loading/
│   │   │   │   └── Loading.jsx
│   │   │   ├── Error/
│   │   │   │   └── Error.jsx
│   │   │   └── README.md
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Product listing page
│   │   │   ├── ProductDetail.jsx # Product detail page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx     # Register page
│   │   │   ├── AdminAddProduct.jsx # Admin add product
│   │   │   └── README.md
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Auth state management
│   │   │   └── README.md
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js        # Auth hook
│   │   │   ├── useProducts.js    # Products hook
│   │   │   └── README.md
│   │   │
│   │   ├── services/
│   │   │   ├── api.js            # Axios instance
│   │   │   ├── authService.js    # Auth API calls
│   │   │   ├── productService.js # Product API calls
│   │   │   └── README.md
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js      # App constants
│   │   │   ├── helpers.js        # Helper functions
│   │   │   ├── formatters.js     # Data formatters
│   │   │   └── README.md
│   │   │
│   │   ├── styles/
│   │   │   ├── index.css         # Global styles + Tailwind
│   │   │   └── README.md
│   │   │
│   │   ├── App.jsx               # Main App component
│   │   ├── main.jsx              # Entry point
│   │   └── index.html            # HTML template
│   │
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js        # Tailwind config
│   ├── vite.config.js            # Vite config
│   └── README.md
│
├── .gitignore
└── README.md
```

## Key Features by Directory

### Backend
- **config/**: Database connection setup
- **controllers/**: Business logic for auth and products
- **models/**: MongoDB schemas
- **routes/**: API endpoint definitions
- **middleware/**: Authentication, validation, error handling
- **utils/**: Helper functions and constants

### Frontend
- **components/**: Reusable UI components (Navbar, ProductCard, etc.)
- **pages/**: Route-level page components
- **context/**: Global state management (Auth)
- **hooks/**: Custom React hooks
- **services/**: API communication layer
- **utils/**: Helper functions
- **styles/**: Tailwind CSS configuration

