import express from 'express';
import type { Express } from 'express';
import {
  rateLimiter,
  authenticateUser,
  securityHeaders,
} from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { validateInput, schemas } from './middleware/validation';
import { LoggingService } from './services/LoggingService';
import { MonitoringService } from './services/MonitoringService';

const app = express();

// Apply security middleware
app.use(securityHeaders);
app.use(rateLimiter);

// Request logging
app.use(async (req, res, next) => {
  const start = Date.now();
  res.on('finish', async () => {
    const duration = Date.now() - start;
    await MonitoringService.trackAPIMetrics(req.path, duration, res.statusCode);
  });
  next();
});

// Routes with validation and authentication
app.post(
  '/api/profile',
  authenticateUser,
  validateInput(schemas.userProfile),
  // ... route handler
);

app.post(
  '/api/properties',
  authenticateUser,
  validateInput(schemas.property),
  // ... route handler
);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const health = await MonitoringService.getSystemHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Health check failed' });
  }
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  await LoggingService.log({
    level: 'info',
    message: 'Server is shutting down',
  });
  process.exit(0);
});

export default app; 