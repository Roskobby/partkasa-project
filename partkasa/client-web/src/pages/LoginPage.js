import React, { useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';

const LoginPage = () => {
  useSEO({ title: 'PartKasa - Login', description: 'Login to your PartKasa account' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = useMemo(() => searchParams.get('redirect') || '/', [searchParams]);
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(formData.email.trim(), formData.password);
      navigate(redirectTo);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-secondary-50">
      <div className="w-full max-w-md bg-white border border-secondary-200 rounded-2xl shadow-card p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Login</h1>
        <p className="text-secondary-600 mb-6">Welcome back. Enter your details to continue.</p>
        {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1" htmlFor="email">Email</label>
            <input id="email" className="border border-secondary-300 rounded-md p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary-500" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" className="border border-secondary-300 rounded-md p-2.5 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute inset-y-0 right-0 px-3 text-secondary-500 text-sm">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-2.5 rounded-md hover:bg-primary-700 disabled:opacity-50">
            {isLoading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-secondary-600">
          No account? <Link to="/register" className="text-primary-600 hover:text-primary-700">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
