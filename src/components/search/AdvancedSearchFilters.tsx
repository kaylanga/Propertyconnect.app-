import React, { useState, useEffect } from 'react';
import { SearchIcon, AdjustmentsIcon } from '@heroicons/react/outline';
import { debounce } from 'lodash';

interface SearchFilters {
  priceRange: {
    min: number;
    max: number;
  };
  propertyTypes: string[];
  bedrooms: number[];
  bathrooms: number[];
  size: {
    min: number;
    max: number;
  };
  amenities: string[];
  location: {
    city: string;
    neighborhood?: string;
    radius: number;
  };
  status: string[];
  sortBy: string;
  yearBuilt: {
    min: number;
    max: number;
  };
}

interface SearchResults {
  total: number;
  properties: any[];
}

export const AdvancedSearchFilters: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 1000000 },
    propertyTypes: [],
    bedrooms: [],
    bathrooms: [],
    size: { min: 0, max: 10000 },
    amenities: [],
    location: {
      city: '',
      neighborhood: '',
      radius: 10
    },
    status: ['Available'],
    sortBy: 'newest',
    yearBuilt: {
      min: 1900,
      max: new Date().getFullYear()
    }
  });

  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = debounce(async (searchFilters: SearchFilters) => {
    setLoading(true);
    try {
      const response = await fetch('/api/properties/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(searchFilters)
      });

      if (!response.ok) throw new Error('Failed to fetch search results');

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(filters);
  }, [filters]);

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: any,
    nestedKey?: string
  ) => {
    setFilters((prev) => {
      if (nestedKey) {
        return {
          ...prev,
          [key]: {
            ...prev[key],
            [nestedKey]: value
          }
        };
      }
      return {
        ...prev,
        [key]: value
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 1000000 },
      propertyTypes: [],
      bedrooms: [],
      bathrooms: [],
      size: { min: 0, max: 10000 },
      amenities: [],
      location: {
        city: '',
        neighborhood: '',
        radius: 10
      },
      status: ['Available'],
      sortBy: 'newest',
      yearBuilt: {
        min: 1900,
        max: new Date().getFullYear()
      }
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by location..."
              value={filters.location.city}
              onChange={(e) =>
                handleFilterChange('location', e.target.value, 'city')
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pl-10"
            />
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-4 p-2 text-gray-400 hover:text-gray-500"
          >
            <AdjustmentsIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    handleFilterChange('priceRange', {
                      ...filters.priceRange,
                      min: Number(e.target.value)
                    })
                  }
                  placeholder="Min"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    handleFilterChange('priceRange', {
                      ...filters.priceRange,
                      max: Number(e.target.value)
                    })
                  }
                  placeholder="Max"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Property Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                multiple
                value={filters.propertyTypes}
                onChange={(e) =>
                  handleFilterChange(
                    'propertyTypes',
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <select
                multiple
                value={filters.bedrooms}
                onChange={(e) =>
                  handleFilterChange(
                    'bedrooms',
                    Array.from(e.target.selectedOptions, (option) =>
                      Number(option.value)
                    )
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <select
                multiple
                value={filters.bathrooms}
                onChange={(e) =>
                  handleFilterChange(
                    'bathrooms',
                    Array.from(e.target.selectedOptions, (option) =>
                      Number(option.value)
                    )
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Size Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size (sq ft)
              </label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={filters.size.min}
                  onChange={(e) =>
                    handleFilterChange('size', {
                      ...filters.size,
                      min: Number(e.target.value)
                    })
                  }
                  placeholder="Min"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <input
                  type="number"
                  value={filters.size.max}
                  onChange={(e) =>
                    handleFilterChange('size', {
                      ...filters.size,
                      max: Number(e.target.value)
                    })
                  }
                  placeholder="Max"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amenities
              </label>
              <select
                multiple
                value={filters.amenities}
                onChange={(e) =>
                  handleFilterChange(
                    'amenities',
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="pool">Pool</option>
                <option value="gym">Gym</option>
                <option value="parking">Parking</option>
                <option value="security">Security</option>
                <option value="garden">Garden</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear all filters
            </button>
            <div className="flex items-center space-x-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="size">Size</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {results && (
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              {results.total} properties found
            </div>
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
                Updating results...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 