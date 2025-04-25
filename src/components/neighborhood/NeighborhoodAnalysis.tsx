import React, { useState, useEffect } from 'react';

interface NeighborhoodData {
  safety: {
    crimeRate: number;
    policeStations: number;
    emergencyResponse: number;
  };
  education: {
    schools: number;
    averageRating: number;
    topSchool: string;
  };
  amenities: {
    restaurants: number;
    shopping: number;
    parks: number;
    hospitals: number;
  };
  transportation: {
    publicTransit: number;
    walkScore: number;
    bikeScore: number;
  };
  demographics: {
    population: number;
    medianAge: number;
    medianIncome: number;
  };
}

interface NeighborhoodStats {
  category: string;
  score: number;
  details: string[];
}

export const NeighborhoodAnalysis: React.FC = () => {
  const [location, setLocation] = useState('');
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<NeighborhoodStats[]>([]);

  const fetchNeighborhoodData = async () => {
    if (!location) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/neighborhood/analysis?location=${encodeURIComponent(location)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch neighborhood data');

      const data = await response.json();
      setNeighborhoodData(data);
      
      // Process data into stats
      const processedStats: NeighborhoodStats[] = [
        {
          category: 'Safety',
          score: calculateScore(data.safety),
          details: [
            `Crime rate: ${data.safety.crimeRate} incidents per 1000 residents`,
            `${data.safety.policeStations} police stations nearby`,
            `Emergency response time: ${data.safety.emergencyResponse} minutes`
          ]
        },
        {
          category: 'Education',
          score: calculateScore(data.education),
          details: [
            `${data.education.schools} schools in the area`,
            `Average school rating: ${data.education.averageRating}/10`,
            `Top rated school: ${data.education.topSchool}`
          ]
        },
        {
          category: 'Amenities',
          score: calculateScore(data.amenities),
          details: [
            `${data.amenities.restaurants} restaurants`,
            `${data.amenities.shopping} shopping centers`,
            `${data.amenities.parks} parks and recreation areas`,
            `${data.amenities.hospitals} medical facilities`
          ]
        },
        {
          category: 'Transportation',
          score: calculateScore(data.transportation),
          details: [
            `Public transit score: ${data.transportation.publicTransit}/100`,
            `Walk score: ${data.transportation.walkScore}/100`,
            `Bike score: ${data.transportation.bikeScore}/100`
          ]
        }
      ];

      setStats(processedStats);
    } catch (error) {
      console.error('Error fetching neighborhood data:', error);
      alert('Failed to fetch neighborhood data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (categoryData: any): number => {
    // Implement your scoring logic here
    // This is a simplified example
    const values = Object.values(categoryData).filter(v => typeof v === 'number');
    return Math.round(
      (values.reduce((sum: number, val: any) => sum + val, 0) / values.length) * 10
    );
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Neighborhood Analysis
      </h2>

      {/* Search Section */}
      <div className="max-w-xl mb-8">
        <div className="flex space-x-4">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter neighborhood or address"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <button
            onClick={fetchNeighborhoodData}
            disabled={!location || loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {neighborhoodData && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.category}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {stat.category}
                </h3>
                <p className={`text-3xl font-bold ${getScoreColor(stat.score)}`}>
                  {stat.score}/10
                </p>
              </div>
            ))}
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div key={stat.category} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {stat.category} Details
                </h3>
                <ul className="space-y-2">
                  {stat.details.map((detail, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <svg
                        className="h-5 w-5 text-primary-500 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Demographics Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Demographics
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Population
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {neighborhoodData.demographics.population.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Median Age
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {neighborhoodData.demographics.medianAge}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Median Income
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(neighborhoodData.demographics.medianIncome)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 