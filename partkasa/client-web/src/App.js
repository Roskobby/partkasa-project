import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout components
import Layout from './components/layout/Layout';

// Lazy-loaded pages (route-level code splitting)
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const VendorDashboardPage = lazy(() => import('./pages/vendor/DashboardPage'));
const VendorPartsPage = lazy(() => import('./pages/vendor/PartsPage'));
const VendorUploadPage = lazy(() => import('./pages/vendor/UploadPage'));
const VendorOrdersPage = lazy(() => import('./pages/vendor/OrdersPage'));

import Spinner from './components/ui/Spinner';

// Auth provider
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="search/results" element={<SearchResultsPage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="cart" element={<CartPage />} />

            {/* Protected routes */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrdersPage />} />
            {/* Vendor routes */}
            <Route path="vendor">
              <Route index element={<VendorDashboardPage />} />
              <Route path="parts" element={<VendorPartsPage />} />
              <Route path="upload" element={<VendorUploadPage />} />
              <Route path="orders" element={<VendorOrdersPage />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
