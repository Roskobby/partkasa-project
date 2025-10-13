import React from 'react';

const trips = [
  {
    id: 'trip-1',
    destination: 'Lisbon, Portugal',
    dates: 'Sep 10 - Sep 15, 2024',
    status: 'Confirmed',
  },
  {
    id: 'trip-2',
    destination: 'Kyoto, Japan',
    dates: 'Oct 02 - Oct 09, 2024',
    status: 'In planning',
  },
];

function Profile() {
  return (
    <section className="mx-auto max-w-4xl space-y-6 rounded-lg bg-white p-6 shadow">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Your profile</h2>
          <p className="mt-1 text-sm text-gray-600">Manage your information, bookings, and preferences.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-600 hover:text-blue-600">
          Edit profile
        </button>
      </header>
      <section>
        <h3 className="text-lg font-semibold text-gray-900">Upcoming trips</h3>
        <ul className="mt-3 space-y-3">
          {trips.map((trip) => (
            <li key={trip.id} className="flex flex-col justify-between rounded border border-gray-200 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">{trip.destination}</p>
                <p className="text-xs text-gray-500">{trip.dates}</p>
              </div>
              <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 sm:mt-0">
                {trip.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="text-lg font-semibold text-gray-900">Saved preferences</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-gray-200 p-4 text-sm text-gray-600">
            <span className="block text-xs font-semibold uppercase text-gray-500">Language</span>
            English (US)
          </div>
          <div className="rounded border border-gray-200 p-4 text-sm text-gray-600">
            <span className="block text-xs font-semibold uppercase text-gray-500">Currency</span>
            USD - $
          </div>
          <div className="rounded border border-gray-200 p-4 text-sm text-gray-600">
            <span className="block text-xs font-semibold uppercase text-gray-500">Notifications</span>
            Email & push alerts
          </div>
        </div>
      </section>
    </section>
  );
}

export default Profile;
