export const debugConfig = {
  // Enable detailed error messages and stack traces in development
  verbose: process.env.NODE_ENV !== 'production',
  
  // Log levels for different environments
  logLevels: {
    development: 'debug',
    test: 'debug',
    production: 'error',
  },
  
  // Performance monitoring thresholds
  performance: {
    slowQueryThreshold: 1000, // ms
    apiResponseThreshold: 2000, // ms
  },
  
  // Rate limiting settings
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  },
  
  // Security settings
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordResetExpiry: 1 * 60 * 60 * 1000, // 1 hour
  },
}; 