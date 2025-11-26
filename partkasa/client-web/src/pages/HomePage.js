import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, TruckIcon, ShieldCheckIcon, CreditCardIcon, StarIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import useSEO from '../hooks/useSEO';

const HomePage = () => {
  useSEO({ title: 'PartKasa - Find and buy auto parts fast', description: 'Find and buy auto parts fast' });

  const categories = [
    { id: 1, name: 'Engine Parts', image: 'https://images.unsplash.com/photo-1511185307590-3c29c1125aa7?auto=format&fit=crop&w=1200&q=60', description: 'Essential engine components' },
    { id: 2, name: 'Brake Systems', image: 'https://images.unsplash.com/photo-1610465299996-9f0136d2c1fb?auto=format&fit=crop&w=1200&q=60', description: 'Safety first with quality brakes' },
    { id: 3, name: 'Suspension', image: 'https://images.unsplash.com/photo-1601584115194-5e27f2d0b0a5?auto=format&fit=crop&w=1200&q=60', description: 'Smooth ride components' },
    { id: 4, name: 'Electrical', image: 'https://images.unsplash.com/photo-1581091870622-7c74c3a6d5d4?auto=format&fit=crop&w=1200&q=60', description: 'Wiring and electrical parts' },
    { id: 5, name: 'Body Parts', image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=60', description: 'Exterior and interior parts' },
    { id: 6, name: 'Filters', image: 'https://images.unsplash.com/photo-1592853625600-084f1079edb1?auto=format&fit=crop&w=1200&q=60', description: 'Air, oil, and fuel filters' },
  ];

  const featuredProducts = [
    { id: 1, name: 'Premium Brake Pads', price: 89.99, originalPrice: 119.99, image: 'https://images.unsplash.com/photo-1609840174129-07f1f6e5cb55?auto=format&fit=crop&w=1200&q=60', rating: 4.8, reviews: 124, badge: 'Best Seller' },
    { id: 2, name: 'High Performance Oil Filter', price: 12.49, originalPrice: 18.99, image: 'https://images.unsplash.com/photo-1563720223185-11003d5163a1?auto=format&fit=crop&w=1200&q=60', rating: 4.5, reviews: 89, badge: 'Great Value' },
    { id: 3, name: 'Premium Spark Plugs Set', price: 29.99, originalPrice: 39.99, image: 'https://images.unsplash.com/photo-1622943810053-0e43444b0e05?auto=format&fit=crop&w=1200&q=60', rating: 4.7, reviews: 156, badge: 'Popular' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 min-h-[80vh]">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }} />
        
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium">🚗 Ghana's #1 Auto Parts Marketplace</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Find Auto Parts 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> Fast</span>
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-xl leading-relaxed">
                Search by vehicle, part name, or part number. Compare prices and delivery times from trusted vendors across Ghana.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/search" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:from-orange-600 hover:to-yellow-600 transition-all transform hover:scale-105">
                  <MagnifyingGlassIcon className="h-6 w-6 mr-3" />
                  Start Searching
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-lg font-semibold text-white hover:bg-white/20 transition-all">
                  Join as Vendor
                  <ChevronRightIcon className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[{
                icon: TruckIcon, title: 'Fast Delivery', text: 'Get parts delivered in as little as 24 hours across Ghana.', color: 'from-green-500 to-emerald-600'
              },{
                icon: ShieldCheckIcon, title: 'Verified Vendors', text: 'All vendors are vetted for quality and reliability.', color: 'from-blue-500 to-cyan-600'
              },{
                icon: CreditCardIcon, title: 'Secure Payments', text: 'Pay safely with card or mobile money.', color: 'from-purple-500 to-pink-600'
              },{
                icon: MagnifyingGlassIcon, title: 'Smart Search', text: 'Find compatible parts for your specific vehicle.', color: 'from-yellow-500 to-orange-600'
              }].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all group">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {React.createElement(feature.icon, { className: 'h-7 w-7' })}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Browse our extensive collection of automotive parts, organized by category for easy shopping.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/search?category=${encodeURIComponent(category.name)}`} 
              className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <img 
                  loading="lazy" 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold">Shop Now</span>
                  <ChevronRightIcon className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover our top-rated automotive parts, handpicked for quality and value.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                {/* Product Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      product.badge === 'Best Seller' ? 'bg-red-500' :
                      product.badge === 'Great Value' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}
                
                <div className="relative w-full h-64 overflow-hidden">
                  <img 
                    loading="lazy" 
                    src={product.image} 
                    alt={product.name} 
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-blue-600">GHS {product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">GHS {product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/search" className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-8 rounded-xl transition-colors">
              View All Products
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">What Our Customers Say</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">Join thousands of satisfied customers across Ghana.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Kwame Asante",
                role: "Car Owner, Accra",
                content: "Found the exact brake pads for my Toyota Camry within minutes. Fast delivery and great prices!",
                rating: 5
              },
              {
                name: "Akosua Mensah",
                role: "Mechanic, Kumasi", 
                content: "PartKasa has become my go-to platform for sourcing quality parts. Reliable vendors and authentic products.",
                rating: 5
              },
              {
                name: "Emmanuel Osei",
                role: "Fleet Manager, Tema",
                content: "Managing parts for 20+ vehicles is now so much easier. The bulk ordering feature saves us time and money.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white text-lg mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-blue-200 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-500 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Find Your Parts?</h2>
          <p className="text-xl text-orange-100 mb-8">Join thousands of car owners and mechanics across Ghana.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search" className="inline-flex items-center justify-center bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg">
              <MagnifyingGlassIcon className="h-6 w-6 mr-3" />
              Start Shopping
            </Link>
            <Link to="/register?type=vendor" className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-orange-600 transition-colors">
              Become a Vendor
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
