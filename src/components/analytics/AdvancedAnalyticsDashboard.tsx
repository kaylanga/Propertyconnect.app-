import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUpIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ViewGridIcon,
  LocationMarkerIcon
} from '@heroicons/react/outline';

// Interface for analytics data structure
interface AnalyticsData {
  // Overview metrics
  overview: {
    totalListings: number;     // Total number of properties listed
    activeListings: number;    // Currently active listings
    totalViews: number;        // Total property views
    totalEnquiries: number;    // Total inquiries received
    totalRevenue: number;      // Total revenue generated
    conversionRate: number;    // Conversion rate (inquiries/views)
  };
  
  // Time-series data for trends
  trends: {
    listings: Array<{ date: string; count: number }>;
    views: Array<{ date: string; count: number }>;
    enquiries: Array<{ date: string; count: number }>;
    revenue: Array<{ date: string; amount: number }>;
  };
  
  // Property type distribution
  propertyTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  
  // Location-based analytics
  locations: Array<{
    location: string;
    count: number;
    averagePrice: number;
  }>;
  
  // Price range distribution
  priceRanges: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  
  // Performance metrics with comparison
  performance: Array<{
    metric: string;
    current: number;
    previous: number;
    change: number;
  }>;
}

export const AdvancedAnalyticsDashboard: React.FC = () => {
  // State management
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [comparisonMode, setComparisonMode] = useState<'previous' | 'yoy'>('previous');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Fetch analytics data when time range or comparison mode changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, comparisonMode]);

  // API call to fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/analytics?timeRange=${timeRange}&comparison=${comparisonMode}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch analytics data');

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions for formatting
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Generate performance indicator with appropriate styling
  const getPerformanceIndicator = (change: number) => {
    if (change > 0) {
      return <span className="text-green-600">↑ {formatPercentage(change)}</span>;
    } else if (change < 0) {
      return <span className="text-red-600">↓ {formatPercentage(Math.abs(change))}</span>;
    }
    return <span className="text-gray-600">→ 0%</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Dashboard header with time range and comparison controls */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="rounded-md border border-gray-300 py-2 px-3"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <select
            value={comparisonMode}
            onChange={(e) => setComparisonMode(e.target.value as typeof comparisonMode)}
            className="rounded-md border border-gray-300 py-2 px-3"
          >
            <option value="previous">Previous period</option>
            <option value="yoy">Year over year</option>
          </select>
        </div>
      </div>

      {/* Overview metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.overview.totalListings}
              </p>
            </div>
            <div className="bg-primary-100 rounded-full p-3">
              <ViewGridIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            {getPerformanceIndicator(
              data.performance.find(p => p.metric === 'listings')?.change || 0
            )}
            <span className="text-gray-500 text-sm ml-2">vs previous period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(data.overview.totalRevenue)}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            {getPerformanceIndicator(
              data.performance.find(p => p.metric === 'revenue')?.change || 0
            )}
            <span className="text-gray-500 text-sm ml-2">vs previous period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(data.overview.conversionRate)}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <TrendingUpIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            {getPerformanceIndicator(
              data.performance.find(p => p.metric === 'conversion')?.change || 0
            )}
            <span className="text-gray-500 text-sm ml-2">vs previous period</span>
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.trends.revenue}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === 'amount'
                    ? formatCurrency(value)
                    : value.toLocaleString(),
                  name === 'amount' ? 'Revenue' : name
                ]}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="amount"
                name="Revenue"
                stroke="#0088FE"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="count"
                name="Listings"
                stroke="#00C49F"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property Types and Locations Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Property Types Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.propertyTypes}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    index
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#666"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {`${data.propertyTypes[index].type} (${formatPercentage(
                          data.propertyTypes[index].percentage
                        )})`}
                      </text>
                    );
                  }}
                >
                  {data.propertyTypes.map((entry, index) => (
                    <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    'Properties'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Locations</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.locations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === 'averagePrice'
                      ? formatCurrency(value)
                      : value.toLocaleString(),
                    name === 'averagePrice' ? 'Average Price' : 'Properties'
                  ]}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  name="Properties"
                  fill="#0088FE"
                />
                <Bar
                  yAxisId="right"
                  dataKey="averagePrice"
                  name="Average Price"
                  fill="#00C49F"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Price Range Distribution */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.priceRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString()} properties`,
                  'Count'
                ]}
              />
              <Bar dataKey="count" fill="#8884D8">
                {data.priceRanges.map((entry, index) => (
                  <Cell key={entry.range} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics Table */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Period
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Period
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.performance.map((metric) => (
                <tr key={metric.metric}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {metric.metric}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {metric.current.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {metric.previous.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    {getPerformanceIndicator(metric.change)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 