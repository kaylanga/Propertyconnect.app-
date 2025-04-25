import React, { useState, useEffect } from 'react';
import { AdminAnalytics } from './AdminAnalytics';
import { UserManagement } from './UserManagement';
import { PropertyManagement } from './PropertyManagement';
import { SystemLogs } from './SystemLogs';
import { ReportGeneration } from './ReportGeneration';

export const AdvancedAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <nav className="mt-5">
            <a
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center px-6 py-3 cursor-pointer ${
                activeTab === 'analytics' ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              Analytics Dashboard
            </a>
            <a
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-6 py-3 cursor-pointer ${
                activeTab === 'users' ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              User Management
            </a>
            <a
              onClick={() => setActiveTab('properties')}
              className={`flex items-center px-6 py-3 cursor-pointer ${
                activeTab === 'properties' ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              Property Management
            </a>
            <a
              onClick={() => setActiveTab('logs')}
              className={`flex items-center px-6 py-3 cursor-pointer ${
                activeTab === 'logs' ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              System Logs
            </a>
            <a
              onClick={() => setActiveTab('reports')}
              className={`flex items-center px-6 py-3 cursor-pointer ${
                activeTab === 'reports' ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              Reports
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'properties' && <PropertyManagement />}
          {activeTab === 'logs' && <SystemLogs />}
          {activeTab === 'reports' && <ReportGeneration />}
        </div>
      </div>
    </div>
  );
}; 