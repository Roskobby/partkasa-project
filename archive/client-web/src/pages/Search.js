import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  destination: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
};

function Search() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: name === 'guests' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const checkInDate = form.checkIn ? new Date(form.checkIn) : null;
    const checkOutDate = form.checkOut ? new Date(form.checkOut) : null;

    if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
      setError('Check-out must be after check-in.');
      return;
    }

    setError('');

    const trimmedDestination = form.destination.trim();
    const params = new URLSearchParams();

    if (trimmedDestination) {
      params.set('destination', trimmedDestination);
    }

    if (form.checkIn) {
      params.set('checkIn', form.checkIn);
    }

    if (form.checkOut) {
      params.set('checkOut', form.checkOut);
    }

    if (typeof form.guests === 'number' && form.guests > 0) {
      params.set('guests', String(form.guests));
    }

    const searchQuery = params.toString();

    navigate(
      {
        pathname: '/results',
        search: searchQuery ? `?${searchQuery}` : '',
      },
      {
        state: {
          search: {
            destination: trimmedDestination,
            checkIn: form.checkIn,
            checkOut: form.checkOut,
            guests: typeof form.guests === 'number' && form.guests > 0 ? form.guests : null,
          },
        },
      },
    );
  };

  return (
    <section className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
      <h2 className="text-2xl font-semibold text-gray-900">Find your next stay</h2>
      <p className="mt-2 text-sm text-gray-600">
        Search for unique stays, experiences, and more in just a few clicks.
      </p>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Destination
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            className="mt-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Where are you going?"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Guests
          <input
            type="number"
            name="guests"
            min="1"
            value={form.guests}
            onChange={handleChange}
            className="mt-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Check-in
          <input
            type="date"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            className="mt-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Check-out
          <input
            type="date"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            className="mt-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </label>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Search stays
          </button>
        </div>
      </form>
    </section>
  );
}

export default Search;
