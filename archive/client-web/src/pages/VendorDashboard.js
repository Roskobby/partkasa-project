import React from 'react';

const stats = [
  { label: 'Active listings', value: 4 },
  { label: 'Bookings this month', value: 18 },
  { label: 'Avg. rating', value: '4.7/5' },
];

const reservations = [
  {
    id: 'res-1',
    guest: 'Alex Johnson',
    property: 'Modern City Loft',
    dates: 'Aug 18 - Aug 21',
  },
  {
    id: 'res-2',
    guest: 'Priya Singh',
    property: 'Cozy Mountain Cabin',
    dates: 'Aug 22 - Aug 25',
  },
];

function VendorDashboard() {
  return (
    <section className="space-y-6">
      <header className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white shadow">
        <h2 className="text-2xl font-semibold">Vendor dashboard</h2>
        <p className="mt-1 text-sm text-blue-100">Monitor performance, manage listings, and respond to guests.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-4 text-center shadow">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming reservations</h3>
        <ul className="mt-4 space-y-3">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="flex flex-col justify-between gap-2 rounded border border-gray-200 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">{reservation.guest}</p>
                <p className="text-xs text-gray-500">{reservation.property}</p>
              </div>
              <span className="text-sm text-gray-600">{reservation.dates}</span>
              <button className="inline-flex items-center justify-center rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Message guest
              </button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default VendorDashboard;
