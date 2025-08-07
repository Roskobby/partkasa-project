import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchForm, setSearchForm] = useState({
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    year: searchParams.get('year') || '',
    part: searchParams.get('part') || ''
  });
  
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    inStock: false,
    location: ''
  });

  // Fetch car makes on component mount
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/search/vehicles/makes`);
        setMakes(response.data.data);
      } catch (error) {
        console.error('Error fetching makes:', error);
      }
    };
    fetchMakes();
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    if (!searchForm.make) {
      setModels([]);
      return;
    }

    const fetchModels = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/search/vehicles/makes/${searchForm.make}/models`
        );
        setModels(response.data.data);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    fetchModels();
  }, [searchForm.make]);

  // Fetch years when model changes
  useEffect(() => {
    if (!searchForm.model) {
      setYears([]);
      return;
    }

    const fetchYears = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/search/vehicles/makes/${searchForm.make}/models/${searchForm.model}/years`
        );
        setYears(response.data.data);
      } catch (error) {
        console.error('Error fetching years:', error);
      }
    };
    fetchYears();
  }, [searchForm.make, searchForm.model]);

  // Fetch search results when params change
  useEffect(() => {
    const fetchResults = async () => {
      const params = Object.fromEntries([...searchParams]);
      if (Object.keys(params).length === 0) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/search/parts`, {
          params: {
            ...params,
            minPrice: filters.priceRange[0],
            maxPrice: filters.priceRange[1],
            inStock: filters.inStock,
            location: filters.location
          }
        });
        setResults(response.data.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Search Form */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Search Parts</h2>
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Make</label>
                <select
                  value={searchForm.make}
                  onChange={(e) => setSearchForm({
                    ...searchForm,
                    make: e.target.value,
                    model: '',
                    year: ''
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select Make</option>
                  {makes.map((make) => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <select
                  value={searchForm.model}
                  onChange={(e) => setSearchForm({
                    ...searchForm,
                    model: e.target.value,
                    year: ''
                  })}
                  disabled={!searchForm.make}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select Model</option>
                  {models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <select
                  value={searchForm.year}
                  onChange={(e) => setSearchForm({
                    ...searchForm,
                    year: e.target.value
                  })}
                  disabled={!searchForm.model}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Part Name/Number
                </label>
                <input
                  type="text"
                  value={searchForm.part}
                  onChange={(e) => setSearchForm({
                    ...searchForm,
                    part: e.target.value
                  })}
                  placeholder="e.g. Brake Pad or P123456"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {/* Filters */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Range</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters({
                        ...filters,
                        inStock: e.target.checked
                      })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">In Stock Only</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({
                      ...filters,
                      location: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Any Location</option>
                    <option value="Accra">Accra</option>
                    <option value="Kumasi">Kumasi</option>
                    <option value="Tamale">Tamale</option>
                    <option value="Takoradi">Takoradi</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:w-2/3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 bg-white shadow rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((part) => (
                <div
                  key={part.id}
                  className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={part.imageUrl}
                    alt={part.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{part.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Part #: {part.partNumber}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        ₵{part.price.toFixed(2)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        part.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {part.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">{part.location}</span>
                      <button
                        onClick={() => navigate(`/product/${part.id}`)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
