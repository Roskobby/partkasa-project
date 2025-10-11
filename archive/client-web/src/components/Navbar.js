import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Search' },
  { to: '/results', label: 'Results' },
  { to: '/checkout', label: 'Checkout' },
  { to: '/profile', label: 'Profile' },
  { to: '/vendor', label: 'Vendor' },
];

const activeClasses = 'text-blue-600 border-b-2 border-blue-600';
const baseClasses =
  'px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors';

function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <span className="text-xl font-semibold text-blue-600">PartKasa</span>
        <nav className="flex items-center gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `${baseClasses} ${isActive ? activeClasses : 'border-b-2 border-transparent'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
