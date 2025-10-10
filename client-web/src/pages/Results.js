import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { listings } from '../data/listings';

function Results() {
  const [params] = useSearchParams();
  const destination = params.get('destination');
  const checkIn = params.get('checkIn');
  const checkOut = params.get('checkOut');
  const guests = params.get('guests');

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-900">Available stays</h2>
        <p className="mt-2 text-sm text-gray-600">
          Showing results for <span className="font-medium text-gray-900">{destination || 'anywhere'}</span>
          {checkIn && checkOut ? ` · ${checkIn} to ${checkOut}` : ''}
          {guests ? ` · ${guests} guests` : ''}
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {listings.map((listing) => (
          <article key={listing.id} className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{listing.location}</p>
            <p className="mt-2 text-sm text-gray-900">${listing.pricePerNight} / night</p>
            <p className="mt-1 text-xs text-gray-500">Rating: {listing.rating} / 5</p>
            <Link
              to={`/checkout/${listing.id}`}
              className="mt-4 inline-flex items-center justify-center rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              state={{ listingId: listing.id }}
            >
              Book now
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Results;
