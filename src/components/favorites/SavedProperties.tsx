import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';

interface SavedProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  type: 'sale' | 'rent';
  bedrooms: number;
  bathrooms: number;
  size: number;
  mainImage: string;
  savedAt: string;
}

export const SavedProperties = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedProperties();
    }
  }, [user]);

  const fetchSavedProperties = async () => {
    try {
      const response = await fetch('/api/user/saved-properties', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch saved properties');
      const data = await response.json();
      setSavedProperties(data);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/user/saved-properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to remove property');
      setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error removing saved property:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Properties</h2>

      {savedProperties.length === 0 ? (
        <div className="text-center py-12">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No saved properties</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start saving properties you're interested in!
          </p>
          <div className="mt-6">
            <Link
              to="/properties"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={property.mainImage}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeSavedProperty(property.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100"
                >
                  <HeartIcon className="h-5 w-5 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  <Link to={`/properties/${property.id}`} className="hover:text-primary-600">
                    {property.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{property.location}</p>
                <p className="mt-2 text-lg font-medium text-primary-600">
                  UGX {property.price.toLocaleString()}
                  {property.type === 'rent' && '/month'}
                </p>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>{property.bedrooms} beds</span>
                  <span className="mx-2">•</span>
                  <span>{property.bathrooms} baths</span>
                  <span className="mx-2">•</span>
                  <span>{property.size} sqft</span>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Saved on {new Date(property.savedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 