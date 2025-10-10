import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '../common/ErrorBoundary';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main" className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white text-sky-700 px-3 py-1 rounded shadow">Skip to content</a>
      <Header />
      <main id="main" className="flex-grow container mx-auto px-4 py-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
