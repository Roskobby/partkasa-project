import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getListingById } from '../data/listings';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function Checkout() {
  const params = useParams();
  const location = useLocation();
  const listingId = params.listingId || location.state?.listingId || null;
  const listing = listingId ? getListingById(listingId) : undefined;

  if (!listing) {
    return (
      <section className="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-6 text-center shadow">
        <h2 className="text-2xl font-semibold text-gray-900">We need a listing to book</h2>
        <p className="text-sm text-gray-600">
          The booking flow works best when started from the results page so we know which stay you selected.
        </p>
        <Link
          to="/results"
          className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Browse stays
        </Link>
      </section>
    );
  }

  const { title, location: city, pricePerNight, summary } = listing;
  const nights = summary.nights ?? 1;
  const total = pricePerNight * nights;

  return (
    <section className="mx-auto max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow">
      <header>
        <h2 className="text-2xl font-semibold text-gray-900">Complete your booking</h2>
        <p className="mt-2 text-sm text-gray-600">
          Review your stay details and confirm your reservation.
        </p>
      </header>
      <div className="space-y-4">
        <div className="rounded border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">Reservation summary</h3>
          <dl className="mt-3 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <dt>Accommodation</dt>
              <dd>{title}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Location</dt>
              <dd>{city}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Dates</dt>
              <dd>
                {summary.checkIn} - {summary.checkOut}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Guests</dt>
              <dd>{summary.guests}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Nightly rate</dt>
              <dd>{formatCurrency(pricePerNight)}</dd>
            </div>
            <div className="flex justify-between font-semibold text-gray-900">
              <dt>Total ({nights} {nights === 1 ? 'night' : 'nights'})</dt>
              <dd>{formatCurrency(total)}</dd>
            </div>
          </dl>
        </div>
        <form className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="card">
              Payment details
            </label>
            <input
              id="card"
              name="card"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              required
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="1234 5678 9012 3456"
              pattern="[0-9 ]{12,23}"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Confirm reservation
          </button>
        </form>
      </div>
    </section>
  );
}

export default Checkout;
