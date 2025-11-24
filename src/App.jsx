import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import ReviewsPage from './pages/ReviewsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';
import TotalReviewsPage from './pages/TotalReviews';
import PendingOrdersPage from './pages/PendingOrdersPage';
import CancelledOrdersPage from './pages/CancelledOrdersPage';
import DeliveredOrdersPage from './pages/DeliveredOrdersPage';
import ShippingOrdersPage from './pages/ShippingOrdersPage';
import ProcessingOrdersPage from './pages/ProcessingOrdersPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="reviews/total" element={<TotalReviewsPage />} />
            <Route path="reviews/pending" element={<ReviewsPage />} />
            <Route path="orders/pending" element={<PendingOrdersPage />} />
            <Route path="orders/processing" element={<ProcessingOrdersPage />} />
            <Route path="orders/shipped" element={<ShippingOrdersPage />} />
            <Route path="orders/delivered" element={<DeliveredOrdersPage />} />
            <Route path="orders/cancelled" element={<CancelledOrdersPage />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;