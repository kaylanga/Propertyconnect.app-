import React, { useState, useEffect } from 'react';
import { BellIcon, TrashIcon, PencilIcon } from '@heroicons/react/outline';

// Interface defining the structure of a property alert
interface PropertyAlert {
  id: string;
  userId: string;
  // Criteria for matching properties
  criteria: {
    location: string[];        // Array of desired locations
    propertyType: string[];    // Array of property types (e.g., apartment, house)
    priceRange: {
      min: number;            // Minimum price
      max: number;            // Maximum price
    };
    bedrooms: number[];       // Desired number of bedrooms
    bathrooms: number[];      // Desired number of bathrooms
    size: {
      min: number;           // Minimum square footage
      max: number;           // Maximum square footage
    };
    amenities: string[];     // Desired amenities
  };
  frequency: 'daily' | 'weekly' | 'instant';  // How often to send alerts
  active: boolean;           // Whether the alert is currently active
  createdAt: string;        // When the alert was created
  lastTriggered?: string;   // Last time the alert found matching properties
}

export const PropertyAlertSystem: React.FC = () => {
  // State management
  const [alerts, setAlerts] = useState<PropertyAlert[]>([]); // Store all user alerts
  const [showCreateForm, setShowCreateForm] = useState(false); // Control form visibility
  const [editingAlert, setEditingAlert] = useState<PropertyAlert | null>(null); // Currently editing alert
  const [loading, setLoading] = useState(false); // Loading state
  
  // Filter options for the form
  const [locations, setLocations] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  // Form data state with default values
  const [formData, setFormData] = useState({
    location: [] as string[],
    propertyType: [] as string[],
    priceRange: {
      min: 0,
      max: 1000000
    },
    bedrooms: [] as number[],
    bathrooms: [] as number[],
    size: {
      min: 0,
      max: 10000
    },
    amenities: [] as string[],
    frequency: 'daily' as 'daily' | 'weekly' | 'instant'
  });

  // Fetch user's alerts on component mount
  useEffect(() => {
    fetchAlerts();
    fetchFilterOptions();
  }, []);

  // API calls to fetch alerts
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/alerts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch alerts');

      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/properties/filter-options', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch filter options');

      const data = await response.json();
      setLocations(data.locations);
      setPropertyTypes(data.propertyTypes);
      setAmenities(data.amenities);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  // Handle form submission for creating/updating alerts
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/alerts', {
        method: editingAlert ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          id: editingAlert?.id,
          criteria: formData,
          frequency: formData.frequency
        })
      });

      if (!response.ok) throw new Error('Failed to save alert');

      const savedAlert = await response.json();
      
      if (editingAlert) {
        setAlerts(alerts.map(alert => 
          alert.id === savedAlert.id ? savedAlert : alert
        ));
      } else {
        setAlerts([...alerts, savedAlert]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving alert:', error);
    }
  };

  // Delete an alert
  const handleDelete = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete alert');

      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  // Toggle alert active status
  const handleToggleActive = async (alertId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ active })
      });

      if (!response.ok) throw new Error('Failed to toggle alert');

      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, active } : alert
      ));
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      location: [],
      propertyType: [],
      priceRange: {
        min: 0,
        max: 1000000
      },
      bedrooms: [],
      bathrooms: [],
      size: {
        min: 0,
        max: 10000
      },
      amenities: [],
      frequency: 'daily'
    });
    setEditingAlert(null);
    setShowCreateForm(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Property Alerts</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Create Alert
        </button>
      </div>

      {/* Alert Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingAlert ? 'Edit Alert' : 'Create New Alert'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Locations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Locations
              </label>
              <select
                multiple
                value={formData.location}
                onChange={(e) => setFormData({
                  ...formData,
                  location: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full rounded-md border border-gray-300 py-2 px-3"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Types
              </label>
              <select
                multiple
                value={formData.propertyType}
                onChange={(e) => setFormData({
                  ...formData,
                  propertyType: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full rounded-md border border-gray-300 py-2 px-3"
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={formData.priceRange.min}
                  onChange={(e) => setFormData({
                    ...formData,
                    priceRange: {
                      ...formData.priceRange,
                      min: Number(e.target.value)
                    }
                  })}
                  placeholder="Min"
                  className="w-1/2 rounded-md border border-gray-300 py-2 px-3"
                />
                <input
                  type="number"
                  value={formData.priceRange.max}
                  onChange={(e) => setFormData({
                    ...formData,
                    priceRange: {
                      ...formData.priceRange,
                      max: Number(e.target.value)
                    }
                  })}
                  placeholder="Max"
                  className="w-1/2 rounded-md border border-gray-300 py-2 px-3"
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  multiple
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({
                    ...formData,
                    bedrooms: Array.from(e.target.selectedOptions, option => Number(option.value))
                  })}
                  className="w-full rounded-md border border-gray-300 py-2 px-3"
                >
                  {[1, 2, 3, 4, 5, '6+'].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'bedroom' : 'bedrooms'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <select
                  multiple
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({
                    ...formData,
                    bathrooms: Array.from(e.target.selectedOptions, option => Number(option.value))
                  })}
                  className="w-full rounded-md border border-gray-300 py-2 px-3"
                >
                  {[1, 1.5, 2, 2.5, 3, '3+'].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'bathroom' : 'bathrooms'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Size Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size Range (sq ft)
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={formData.size.min}
                  onChange={(e) => setFormData({
                    ...formData,
                    size: {
                      ...formData.size,
                      min: Number(e.target.value)
                    }
                  })}
                  placeholder="Min"
                  className="w-1/2 rounded-md border border-gray-300 py-2 px-3"
                />
                <input
                  type="number"
                  value={formData.size.max}
                  onChange={(e) => setFormData({
                    ...formData,
                    size: {
                      ...formData.size,
                      max: Number(e.target.value)
                    }
                  })}
                  placeholder="Max"
                  className="w-1/2 rounded-md border border-gray-300 py-2 px-3"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <select
                multiple
                value={formData.amenities}
                onChange={(e) => setFormData({
                  ...formData,
                  amenities: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full rounded-md border border-gray-300 py-2 px-3"
              >
                {amenities.map(amenity => (
                  <option key={amenity} value={amenity}>
                    {amenity}
                  </option>
                ))}
              </select>
            </div>

            {/* Alert Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({
                  ...formData,
                  frequency: e.target.value as 'daily' | 'weekly' | 'instant'
                })}
                className="w-full rounded-md border border-gray-300 py-2 px-3"
              >
                <option value="instant">Instant</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                {editingAlert ? 'Update Alert' : 'Create Alert'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerts List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <BellIcon className="h-5 w-5 text-primary-600" />
                    <h4 className="text-lg font-medium text-gray-900">
                      {alert.criteria.location.join(', ')}
                    </h4>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      {alert.criteria.propertyType.join(', ')} •{' '}
                      ${alert.criteria.priceRange.min.toLocaleString()} - 
                      ${alert.criteria.priceRange.max.toLocaleString()}
                    </p>
                    <p>
                      {alert.criteria.bedrooms.join('/')} beds •{' '}
                      {alert.criteria.bathrooms.join('/')} baths •{' '}
                      {alert.criteria.size.min}-{alert.criteria.size.max} sq ft
                    </p>
                    {alert.criteria.amenities.length > 0 && (
                      <p className="mt-1">
                        Amenities: {alert.criteria.amenities.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {alert.frequency}
                    </span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={alert.active}
                        onChange={(e) => handleToggleActive(alert.id, e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAlert(alert);
                      setFormData({
                        ...alert.criteria,
                        frequency: alert.frequency
                      });
                      setShowCreateForm(true);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {alert.lastTriggered && (
                <p className="mt-2 text-xs text-gray-500">
                  Last triggered: {new Date(alert.lastTriggered).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 