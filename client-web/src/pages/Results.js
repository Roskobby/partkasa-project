import React, { useMemo } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { listings } from '../data/listings';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function formatDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return dateFormatter.format(date);
}

function Results() {
  const [params] = useSearchParams();
  const location = useLocation();
  const searchState = location.state?.search ?? {};

  const destinationParam = params.get('destination');
  const checkInParam = params.get('checkIn');
  const checkOutParam = params.get('checkOut');
  const guestsParam = params.get('guests');

  const destination = destinationParam && destinationParam.trim().length > 0
    ? destinationParam.trim()
    : searchState.destination || '';
  const checkIn = checkInParam && checkInParam.trim().length > 0 ? checkInParam : searchState.checkIn || '';
  const checkOut = checkOutParam && checkOutParam.trim().length > 0 ? checkOutParam : searchState.checkOut || '';
  const guests = guestsParam && guestsParam.trim().length > 0
    ? Number(guestsParam)
    : typeof searchState.guests === 'number'
      ? searchState.guests
      : null;

  const normalizedDestination = destination.toLowerCase();

  const filteredListings = useMemo(() => {
    if (!normalizedDestination) {
      return listings;
    }

    return listings.filter((listing) => listing.location.toLowerCase().includes(normalizedDestination));
  }, [normalizedDestination]);

  const queryString = params.toString();
  const checkoutSearch = queryString ? `?${queryString}` : '';

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-gray-900">Available stays</h2>
        <p className="mt-2 text-sm text-gray-600">
          Showing results for <span className="font-medium text-gray-900">{destination || 'anywhere'}</span>
          {checkIn && checkOut ? ` · ${formatDate(checkIn)} to ${formatDate(checkOut)}` : ''}
          {typeof guests === 'number' ? ` · ${guests} ${guests === 1 ? 'guest' : 'guests'}` : ''}
        </p>
      </header>
      {filteredListings.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-sm text-gray-700">
            We couldn&apos;t find any stays matching <span className="font-medium text-gray-900">{destination}</span>. Try a
            different location or broaden your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {filteredListings.map((listing) => (
            <article key={listing.id} className="rounded-lg bg-white p-4 shadow">
              <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{listing.location}</p>
              <p className="mt-2 text-sm text-gray-900">${listing.pricePerNight} / night</p>
              <p className="mt-1 text-xs text-gray-500">Rating: {listing.rating} / 5</p>
              <Link
                to={{ pathname: `/checkout/${listing.id}`, search: checkoutSearch }}
                className="mt-4 inline-flex items-center justify-center rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                state={{ listingId: listing.id, search: { destination, checkIn, checkOut, guests } }}
              >
                Book now
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Results;
