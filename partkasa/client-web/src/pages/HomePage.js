import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import useSEO from '../hooks/useSEO';

const HomePage = () => {
  useSEO({ title: 'PartKasa - Find and buy auto parts fast', description: 'Find and buy auto parts fast' });

  const categories = [
    { id: 1, name: 'Engine Parts', image: 'https://via.placeholder.com/300x200?text=Engine+Parts' },
    { id: 2, name: 'Brake Systems', image: 'https://via.placeholder.com/300x200?text=Brake+Systems' },
    { id: 3, name: 'Suspension', image: 'https://via.placeholder.com/300x200?text=Suspension' },
    { id: 4, name: 'Electrical', image: 'https://via.placeholder.com/300x200?text=Electrical' },
    { id: 5, name: 'Body Parts', image: 'https://via.placeholder.com/300x200?text=Body+Parts' },
    { id: 6, name: 'Filters', image: 'https://via.placeholder.com/300x200?text=Filters' },
  ];

  const featuredProducts = [
    { id: 1, name: 'Premium Brake Pads', price: 89.99, image: 'https://via.placeholder.com/300x300?text=Brake+Pads', rating: 4.8 },
    { id: 2, name: 'Oil Filter', price: 12.49, image: 'https://via.placeholder.com/300x300?text=Oil+Filter', rating: 4.5 },
    { id: 3, name: 'Spark Plugs', price: 29.99, image: 'https://via.placeholder.com/300x300?text=Spark+Plugs', rating: 4.7 },
  ];

  return (
    <div>
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Find Auto Parts Fast</h1>
              <p className="text-gray-600 mb-6">Search by vehicle, part name, or part number. Compare prices and delivery times from multiple vendors.</p>
              <Link to="/search" className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Search Parts
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <TruckIcon className="h-8 w-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Get parts delivered in as little as 24 hours.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold mb-2">Verified Vendors</h3>
                <p className="text-sm text-gray-600">All vendors are vetted for quality and reliability.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <CreditCardIcon className="h-8 w-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold mb-2">Secure Payments</h3>
                <p className="text-sm text-gray-600">Pay safely with card or mobile money.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <MagnifyingGlassIcon className="h-8 w-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold mb-2">Smart Search</h3>
                <p className="text-sm text-gray-600">Find compatible parts for your vehicle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold mb-1">{p.name}</h3>
                <p className="text-gray-600 mb-2">GHS {p.price.toFixed(2)}</p>
                <div className="text-sm text-gray-500">Rating: {p.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
