import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AlertCriteria {
  id: string;
  propertyType: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  frequency: 'daily' | 'weekly';
  enabled: boolean;
}

export const PropertyAlerts: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AlertCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<AlertCriteria, 'id'>>({
    propertyType: '',
    location: '',
    minPrice: 0,
    maxPrice: 0,
    bedrooms: 0,
    frequency: 'daily',
    enabled: true
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/user/property-alerts', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/property-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create alert');
      const newAlert = await response.json();
      setAlerts(prev => [...prev, newAlert]);
      setShowForm(false);
      setFormData({
        propertyType: '',
        location: '',
        minPrice: 0,
        maxPrice: 0,
        bedrooms: 0,
        frequency: 'daily',
        enabled: true
      });
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const toggleAlert = async (alertId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/user/property-alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ enabled })
      });

      if (!response.ok) throw new Error('Failed to update alert');
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, enabled } : alert
        )
      );
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/user/property-alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete alert');
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error deleting alert:', error);
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Property Alerts</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          {showForm ? 'Cancel' : 'Create Alert'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, propertyType: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="">Select Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, location: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Min Price (UGX)
              </label>
              <input
                type="number"
                value={formData.minPrice}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, minPrice: Number(e.target.value) }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Price (UGX)
              </label>
              <input
                type="number"
                value={formData.maxPrice}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, maxPrice: Number(e.target.value) }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Bedrooms
              </label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alert Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    frequency: e.target.value as 'daily' | 'weekly'
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Create Alert
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criteria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {alert.propertyType} in {alert.location}
                  </div>
                  <div className="text-sm text-gray-500">
                    UGX {alert.minPrice.toLocaleString()} - {alert.maxPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Min {alert.bedrooms} bedrooms
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {alert.frequency}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleAlert(alert.id, !alert.enabled)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      alert.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {alert.enabled ? 'Active' : 'Paused'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 