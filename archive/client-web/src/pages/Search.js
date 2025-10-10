import React from 'react';

const Search = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Search Parts</h2>
      <p className="text-gray-600">This is a placeholder search page.</p>
      <form className="space-y-2">
        <input className="border rounded px-3 py-2 w-full" placeholder="Part name or number" />
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
      </form>
    </div>
  );
};

export default Search;

