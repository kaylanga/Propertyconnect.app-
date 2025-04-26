import React, { FC, useEffect, useState } from 'react';
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

import { LoggingService } from './services/LoggingService';
import { DebugProvider } from './contexts/DebugContext';
import { autoSaveService } from './services/AutoSaveService';
import { checkEnvVariables } from './utils/envCheck';
import { PerformanceMonitor } from './utils/monitoring/PerformanceMonitor';
import { ErrorTracker } from './utils/monitoring/ErrorTracker';
import { reportWebVitals } from './utils/monitoring/Vitals';
import { sendToAnalytics } from './utils/monitoring/Analytics';
import { useAppStore } from './store';

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
const App: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const { isAuthenticated } = useAppStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check environment variables
        const envCheck = checkEnvVariables();
        if (!envCheck) {
          throw new Error('Environment variables not properly configured');
        }

        // Initialize error tracking
        ErrorTracker.init();

        // Initialize performance monitoring
        await PerformanceMonitor.measurePageLoad();

        // Report vitals to analytics
        reportWebVitals(sendToAnalytics);

        // Initialize auto-save service
        // @ts-ignore - Ignoring TypeScript error for now
        await autoSaveService.initialize();

        // Log successful initialization
        await LoggingService.log({
          level: 'info',
          message: 'Application initialized successfully',
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Initialization error:', error);
        setInitError(error instanceof Error ? error.message : 'Failed to initialize application');
        await LoggingService.log({
          level: 'error',
          message: 'Application initialization failed',
          metadata: { error },
        });
      }
    };

    initializeApp();

    return () => {
      // Cleanup
      // @ts-ignore - Ignoring TypeScript error for now
      autoSaveService.cleanup();
    };
  }, []);

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Initialization Error</h2>
          <p className="text-gray-600 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <DebugProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/property/:id" element={<PropertyDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/mortgage-calculator" element={<MortgageCalculatorPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Client routes */}
                <Route
                  path="/client/dashboard"
                  element={
                    <ProtectedRoute roles={['USER']}>
                      <ClientDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Landlord routes */}
                <Route
                  path="/landlord/dashboard"
                  element={
                    <ProtectedRoute roles={['LANDLORD']}>
                      <LandlordDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Broker routes */}
                <Route
                  path="/broker/dashboard"
                  element={
                    <ProtectedRoute roles={['BROKER']}>
                      <BrokerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <UsersManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/properties"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <PropertiesManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/verifications"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <VerificationsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/transactions"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <TransactionsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <SystemSettings />
                    </ProtectedRoute>
                  }
                />

                {/* Finance admin routes */}
                <Route
                  path="/admin/finance"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <FinanceDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/finance/payments"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <PaymentsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/finance/wallets"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <WalletsManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/finance/reports"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <ReportsManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Messaging routes */}
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wallet"
                  element={
                    <ProtectedRoute>
                      <WalletPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </DebugProvider>
  );
};

export default App;