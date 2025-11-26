import { getApiBase } from '../config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';

const CheckoutPage = () => {
  useSEO({ title: 'PartKasa - Checkout and payment', description: 'Checkout and payment' });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    region: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/cart`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await res.json();
        setCart(data);
      } catch (err) {
        setError('Failed to load cart.');
      } finally {
        setLoading(false);
      }
    };
    if (user) loadCart();
    else setLoading(false);
  }, [user]);

  const placeOrder = async () => {
    try {
      setShowPaymentModal(true);
      // TODO: integrate real payment
    } catch (err) {
      setError('Failed to initiate payment.');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="mb-6">Please log in to continue to checkout.</p>
        <button
          onClick={() => navigate('/login?redirect=/checkout')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-600 mb-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step indicator */}
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded ${step >= s ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            ))}
          </div>

          {/* Delivery info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="border rounded p-2" placeholder="Full name" value={deliveryInfo.fullName} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })} />
              <input className="border rounded p-2" placeholder="Phone" value={deliveryInfo.phone} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })} />
              <input className="border rounded p-2 sm:col-span-2" placeholder="Address" value={deliveryInfo.address} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })} />
              <input className="border rounded p-2" placeholder="City" value={deliveryInfo.city} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })} />
              <input className="border rounded p-2" placeholder="Region" value={deliveryInfo.region} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, region: e.target.value })} />
              <input className="border rounded p-2 sm:col-span-2" placeholder="Notes" value={deliveryInfo.notes} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })} />
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input type="radio" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} />
                <span>Mobile Money</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <span>Card</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <button
            onClick={placeOrder}
            className="w-full mt-6 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Place Order
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-full max-w-md text-center">
            <h3 className="text-xl font-semibold mb-4">Processing Payment...</h3>
            <p className="text-gray-600">This is a placeholder for payment flow.</p>
            <button className="mt-6 px-4 py-2 bg-gray-200 rounded" onClick={() => setShowPaymentModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;


