import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  // Sample featured categories
  const categories = [
    { id: 1, name: 'Engine Parts', image: 'https://via.placeholder.com/300x200?text=Engine+Parts' },
    { id: 2, name: 'Brake Systems', image: 'https://via.placeholder.com/300x200?text=Brake+Systems' },
    { id: 3, name: 'Suspension', image: 'https://via.placeholder.com/300x200?text=Suspension' },
    { id: 4, name: 'Electrical', image: 'https://via.placeholder.com/300x200?text=Electrical' },
    { id: 5, name: 'Body Parts', image: 'https://via.placeholder.com/300x200?text=Body+Parts' },
    { id: 6, name: 'Filters', image: 'https://via.placeholder.com/300x200?text=Filters' },
  ];

  // Sample featured products
  const featuredProducts = [
    { 
      id: 1, 
      name: 'Premium Brake Pads', 
      price: 89.99, 
      image: 'https://via.placeholder.com/300x300?text=Brake+Pads',
      rating: 4.8,
      reviews: 124,
      vendor: 'AutoPro Parts'
    },
    { 
      id: 2, 
      name: 'Oil Filter Pack', 
      price: 24.99, 
      image: 'https://via.placeholder.com/300x300?text=Oil+Filter',
      rating: 4.5,
      reviews: 89,
      vendor: 'FilterMaster'
    },
    { 
      id: 3, 
      name: 'Spark Plug Set', 
      price: 45.50, 
      image: 'https://via.placeholder.com/300x300?text=Spark+Plugs',
      rating: 4.7,
      reviews: 56,
      vendor: 'SparkTech'
    },
    { 
      id: 4, 
      name: 'Headlight Assembly', 
      price: 129.99, 
      image: 'https://via.placeholder.com/300x300?text=Headlight',
      rating: 4.6,
      reviews: 42,
      vendor: 'LightPro'
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find the Right Parts for Your Vehicle
            </h1>
            <p className="text-xl mb-8">
              PartKasa connects you with trusted vendors offering quality auto parts at competitive prices.
            </p>
            
            {/* Vehicle Search Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-primary-800 text-xl font-semibold mb-4">Search by Vehicle</h2>
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="make" className="block text-gray-700 mb-1">Make</label>
                  <select 
                    id="make" 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select Make</option>
                    <option value="toyota">Toyota</option>
                    <option value="honda">Honda</option>
                    <option value="ford">Ford</option>
                    <option value="chevrolet">Chevrolet</option>
                    <option value="bmw">BMW</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="model" className="block text-gray-700 mb-1">Model</label>
                  <select 
                    id="model" 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select Model</option>
                    <option value="camry">Camry</option>
                    <option value="corolla">Corolla</option>
                    <option value="rav4">RAV4</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="year" className="block text-gray-700 mb-1">Year</label>
                  <select 
                    id="year" 
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select Year</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <button 
                    type="submit" 
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Find Parts
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <MagnifyingGlassIcon className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">Find parts by vehicle make, model, year, or part number</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheckIcon className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">All parts are verified for quality and compatibility</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CreditCardIcon className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Multiple payment options with secure processing</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <TruckIcon className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick shipping with real-time tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <Link 
                key={category.id} 
                to={`/search?category=${category.name}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-center group-hover:text-primary-600">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/search" className="text-primary-600 hover:text-primary-800 font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold group-hover:text-primary-600">{product.name}</h3>
                      <span className="font-bold text-lg">${product.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Vendor: {product.vendor}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none'}`} 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm ml-1">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find the perfect parts for your vehicle?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have found the right parts at the right price.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/search" 
              className="btn btn-accent px-8 py-3 text-lg"
            >
              Browse Parts
            </Link>
            <Link 
              to="/register" 
              className="btn bg-white text-primary-800 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
