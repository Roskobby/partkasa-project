import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';

const ProfilePage = () => {
  useSEO({ title: 'PartKasa - Your profile and settings', description: 'Your profile and settings' });
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        setProfile(data);
        setFormData({ name: data.name || '', email: data.email || '', phone: data.phone || '', address: data.address || '' });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(formData),
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        {!isEditing ? (
          <div className="space-y-2">
            <div><span className="font-semibold">Name:</span> {profile?.name}</div>
            <div><span className="font-semibold">Email:</span> {profile?.email}</div>
            <div><span className="font-semibold">Phone:</span> {profile?.phone}</div>
            <div><span className="font-semibold">Address:</span> {profile?.address}</div>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        ) : (
          <div className="space-y-3">
            <input className="border rounded p-2 w-full" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input className="border rounded p-2 w-full" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input className="border rounded p-2 w-full" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <input className="border rounded p-2 w-full" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleSave}>Save</button>
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
