export const errorConfig = {
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    maxBreadcrumbs: 50,
    debug: process.env.NODE_ENV === 'development',
  },
  ignoreErrors: [
    'Network Error',
    'Failed to fetch',
    'Load failed',
  ],
  consoleMethods: ['error', 'warn', 'debug'],
};