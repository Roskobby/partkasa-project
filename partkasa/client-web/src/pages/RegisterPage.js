import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';

const RegisterPage = () => {
  useSEO({ title: 'PartKasa - Create your account', description: 'Create your PartKasa account' });
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="border rounded p-2 w-full" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input className="border rounded p-2 w-full" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input className="border rounded p-2 w-full" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input className="border rounded p-2 w-full" name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Have an account? <Link to="/login" className="text-indigo-600">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
