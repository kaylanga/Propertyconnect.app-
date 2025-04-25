import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'property' | 'search' | 'favorite' | 'message' | 'booking';
  entityId: string;
  entityName: string;
  timestamp: string;
  metadata: Record<string, any>;
}

interface ActivityMetrics {
  totalActivities: number;
  activeUsers: number;
  popularProperties: Array<{
    id: string;
    name: string;
    views: number;
  }>;
  activityByType: Record<string, number>;
}

export const UserActivityTracker: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [metrics, setMetrics] = useState<ActivityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    actionType: '',
    dateRange: '7d',
    userId: ''
  });

  useEffect(() => {
    fetchActivities();
    fetchMetrics();
  }, [filter]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        actionType: filter.actionType,
        dateRange: filter.dateRange,
        userId: filter.userId
      }).toString();

      const response = await fetch(`/api/user-activities?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/user-activities/metrics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view':
        return '👁️';
      case 'search':
        return '🔍';
      case 'favorite':
        return '❤️';
      case 'message':
        return '💬';
      case 'booking':
        return '📅';
      default:
        return '📝';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        User Activity Tracking
      </h2>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">Total Activities</h3>
            <p className="mt-2 text-3xl font-bold text-blue-900">
              {metrics.totalActivities}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800">Active Users</h3>
            <p className="mt-2 text-3xl font-bold text-green-900">
              {metrics.activeUsers}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800">Popular Properties</h3>
            <ul className="mt-2 space-y-1">
              {metrics.popularProperties.slice(0, 3).map((property) => (
                <li key={property.id} className="text-sm text-purple-900">
                  {property.name} ({property.views} views)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={filter.actionType}
          onChange={(e) => setFilter({ ...filter, actionType: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Actions</option>
          <option value="view">Views</option>
          <option value="search">Searches</option>
          <option value="favorite">Favorites</option>
          <option value="message">Messages</option>
          <option value="booking">Bookings</option>
        </select>

        <select
          value={filter.dateRange}
          onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="1d">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>

        <input
          type="text"
          placeholder="Search by user..."
          value={filter.userId}
          onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Entity
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Timestamp
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                    <div className="font-medium text-gray-900">
                      {activity.userName}
                    </div>
                    <div className="text-gray-500">{activity.userId}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className="inline-flex items-center">
                      <span className="mr-2">{getActionIcon(activity.action)}</span>
                      <span className="capitalize">{activity.action}</span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="font-medium text-gray-900">
                      {activity.entityName}
                    </div>
                    <div className="text-gray-500 capitalize">
                      {activity.entityType}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {format(new Date(activity.timestamp), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <button
                      onClick={() => {
                        // Show modal with detailed activity information
                        console.log('Activity details:', activity.metadata);
                      }}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 