import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface MarketData {
  averagePrice: number;
  totalListings: number;
  averageDaysOnMarket: number;
  pricePerSquareFoot: number;
  trends: {
    date: string;
    price: number;
    listings: number;
    sales: number;
  }[];
  propertyTypes: {
    type: string;
    count: number;
    percentage: number;
  }[];
  priceRanges: {
    range: string;
    count: number;
  }[];
}

interface LocationFilter {
  city: string;
  neighborhood?: string;
  propertyType?: string;
  timeRange: '1M' | '3M' | '6M' | '1Y' | 'ALL';
}

export const MarketTrendsDashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LocationFilter>({
    city: '',
    timeRange: '6M'
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchMarketData();
  }, [filter]);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        city: filter.city,
        neighborhood: filter.neighborhood || '',
        propertyType: filter.propertyType || '',
        timeRange: filter.timeRange
      }).toString();

      const response = await fetch(`/api/market-trends?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch market data');

      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market data:', error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Market Trends Analysis
        </h2>
        
        {/* Filters */}
        <div className="flex space-x-4">
          <select
            value={filter.city}
            onChange={(e) => setFilter({ ...filter, city: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Cities</option>
            <option value="Kampala">Kampala</option>
            <option value="Entebbe">Entebbe</option>
            <option value="Jinja">Jinja</option>
          </select>

          <select
            value={filter.timeRange}
            onChange={(e) => setFilter({ ...filter, timeRange: e.target.value as LocationFilter['timeRange'] })}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="1M">Last Month</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Last Year</option>
            <option value="ALL">All Time</option>
          </select>
        </div>
      </div>

      {marketData && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-blue-800">Average Price</h3>
              <p className="mt-2 text-3xl font-bold text-blue-900">
                {formatCurrency(marketData.averagePrice)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-green-800">Total Listings</h3>
              <p className="mt-2 text-3xl font-bold text-green-900">
                {marketData.totalListings}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-yellow-800">Avg. Days on Market</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-900">
                {marketData.averageDaysOnMarket}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-purple-800">Price/Sq.Ft</h3>
              <p className="mt-2 text-3xl font-bold text-purple-900">
                {formatCurrency(marketData.pricePerSquareFoot)}
              </p>
            </div>
          </div>

          {/* Price Trends Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Price Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => value.toString()}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'price' ? formatCurrency(value) : value,
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="price"
                    stroke="#0088FE"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="listings"
                    stroke="#00C49F"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sales"
                    stroke="#FFBB28"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Types Distribution */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Property Types Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketData.propertyTypes}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent
                      }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                    >
                      {marketData.propertyTypes.map((entry, index) => (
                        <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        value,
                        name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Price Range Distribution */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Price Range Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData.priceRanges}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [value, 'Properties']}
                    />
                    <Bar dataKey="count" fill="#8884d8">
                      {marketData.priceRanges.map((entry, index) => (
                        <Cell
                          key={entry.range}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 