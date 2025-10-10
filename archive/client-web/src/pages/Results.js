import React from 'react';

const Results = () => {
  const items = [
    { id: 1, name: 'Brake Pads', price: 120 },
    { id: 2, name: 'Air Filter', price: 40 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="p-4 bg-white rounded shadow flex justify-between">
            <span>{item.name}</span>
            <span className="font-medium">${item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;

