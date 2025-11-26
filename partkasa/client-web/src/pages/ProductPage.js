import { getApiBase } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

const ProductPage = () => {
  useSEO({ title: 'PartKasa - Auto part details, fitment, and pricing', description: 'Auto part details, fitment, and pricing' });
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Go Back</button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <img src={product.imageUrl} alt={product.name} className="w-full rounded" />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-xl text-gray-700 mb-4">GHS {product.price?.toFixed(2)}</div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;


