import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface PropertyDetails {
  size: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  location: string;
  propertyType: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

interface MarketTrend {
  month: string;
  value: number;
}

export const PropertyValuation: React.FC = () => {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    size: 0,
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: 2000,
    location: '',
    propertyType: 'Apartment',
    condition: 'Good'
  });
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateValuation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/valuation/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(propertyDetails)
      });

      if (!response.ok) throw new Error('Failed to calculate valuation');

      const data = await response.json();
      setEstimatedValue(data.estimatedValue);
      setMarketTrends(data.marketTrends);
    } catch (error) {
      console.error('Error calculating valuation:', error);
      alert('Failed to calculate property valuation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPropertyDetails((prev) => ({
      ...prev,
      [name]: name === 'size' || name === 'yearBuilt' ? Number(value) : value
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Property Valuation Tool
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Details Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Size (sq ft)
            </label>
            <input
              type="number"
              name="size"
              value={propertyDetails.size}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={propertyDetails.bedrooms}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={propertyDetails.bathrooms}
                onChange={handleInputChange}
                min="0"
                step="0.5"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Year Built
            </label>
            <input
              type="number"
              name="yearBuilt"
              value={propertyDetails.yearBuilt}
              onChange={handleInputChange}
              min="1800"
              max={new Date().getFullYear()}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={propertyDetails.location}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter address or area"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              name="propertyType"
              value={propertyDetails.propertyType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select
              name="condition"
              value={propertyDetails.condition}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <button
            onClick={calculateValuation}
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Calculating...' : 'Calculate Valuation'}
          </button>
        </div>

        {/* Valuation Results */}
        <div className="space-y-6">
          {estimatedValue && (
            <>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Estimated Value
                </h3>
                <p className="text-3xl font-bold text-primary-600">
                  {formatCurrency(estimatedValue)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Based on current market conditions and comparable properties
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Market Trends
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={marketTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat('en-US', {
                            notation: 'compact',
                            compactDisplay: 'short',
                            currency: 'USD',
                            style: 'currency'
                          }).format(value)
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          'Value'
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4F46E5"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 