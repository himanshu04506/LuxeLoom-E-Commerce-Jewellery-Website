import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MetalRateProvider } from './context/MetalRateContext';
import { CartProvider } from './context/CartContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import ChatWidget from './components/support/ChatWidget';

// Public Pages
import Home from './pages/public/Home';
import Catalog from './pages/public/Catalog';
import ProductDetail from './pages/public/ProductDetail';
import AboutUs from './pages/public/AboutUs';
import ContactUs from './pages/public/ContactUs';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import Profile from './pages/user/Profile';
import SavedAddresses from './pages/user/SavedAddresses';
import CartPage from './pages/user/CartPage';
import Checkout from './pages/user/Checkout';
import OrderConfirmation from './pages/user/OrderConfirmation';
import MyOrders from './pages/user/MyOrders';
import TrackingPage from './pages/user/TrackingPage';
import SupportPage from './pages/user/SupportPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMetalRates from './pages/admin/AdminMetalRates';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminUsers from './pages/admin/AdminUsers';

// Guard components
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <MetalRateProvider>
            <CartProvider>
            <div className="flex flex-col min-h-screen bg-ivory text-obsidian">
              <Navbar />
              
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Customer Protected Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="/order-tracking/:orderId" element={<TrackingPage />} />
                  <Route path="/support" element={<SupportPage />} />

                  {/* Admin Protected Routes */}
                  <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                  <Route path="/admin/metal-rates" element={<AdminRoute><AdminMetalRates /></AdminRoute>} />
                  <Route path="/admin/complaints" element={<AdminRoute><AdminComplaints /></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <CartDrawer />
              <ChatWidget />
              <Footer />
            </div>
          </CartProvider>
        </MetalRateProvider>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
