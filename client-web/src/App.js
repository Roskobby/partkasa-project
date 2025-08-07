import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Search from './pages/Search';
import Results from './pages/Results';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import VendorDashboard from './pages/VendorDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-4">
          <h1 className="text-3xl font-bold text-center">Welcome to PartKasa</h1>
        </div>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/results" element={<Results />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/vendor" element={<VendorDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
