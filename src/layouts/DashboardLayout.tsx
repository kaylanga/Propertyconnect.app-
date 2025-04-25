import React, { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Building,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  FileText,
  BarChart3,
  CheckSquare,
  DollarSign
} from 'lucide-react';
import { cn } from '../utils/cn';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // If there's no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { label: 'Dashboard', icon: <Home className="h-5 w-5" />, href: `/dashboard/${user.role}` }
    ];
    
    switch (user.role) {
      case 'client':
        return [
          ...commonItems,
          { label: 'Saved Properties', icon: <Building className="h-5 w-5" />, href: '/dashboard/client/saved' },
          { label: 'Messages', icon: <MessageSquare className="h-5 w-5" />, href: '/dashboard/client/messages' },
          { label: 'My Subscriptions', icon: <FileText className="h-5 w-5" />, href: '/dashboard/client/subscriptions' }
        ];
        
      case 'landlord':
        return [
          ...commonItems,
          { label: 'My Properties', icon: <Building className="h-5 w-5" />, href: '/dashboard/landlord/properties' },
          { label: 'Add Property', icon: <Plus className="h-5 w-5" />, href: '/dashboard/landlord/add-property' },
          { label: 'Messages', icon: <MessageSquare className="h-5 w-5" />, href: '/dashboard/landlord/messages' },
          { label: 'Earnings', icon: <DollarSign className="h-5 w-5" />, href: '/dashboard/landlord/earnings' }
        ];
        
      case 'broker':
        return [
          ...commonItems,
          { label: 'My Listings', icon: <Building className="h-5 w-5" />, href: '/dashboard/broker/listings' },
          { label: 'Add Listing', icon: <Plus className="h-5 w-5" />, href: '/dashboard/broker/add-listing' },
          { label: 'Clients', icon: <Users className="h-5 w-5" />, href: '/dashboard/broker/clients' },
          { label: 'Messages', icon: <MessageSquare className="h-5 w-5" />, href: '/dashboard/broker/messages' },
          { label: 'Commissions', icon: <DollarSign className="h-5 w-5" />, href: '/dashboard/broker/commissions' }
        ];
        
      case 'admin':
        return [
          ...commonItems,
          { label: 'Users', icon: <Users className="h-5 w-5" />, href: '/dashboard/admin/users' },
          { label: 'Properties', icon: <Building className="h-5 w-5" />, href: '/dashboard/admin/properties' },
          { label: 'Verifications', icon: <CheckSquare className="h-5 w-5" />, href: '/dashboard/admin/verifications' },
          { label: 'Analytics', icon: <BarChart3 className="h-5 w-5" />, href: '/dashboard/admin/analytics' },
          { label: 'Payments', icon: <DollarSign className="h-5 w-5" />, href: '/dashboard/admin/payments' }
        ];
        
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  // Dashboard title based on role
  const getDashboardTitle = () => {
    switch (user.role) {
      case 'client':
        return 'Client Dashboard';
      case 'landlord':
        return 'Landlord Dashboard';
      case 'broker':
        return 'Broker Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <Home className="h-6 w-6 text-primary-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">PropertyConnect</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="px-4 py-6">
          <p className="px-2 mb-4 text-xs font-semibold text-gray-400 uppercase">Main Navigation</p>
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className="flex items-center px-2 py-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700"
                >
                  <span className="mr-3 text-gray-500">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <p className="px-2 mt-8 mb-4 text-xs font-semibold text-gray-400 uppercase">Settings</p>
          <ul className="space-y-1">
            <li>
              <Link
                to={`/dashboard/${user.role}/profile`}
                className="flex items-center px-2 py-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700"
              >
                <span className="mr-3 text-gray-500"><User className="h-5 w-5" /></span>
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/dashboard/${user.role}/settings`}
                className="flex items-center px-2 py-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700"
              >
                <span className="mr-3 text-gray-500"><Settings className="h-5 w-5" /></span>
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="flex items-center w-full px-2 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700"
              >
                <span className="mr-3 text-gray-500"><LogOut className="h-5 w-5" /></span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isSidebarOpen ? "ml-64" : "ml-0"
      )}>
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <h1 className="ml-4 text-xl font-semibold">{getDashboardTitle()}</h1>
          
          <div className="ml-auto flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium">New message from property owner</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium">Property verification completed</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                    <div className="p-3 hover:bg-gray-50">
                      <p className="text-sm font-medium">New listing matches your search</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                  <div className="p-2 border-t border-gray-200 text-center">
                    <a href="#" className="text-sm text-primary-600 hover:underline">View all notifications</a>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="ml-2 text-sm font-medium hidden sm:block">{user.name}</span>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to={`/dashboard/${user.role}/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to={`/dashboard/${user.role}/settings`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Missing Component Fix
const Plus = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default DashboardLayout;