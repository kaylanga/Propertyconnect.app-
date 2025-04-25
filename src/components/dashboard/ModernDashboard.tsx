import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PropertyStats } from './PropertyStats';
import { RecentActivities } from './RecentActivities';
import { QuickActions } from './QuickActions';

export const ModernDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Welcome back, {user?.full_name}</h1>
          <p className="mt-2 text-blue-100">Manage your real estate portfolio</p>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <PropertyStats />
          
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <RecentActivities />
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-2 lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}; 