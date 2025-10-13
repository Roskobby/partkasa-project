import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSEO from '../hooks/useSEO';

const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

const SearchResultsPage = () => {
  useSEO({ title: 'PartKasa - Search results for auto parts', description: 'Search results for auto parts' });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ priceRange: [0, 10000], locations: [], inStock: false });
  const [sortBy, setSortBy] = useState('newest');

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchParams.get('part') || '',
        page: String(currentPage),
        sort: sortBy,
        inStock: String(filters.inStock),
      });
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/search?${params.toString()}`);
      setResults(data.results || []);
      setTotalResults(data.total || 0);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>

      <div className="flex items-center gap-4 mb-6">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded p-2">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={filters.inStock} onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })} />
          In Stock
        </label>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((r) => (
            <div key={r.id} className="bg-white rounded shadow p-4">
              <div className="font-semibold mb-1">{r.name}</div>
              <div className="text-sm text-gray-600">GHS {r.price?.toFixed(2)}</div>
              <button className="mt-3 text-indigo-600" onClick={() => navigate(`/product/${r.id}`)}>View</button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex items-center gap-3">
        <button className="px-3 py-1 border rounded" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
        <span className="text-sm">Page {currentPage}</span>
        <button className="px-3 py-1 border rounded" onClick={() => setCurrentPage((p) => p + 1)} disabled={results.length === 0}>Next</button>
      </div>
    </div>
  );
};

export default SearchResultsPage;
