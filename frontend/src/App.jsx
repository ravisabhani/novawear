import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import ProductPage from './pages/ProductPage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminAddProduct from './pages/AdminAddProduct.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Cart from './pages/Cart.jsx';
import useAuth from './hooks/useAuth.js';
import api from './api';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/test');
        console.log('Backend connection:', response.data);
      } catch (error) {
        console.error('Backend connection failed:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 pb-12">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-20 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded-md focus:shadow">Skip to content</a>
      <Navbar />
      <div id="main-content" className="mx-auto mt-10 max-w-6xl px-4 pt-20 md:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin/add-product"
            element={
              <AdminRoute>
                <AdminAddProduct />
              </AdminRoute>
            }
          />
          {/* invite routes removed */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
