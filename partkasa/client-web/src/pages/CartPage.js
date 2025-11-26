import { getApiBase } from '../config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';

const CartPage = () => {
  useSEO({ title: 'PartKasa - Shopping cart overview', description: 'Shopping cart overview' });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 50; // Fixed shipping fee in GHS
  const total = subtotal + shippingFee;

  // Sync cart with backend when user is logged in
  useEffect(() => {
    const syncCart = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get cart from server
        const response = await fetch(`${getApiBase()}/api/cart`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const serverCart = await response.json();

        // Merge local cart with server cart
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (localCart.length > 0) {
          await fetch(`${getApiBase()}/api/cart/sync`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: localCart }),
          });
          localStorage.removeItem('cart');
        }

        setCart(serverCart);
      } catch (err) {
        setError('Failed to load cart. Please try again.');
        console.error('Error loading cart:', err);
      } finally {
        setLoading(false);
      }
    };

    syncCart();
  }, [user]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      if (user) {
        await fetch(`${getApiBase()}/api/cart/items/${itemId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: newQuantity }),
        });
      }

      const updatedCart = cart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);

      if (!user) {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      if (user) {
        await fetch(`${getApiBase()}/api/cart/items/${itemId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }

      const updatedCart = cart.filter((item) => item.id !== itemId);
      setCart(updatedCart);

      if (!user) {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    } catch (err) {
      setError('Failed to remove item. Please try again.');
      console.error('Error removing item:', err);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Browse our collection to find the parts you need</p>
          <button
            onClick={() => navigate('/search')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Browse Parts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="p-6 flex items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />

                  <div className="ml-6 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Part #: {item.partNumber}</p>
                    <p className="text-sm text-gray-500 mt-1">Vendor: {item.vendor}</p>
                  </div>

                  <div className="ml-6">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 border-r hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 border-l hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="ml-6">
                    <p className="text-lg font-medium text-gray-900">GHS {(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-6 text-red-600 hover:text-red-800"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">GHS {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="text-gray-900">GHS {shippingFee.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">GHS {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/search')}
              className="w-full mt-4 text-indigo-600 border border-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;


