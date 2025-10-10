import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">PartKasa</Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
          <Link to="/results" className="text-gray-700 hover:text-black">Results</Link>
          <Link to="/checkout" className="text-gray-700 hover:text-black">Checkout</Link>
          <Link to="/profile" className="text-gray-700 hover:text-black">Profile</Link>
          <Link to="/vendor" className="text-gray-700 hover:text-black">Vendor</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

