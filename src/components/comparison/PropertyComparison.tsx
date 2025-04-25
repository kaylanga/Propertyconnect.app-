import React, { useState, useEffect } from 'react';
import { XIcon, PlusIcon } from '@heroicons/react/outline';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  yearBuilt: number;
  amenities: string[];
  images: string[];
  description: string;
  status: 'Available' | 'Sold' | 'Under Contract';
  features: {
    [key: string]: string | number | boolean;
  };
}

interface ComparisonFeature {
  name: string;
  key: keyof Property | string;
  type: 'number' | 'string' | 'array' | 'boolean' | 'price';
}

const FEATURES: ComparisonFeature[] = [
  { name: 'Price', key: 'price', type: 'price' },
  { name: 'Location', key: 'location', type: 'string' },
  { name: 'Property Type', key: 'type', type: 'string' },
  { name: 'Bedrooms', key: 'bedrooms', type: 'number' },
  { name: 'Bathrooms', key: 'bathrooms', type: 'number' },
  { name: 'Size (sq ft)', key: 'size', type: 'number' },
  { name: 'Year Built', key: 'yearBuilt', type: 'number' },
  { name: 'Amenities', key: 'amenities', type: 'array' },
  { name: 'Status', key: 'status', type: 'string' }
];

export const PropertyComparison: React.FC = () => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      searchProperties();
    }
  }, [searchTerm]);

  const searchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/properties/search?q=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to search properties');

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProperty = (property: Property) => {
    if (selectedProperties.length < 3 && !selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property]);
    }
    setShowSearchModal(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeProperty = (propertyId: string) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId));
  };

  const formatValue = (value: any, type: ComparisonFeature['type']) => {
    switch (type) {
      case 'price':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'array':
        return Array.isArray(value) ? value.join(', ') : value;
      case 'boolean':
        return value ? '✓' : '✗';
      default:
        return value;
    }
  };

  const getComparisonClass = (feature: ComparisonFeature, value: any) => {
    if (feature.type === 'array' || feature.type === 'string') return '';
    
    const values = selectedProperties.map(p => {
      const val = feature.key.includes('.')
        ? feature.key.split('.').reduce((obj, key) => obj[key], p)
        : p[feature.key as keyof Property];
      return typeof val === 'number' ? val : 0;
    });
    
    const max = Math.max(...values);
    const min = Math.min(...values);

    if (value === max && max !== min) return 'text-green-600 font-semibold';
    if (value === min && max !== min) return 'text-red-600 font-semibold';
    return '';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Compare Properties
        </h2>
        {selectedProperties.length < 3 && (
          <button
            onClick={() => setShowSearchModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Property
          </button>
        )}
      </div>

      {/* Property Cards */}
      {selectedProperties.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedProperties.map((property) => (
              <div
                key={property.id}
                className="relative bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <button
                  onClick={() => removeProperty(property.id)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                >
                  <XIcon className="h-5 w-5 text-gray-500" />
                </button>
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500">{property.location}</p>
                  <p className="mt-2 text-2xl font-bold text-primary-600">
                    {formatValue(property.price, 'price')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  {selectedProperties.map((property) => (
                    <th
                      key={property.id}
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {property.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {FEATURES.map((feature) => (
                  <tr key={feature.key}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {feature.name}
                    </td>
                    {selectedProperties.map((property) => {
                      const value = feature.key.includes('.')
                        ? feature.key.split('.').reduce((obj, key) => obj[key], property)
                        : property[feature.key as keyof Property];
                      
                      return (
                        <td
                          key={`${property.id}-${feature.key}`}
                          className={`px-3 py-4 text-sm ${getComparisonClass(
                            feature,
                            value
                          )}`}
                        >
                          {formatValue(value, feature.type)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Add properties to compare their features side by side
          </p>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Add Property to Compare
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search properties..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => addProperty(property)}
                  >
                    <div className="flex items-center">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {property.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {property.location}
                        </p>
                        <p className="text-sm font-medium text-primary-600">
                          {formatValue(property.price, 'price')}
                        </p>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-900">
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 