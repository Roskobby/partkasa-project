import { getApiBase } from '../config';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';

const OrdersPage = () => {
  useSEO({ title: 'PartKasa - Your orders and delivery status', description: 'Your orders and delivery status' });
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/orders`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-600">You have not placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">Order #{order.id}</div>
                <div className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">GHS {order.total?.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{order.status}</div>
              </div>
            </div>

            <div className="mt-4 divide-y">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;


