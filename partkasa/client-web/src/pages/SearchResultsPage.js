import useSEO from '../hooks/useSEO';

export default (function WrapSEO(Component){
  return function SEOPageWrapper(props){
    useSEO({ title: 'PartKasa � Search results for auto parts', description: 'Search results for auto parts' });
    return <Component {...props} />;
  }
})(import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Newest', value: 'newest' }
];

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    locations: [],
    inStock: false,
    vendors: [],
    ratings: []
  });

  const [sort, setSort] = useState('price_asc');

  // Fetch results whenever filters, sort, or page changes
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = {
          ...Object.fromEntries(searchParams),
          page: currentPage,
          sort,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          locations: filters.locations.join(','),
          inStock: filters.inStock,
          vendors: filters.vendors.join(','),
          ratings: filters.ratings.join(',')
        };

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/search/parts`, {
          params
        });

        setResults(response.data.data);
        setTotalResults(response.data.total);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams, currentPage, sort, filters]);

  const handleSortChange = (value) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {totalResults} Results Found
        </h1>
        
        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [
                    parseInt(e.target.value),
                    filters.priceRange[1]
                  ])}
                  className="w-1/2 rounded-md border-gray-300"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [
                    filters.priceRange[0],
                    parseInt(e.target.value)
                  ])}
                  className="w-1/2 rounded-md border-gray-300"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Location checkboxes */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
              {['Accra', 'Kumasi', 'Tamale', 'Takoradi'].map((location) => (
                <label key={location} className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={filters.locations.includes(location)}
                    onChange={(e) => {
                      const newLocations = e.target.checked
                        ? [...filters.locations, location]
                        : filters.locations.filter(l => l !== location);
                      handleFilterChange('locations', newLocations);
                    }}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">{location}</span>
                </label>
              ))}
            </div>

            {/* Availability toggle */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  In Stock Only
                </span>
              </label>
            </div>

            {/* Rating filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={filters.ratings.includes(rating)}
                    onChange={(e) => {
                      const newRatings = e.target.checked
                        ? [...filters.ratings, rating]
                        : filters.ratings.filter(r => r !== rating);
                      handleFilterChange('ratings', newRatings);
                    }}
                    className="rounded border-gray-300 text-indigo-600"
                  />
                  <div className="ml-2 flex items-center">
                    {[...Array(rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">& up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 bg-white shadow rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((part) => (
                  <div
                    key={part.id}
                    className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/product/${part.id}`)}
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={part.imageUrl}
                        alt={part.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {part.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Part #: {part.partNumber}
                      </p>
                      <div className="mt-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < part.rating
                                ? 'text-yellow-400'
                                : 'text-gray-200'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-500 ml-2">
                          ({part.reviewCount})
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          ₵{part.price.toFixed(2)}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            part.inStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {part.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">
                          {part.location} • {part.vendor}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {[...Array(Math.ceil(totalResults / 12))].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
\n);\n