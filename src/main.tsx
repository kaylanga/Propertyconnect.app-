import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/browser';
import App from './app';
import './index.css';
import { checkEnvVariables } from './utils/envCheck';

// Initialize Sentry if DSN is available
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Error boundary fallback component
const ErrorFallback: Sentry.FallbackRender = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={resetError}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

// Check environment variables before rendering
if (!checkEnvVariables()) {
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-600 mb-4">
            The application is missing required environment variables. Please check your configuration.
          </p>
        </div>
      </div>
    );
  }
} else {
  const root = document.getElementById('root');
  if (root) {
    createRoot(root).render(
      <React.StrictMode>
        <Sentry.ErrorBoundary fallback={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Sentry.ErrorBoundary>
      </React.StrictMode>
    );
  }
}