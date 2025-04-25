import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import { mockProperties } from '../../../data/mockProperties';

const BrokerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Filter properties to show only those managed by this broker
  const myListings = mockProperties.filter(
    property => property.agent?.id === '3' // Simulate broker listings
  );
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Broker Dashboard</h1>
            <p className="text-gray-600">
              Manage your property listings, track performance, and connect with clients.
            </p>
          </div>
          <Link to="/dashboard/broker/add-listing" className="btn-primary">
            <Plus className="h-5 w-5 mr-1" />
            Add New Listing
          </Link>
        </div>
      </div>
      
      {/* Verification Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="p-3 bg-success-100 rounded-lg mr-4">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Verification Status: Certified Broker</h2>
              <p className="text-gray-600 mb-2">
                Your broker account has been verified. You can now list properties on PropertyConnect.
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Identity Verified
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Business License
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Tax Clearance
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Phone Verified
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Insurance Pending
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-1 mr-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" />
              ))}
            </div>
            <span className="text-lg font-semibold">5.0</span>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Listings</p>
              <p className="text-2xl font-bold">{myListings.length}</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Clients</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Users className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Commission</p>
              <p className="text-2xl font-bold">2.5M UGX</p>
            </div>
            <div className="p-2 bg-accent-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Success Rate</p>
              <p className="text-2xl font-bold">68%</p>
            </div>
            <div className="p-2 bg-success-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* My Listings */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Listings</h2>
          <Link to="/dashboard/broker/listings" className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
            View All
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myListings.map(property => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {property.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {property.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">James Wilson</div>
                    <div className="text-sm text-gray-500">Owner</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(Math.random() * 100)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {property.price.toLocaleString('en-UG', { 
                      style: 'currency', 
                      currency: property.currency || 'UGX',
                      maximumFractionDigits: 0
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(property.price * 0.03).toLocaleString('en-UG', { 
                      style: 'currency', 
                      currency: property.currency || 'UGX',
                      maximumFractionDigits: 0
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/dashboard/broker/listings/${property.id}`} className="text-primary-600 hover:text-primary-900 mr-3">
                      Edit
                    </Link>
                    <Link to={`/property/${property.id}`} className="text-secondary-600 hover:text-secondary-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Client Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Active Clients</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <img
                  src="https://i.pravatar.cc/150?img=33"
                  alt="Client"
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">Michael Johnson</p>
                  <p className="text-sm text-gray-500">Looking for: 3BR Apartment</p>
                </div>
              </div>
              <Link to="/dashboard/broker/clients/1" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                View
              </Link>
            </div>
            
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <img
                  src="https://i.pravatar.cc/150?img=23"
                  alt="Client"
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">Sarah Williams</p>
                  <p className="text-sm text-gray-500">Looking for: Office Space</p>
                </div>
              </div>
              <Link to="/dashboard/broker/clients/2" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                View
              </Link>
            </div>
            
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <img
                  src="https://i.pravatar.cc/150?img=53"
                  alt="Client"
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">David Thompson</p>
                  <p className="text-sm text-gray-500">Looking for: Land for Sale</p>
                </div>
              </div>
              <Link to="/dashboard/broker/clients/3" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                View
              </Link>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/dashboard/broker/clients" className="text-primary-600 hover:text-primary-800 font-medium">
              View All Clients
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          
          <div className="space-y-4">
            <div className="border-l-2 border-primary-500 pl-4 py-1">
              <p className="font-medium">Property Viewed</p>
              <p className="text-sm text-gray-600">
                Commercial Space in Downtown Kampala was viewed by 3 new clients
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            
            <div className="border-l-2 border-success-500 pl-4 py-1">
              <p className="font-medium">New Inquiry</p>
              <p className="text-sm text-gray-600">
                Sarah Williams sent an inquiry about Office Space in Nakasero
              </p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
            
            <div className="border-l-2 border-warning-500 pl-4 py-1">
              <p className="font-medium">Listing Expiring</p>
              <p className="text-sm text-gray-600">
                Your listing for "1-Acre Land in Entebbe" will expire in 3 days
              </p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
            
            <div className="border-l-2 border-accent-500 pl-4 py-1">
              <p className="font-medium">Commission Received</p>
              <p className="text-sm text-gray-600">
                You received a commission of UGX 1,200,000 for Office Space rental
              </p>
              <p className="text-xs text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Performance Overview</h2>
        
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">
            Performance charts will appear here
          </p>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Best Performing Listing</p>
            <p className="font-medium">Commercial Space in Downtown Kampala</p>
            <p className="text-primary-600 text-sm">82 views this month</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Client Conversion Rate</p>
            <p className="font-medium">42%</p>
            <p className="text-success-600 text-sm">↑ 8% from last month</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Average Response Time</p>
            <p className="font-medium">3 hours</p>
            <p className="text-success-600 text-sm">Excellent (Top 10%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;