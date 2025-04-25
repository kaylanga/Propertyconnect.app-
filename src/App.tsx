import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Dashboard } from './pages/Dashboard';
import { VerificationForm } from './pages/VerificationForm';
import { AdminPanel } from './pages/AdminPanel';
import { PropertyManagement } from './pages/PropertyManagement';

// Layout components
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import MortgageCalculatorPage from './pages/MortgageCalculatorPage';

// Dashboard pages by role
import ClientDashboard from './pages/dashboards/client/ClientDashboard';
import LandlordDashboard from './pages/dashboards/landlord/LandlordDashboard';
import BrokerDashboard from './pages/dashboards/broker/BrokerDashboard';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import PropertiesManagement from './pages/admin/PropertiesManagement';
import VerificationsManagement from './pages/admin/VerificationsManagement';
import TransactionsManagement from './pages/admin/TransactionsManagement';
import SystemSettings from './pages/admin/SystemSettings';

// Finance admin pages
import FinanceDashboard from './pages/admin/finance/FinanceDashboard';
import PaymentsManagement from './pages/admin/finance/PaymentsManagement';
import WalletsManagement from './pages/admin/finance/WalletsManagement';
import ReportsManagement from './pages/admin/finance/ReportsManagement';

// Messaging pages
import MessagesPage from './pages/MessagesPage';
import WalletPage from './pages/WalletPage';

import { flushManager } from './utils/flushManager';
import { LoggingService } from './services/LoggingService';
import { DebugProvider } from './contexts/DebugContext';
import { autoSaveService } from './services/AutoSaveService';
import { checkEnvVariables } from './utils/envCheck';
import { PerformanceMonitor } from './utils/monitoring/PerformanceMonitor';
import { ErrorTracker } from './utils/monitoring/ErrorTracker';
import { reportWebVitals } from './utils/monitoring/Vitals';
import { sendToAnalytics } from './utils/monitoring/Analytics';
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { PropertyDetails } from './pages/PropertyDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { useAppStore } from '@/store';

/**
 * Main Application Component
 * 
 * Serves as the root component of the application, setting up:
 * - Routing
 * - Global Context Providers
 * - Theme Management
 * - Authentication State
 * - Notification System
 */
const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAppStore();

  useEffect(() => {
    const handleErrors = async () => {
      try {
        await flushManager.flushAll();
        console.log('System successfully flushed');
      } catch (error) {
        console.error('Error during system flush:', error);
        await LoggingService.log({
          level: 'error',
          message: 'System flush failed',
          metadata: { error },
        });
      }
    };

    // Handle any 305 errors
    window.addEventListener('unhandledrejection', async (event) => {
      if (event.reason?.response?.status === 305) {
        await handleErrors();
      }
    });

    const envCheck = checkEnvVariables();
    if (!envCheck) {
      console.error('Environment variables not properly configured');
    }

    // Initialize error tracking
    ErrorTracker.init();

    // Measure page performance
    PerformanceMonitor.measurePageLoad().then((metrics) => {
      console.log('Page Performance Metrics:', metrics);
    });

    // Report vitals to analytics
    reportWebVitals(sendToAnalytics);

    // Simulate initialization
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener('unhandledrejection', handleErrors);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Router>
      {/* Theme Provider for consistent styling */}
      <ThemeProvider>
        {/* Authentication Context Provider */}
        <AuthProvider>
          {/* Notification System Provider */}
          <NotificationProvider>
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/properties" replace />}
              />
              <Route
                path="/properties"
                element={<Properties />}
              />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/verification" element={<VerificationForm />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/property-management" element={<PropertyManagement />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
              <Route path="/broker-dashboard" element={<BrokerDashboard />} />
              <Route path="/messages-page" element={<MessagesPage />} />
              <Route path="/wallet-page" element={<WalletPage />} />
              
              {/* Authentication Routes */}
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Route>
              
              {/* Admin Routes - Require Admin Role */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Route>
              
              {/* Error Routes */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;