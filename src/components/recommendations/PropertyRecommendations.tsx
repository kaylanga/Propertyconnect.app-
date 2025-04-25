import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { StarIcon } from '@heroicons/react/solid';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  matchScore: number;
  matchReasons: string[];
}

interface RecommendationPreferences {
  priceRange: {
    min: number;
    max: number;
  };
  propertyTypes: string[];
  locations: string[];
  minBedrooms: number;
  minBathrooms: number;
  amenities: string[];
}

export const PropertyRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<RecommendationPreferences>({
    priceRange: { min: 0, max: 1000000 },
    propertyTypes: [],
    locations: [],
    minBedrooms: 1,
    minBathrooms: 1,
    amenities: []
  });
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
      fetchRecommendations();
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch preferences');
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Recommended Properties
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Based on your preferences and browsing history
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Customize Preferences
        </button>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Customize Recommendations
            </h3>
            <div className="space-y-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <input
                    type="number"
                    value={preferences.priceRange.min}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        priceRange: {
                          ...preferences.priceRange,
                          min: Number(e.target.value)
                        }
                      })
                    }
                    placeholder="Min Price"
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    value={preferences.priceRange.max}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        priceRange: {
                          ...preferences.priceRange,
                          max: Number(e.target.value)
                        }
                      })
                    }
                    placeholder="Max Price"
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Property Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Property Types
                </label>
                <select
                  multiple
                  value={preferences.propertyTypes}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      propertyTypes: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      )
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Locations */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Locations
                </label>
                <input
                  type="text"
                  value={preferences.locations.join(', ')}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      locations: e.target.value.split(',').map((l) => l.trim())
                    })
                  }
                  placeholder="Enter locations (comma-separated)"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min Bedrooms
                  </label>
                  <input
                    type="number"
                    value={preferences.minBedrooms}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        minBedrooms: Number(e.target.value)
                      })
                    }
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min Bathrooms
                  </label>
                  <input
                    type="number"
                    value={preferences.minBathrooms}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        minBathrooms: Number(e.target.value)
                      })
                    }
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Desired Amenities
                </label>
                <select
                  multiple
                  value={preferences.amenities}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      amenities: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      )
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="Pool">Pool</option>
                  <option value="Gym">Gym</option>
                  <option value="Parking">Parking</option>
                  <option value="Security">Security</option>
                  <option value="Garden">Garden</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPreferences(false);
                  fetchRecommendations();
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Apply Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="relative h-48">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-sm font-medium text-primary-600">
                  {property.matchScore}% Match
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{property.location}</p>
                <p className="text-xl font-bold text-primary-600 mb-2">
                  {formatCurrency(property.price)}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="mr-3">{property.bedrooms} beds</span>
                  <span className="mr-3">{property.bathrooms} baths</span>
                  <span>{property.size} sq ft</span>
                </div>
                <div className="space-y-2">
                  {property.matchReasons.map((reason, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 