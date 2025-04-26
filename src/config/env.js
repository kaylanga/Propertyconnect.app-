export const config = {
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
  },
  api: {
    baseUrl: process.env.REACT_APP_API_URL
  }
};