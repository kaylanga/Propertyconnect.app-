import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Building,
  Settings,
  LogOut,
  Menu,
  X,
  DollarSign,
  Shield,
  Bell,
  ChevronDown,
  BarChart2,
  FileText,
  CheckSquare,
  Wallet,
  MessageSquare
} from 'lucide-react';
import { cn } from '../utils/cn';

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isFinanceRoute = location.pathname.startsWith('/finance');

  const getNavItems = () => {
    if (isFinanceRoute) {
      return [
        { label: 'Dashboard', icon: <BarChart2 className="h-5 w-5" />, href: '/finance' },
        { label: 'Payments', icon: <DollarSign className="h-5 w-5" />, href: '/finance/payments' },
        { label: 'Wallets', icon: <Wallet className="h-5 w-5" />, href: '/finance/wallets' },
        { label: 'Reports', icon: <FileText className="h-5 w-5" />, href: '/finance/reports' },
      ];
    }

    return [
      { label: 'Dashboard', icon: <BarChart2 className="h-5 w-5" />, href: '/admin' },
      { label: 'Users', icon: <Users className="h-5 w-5" />, href: '/admin/users' },
      { label: 'Properties', icon: <Building className="h-5 w-5" />, href: '/admin/properties' },
      { label: 'Verifications', icon: <Shield className="h-5 w-5" />, href: '/admin/verifications' },
      { label: 'Transactions', icon: <DollarSign className="h-5 w-5" />, href: '/admin/transactions' },
      { label: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/admin/settings' },
    ];
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        !isSidebarOpen && "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <Building className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              {isFinanceRoute ? 'Finance Admin' : 'Admin Panel'}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <ul className="space-y-1">
            {getNavItems().map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700",
                    location.pathname === item.href && "bg-primary-50 text-primary-700"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Switch between Admin/Finance */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              to={isFinanceRoute ? '/admin' : '/finance'}
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700"
            >
              <DollarSign className="h-5 w-5" />
              <span className="ml-3">
                Switch to {isFinanceRoute ? 'Admin' : 'Finance'}
              </span>
            </Link>
          </div>
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

          <div className="ml-auto flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center"
              >
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;