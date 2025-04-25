import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Building, 
  Eye, 
  MessageSquare, 
  DollarSign, 
  User, 
  Plus,
  ArrowUpRight,
  Phone,
  CheckCircle
} from 'lucide-react';
import { mockProperties } from '../../../data/mockProperties';

const LandlordDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Filter properties to show only those belonging to this landlord
  const myProperties = mockProperties.filter(
    property => property.agent?.id === '2' // Simulate that this landlord owns some properties
  );
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Landlord Dashboard</h1>
            <p className="text-gray-600">
              Manage your properties, track performance, and communicate with potential tenants.
            </p>
          </div>
          <Link to="/dashboard/landlord/add-property" className="btn-primary">
            <Plus className="h-5 w-5 mr-1" />
            Add New Property
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
              <h2 className="text-xl font-semibold mb-1">Verification Status: Verified</h2>
              <p className="text-gray-600 mb-2">
                Your account has been verified. You can now list properties on PropertyConnect.
              </p>
              <div className="flex items-center text-success-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Identity Verified</span>
                <span className="mx-2">•</span>
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Phone Verified</span>
                <span className="mx-2">•</span>
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Email Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Properties</p>
              <p className="text-2xl font-bold">{myProperties.length}</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Views</p>
              <p className="text-2xl font-bold">128</p>
            </div>
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Eye className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Inquiries</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="p-2 bg-accent-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Revenue</p>
              <p className="text-2xl font-bold">3.2M UGX</p>
            </div>
            <div className="p-2 bg-success-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* My Properties */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Properties</h2>
          <Link to="/dashboard/landlord/properties" className="text-primary-600 hover:text-primary-700 flex items-center font-medium">
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
                  Views
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inquiries
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myProperties.map(property => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(Math.random() * 100)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(Math.random() * 10)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {property.price.toLocaleString('en-UG', { 
                      style: 'currency', 
                      currency: property.currency || 'UGX',
                      maximumFractionDigits: 0
                    })}
                    {property.type === 'rent' && <span className="text-xs text-gray-500">/month</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/dashboard/landlord/properties/${property.id}`} className="text-primary-600 hover:text-primary-900 mr-3">
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
      
      {/* Recent Inquiries */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Recent Inquiries</h2>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <img 
                  src="https://i.pravatar.cc/150?img=32" 
                  alt="Client" 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">Interested in: Modern Apartment in Kololo</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-200">
                  <MessageSquare className="h-5 w-5 text-primary-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200">
                  <Phone className="h-5 w-5 text-green-600" />
                </button>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-gray-700">
                Hello, I'm interested in this apartment. Is it still available? I would like to schedule a viewing for this weekend.
              </p>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <img 
                  src="https://i.pravatar.cc/150?img=22" 
                  alt="Client" 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-500">Interested in: Luxury 4-Bedroom House in Bugolobi</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-200">
                  <MessageSquare className="h-5 w-5 text-primary-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200">
                  <Phone className="h-5 w-5 text-green-600" />
                </button>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-gray-700">
                I'm looking for a long-term lease for my family. Does this property allow pets? We have a small dog.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Link to="/dashboard/landlord/messages" className="text-primary-600 hover:text-primary-800 font-medium">
            View All Messages
          </Link>
        </div>
      </div>
      
      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Performance Overview</h2>
        
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">
            Property performance charts will appear here
          </p>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Most Viewed Property</p>
            <p className="font-medium">Luxury 4-Bedroom House in Bugolobi</p>
            <p className="text-primary-600 text-sm">64 views this month</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Most Inquiries</p>
            <p className="font-medium">Modern Apartment in Kololo</p>
            <p className="text-primary-600 text-sm">8 inquiries this month</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Average Response Time</p>
            <p className="font-medium">6 hours</p>
            <p className="text-warning-600 text-sm">Improve by responding faster</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;