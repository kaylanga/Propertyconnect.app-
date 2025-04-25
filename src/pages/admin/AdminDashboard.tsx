import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  ArrowUpRight,
  Shield,
  BarChart2
} from 'lucide-react';
import { cn } from '../../utils/cn';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Monitor and manage platform activity, users, and properties.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold">2,546</p>
              <p className="text-xs text-success-600">↑ 12% this month</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Properties</p>
              <p className="text-2xl font-bold">1,842</p>
              <p className="text-xs text-success-600">↑ 8% this month</p>
            </div>
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Building className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Revenue</p>
              <p className="text-2xl font-bold">24.8M UGX</p>
              <p className="text-xs text-success-600">↑ 18% this month</p>
            </div>
            <div className="p-2 bg-accent-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Verifications</p>
              <p className="text-2xl font-bold">18</p>
              <p className="text-xs text-warning-600">5 urgent ({'>'}48h)</p>
            </div>
            <div className="p-2 bg-warning-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link 
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
          <p className="text-gray-600">
            View and manage user accounts, roles, and permissions.
          </p>
        </Link>

        <Link 
          to="/admin/properties"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Building className="h-6 w-6 text-secondary-600" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Property Management</h3>
          <p className="text-gray-600">
            Review and verify property listings, manage featured properties.
          </p>
        </Link>

        <Link 
          to="/admin/verifications"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-accent-100 rounded-lg">
              <Shield className="h-6 w-6 text-accent-600" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Verification Requests</h3>
          <p className="text-gray-600">
            Process landlord and broker verification requests.
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Link 
              to="/admin/activity"
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
            >
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-success-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Property Verified</p>
                <p className="text-sm text-gray-500">Luxury Apartment in Kololo was verified</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary-100 rounded-full">
                <Users className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New User Registration</p>
                <p className="text-sm text-gray-500">John Doe registered as a landlord</p>
                <p className="text-xs text-gray-400">3 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-warning-100 rounded-full">
                <AlertTriangle className="h-4 w-4 text-warning-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Verification Request</p>
                <p className="text-sm text-gray-500">New broker verification request received</p>
                <p className="text-xs text-gray-400">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Platform Analytics</h2>
            <Link 
              to="/admin/analytics"
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
            >
              View Details
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
            <BarChart2 className="h-8 w-8 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Most Active Area</p>
              <p className="font-medium">Kampala Central</p>
              <p className="text-xs text-primary-600">32% of searches</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Popular Property Type</p>
              <p className="font-medium">Apartments</p>
              <p className="text-xs text-primary-600">45% of listings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;