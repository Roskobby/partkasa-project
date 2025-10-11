import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSEO from '../hooks/useSEO';

const SearchPage = () => {
  useSEO({ title: 'PartKasa - Search auto parts by vehicle or part number', description: 'Search auto parts by vehicle or part number' });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchForm, setSearchForm] = useState({
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    year: searchParams.get('year') || '',
    part: searchParams.get('part') || '',
  });

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ priceRange: [0, 10000], inStock: false, location: '' });

  useEffect(() => {
    // Load vehicle metadata (example only)
    const loadMeta = async () => {
      try {
        setMakes(['Toyota', 'Honda', 'Ford']);
      } catch (e) {}
    };
    loadMeta();
  }, []);

  const submitSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams({ ...searchForm, inStock: String(filters.inStock) });
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/search?${params.toString()}`);
      setResults(data.results || []);
      setSearchParams(searchForm);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Parts</h1>
      <form onSubmit={submitSearch} className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select className="border rounded p-2" value={searchForm.make} onChange={(e) => setSearchForm({ ...searchForm, make: e.target.value })}>
            <option value="">Make</option>
            {makes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input className="border rounded p-2" placeholder="Model" value={searchForm.model} onChange={(e) => setSearchForm({ ...searchForm, model: e.target.value })} />
          <input className="border rounded p-2" placeholder="Year" value={searchForm.year} onChange={(e) => setSearchForm({ ...searchForm, year: e.target.value })} />
          <input className="border rounded p-2" placeholder="Part name or number" value={searchForm.part} onChange={(e) => setSearchForm({ ...searchForm, part: e.target.value })} />
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Search</button>
        </div>
      </form>

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
    </div>
  );
};

export default SearchPage;
