import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useAnalytics } from '../../hooks/useAnalytics';

export const AdminAnalytics: React.FC = () => {
  const {
    propertyStats,
    userStats,
    revenueStats,
    activityStats
  } = useAnalytics();

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
        <Line
          data={revenueStats}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>

      {/* Property Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Property Types</h2>
          <Pie data={propertyStats} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <Bar data={userStats} />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {activityStats.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 