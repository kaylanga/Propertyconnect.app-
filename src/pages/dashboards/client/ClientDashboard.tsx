import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Search, Heart, BarChart2, Calendar, Home, MessageSquare } from 'lucide-react';
import { mockProperties } from '../../../data/mockProperties';
import PropertyCard from '../../../components/shared/PropertyCard';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Get recent searches (would come from an API in a real app)
  const recentSearches = [
    { id: 1, query: 'Apartments in Kololo', date: '2 days ago' },
    { id: 2, query: 'Houses for rent in Bugolobi', date: '1 week ago' },
    { id: 3, query: 'Land for sale in Entebbe', date: '2 weeks ago' },
  ];
  
  // For demo, we'll just show some saved properties
  const savedProperties = mockProperties.slice(0, 3);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">
          Manage your saved properties and searches, or continue exploring.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Saved Properties</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Heart className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Recent Searches</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Search className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Property Viewings</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <div className="p-2 bg-accent-100 rounded-lg">
              <Calendar className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Unread Messages</p>
              <p className="text-2xl font-bold">4</p>
            </div>
            <div className="p-2 bg-success-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Saved Properties */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Saved Properties</h2>
          <Link to="/dashboard/client/saved" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savedProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
      
      {/* Recent Searches */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
        
        <div className="space-y-3">
          {recentSearches.map(search => (
            <div 
              key={search.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{search.query}</p>
                  <p className="text-sm text-gray-500">{search.date}</p>
                </div>
              </div>
              <Link 
                to={`/search?q=${encodeURIComponent(search.query)}`}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Search Again
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Subscription Status */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Subscription</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">No Active Subscription</p>
                <p className="text-gray-600">
                  Subscribe to unlock contact information for verified properties.
                </p>
              </div>
              <Link 
                to="/pricing" 
                className="btn-primary"
              >
                View Plans
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Benefits of Subscribing:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="p-1 bg-success-100 rounded-full text-success-700 mr-2 mt-0.5">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Direct contact with verified property owners</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-success-100 rounded-full text-success-700 mr-2 mt-0.5">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Access to premium listings</span>
              </li>
              <li className="flex items-start">
                <div className="p-1 bg-success-100 rounded-full text-success-700 mr-2 mt-0.5">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Priority notifications for new listings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Property Recommendations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockProperties
            .filter(p => p.isVerified)
            .slice(3, 6)
            .map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;