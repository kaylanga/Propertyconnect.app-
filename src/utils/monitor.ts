import { DebugUtils } from './debugUtils';
import { LoggingService } from '../services/LoggingService';
import { MonitoringService } from '../services/MonitoringService';

export async function monitorApplication() {
  // Monitor system health every 5 minutes
  setInterval(async () => {
    try {
      const health = await MonitoringService.getSystemHealth();
      if (health.database.status !== 'healthy' || health.storage.status !== 'healthy') {
        await LoggingService.log({
          level: 'error',
          message: 'System health check failed',
          metadata: health
        });
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }, 5 * 60 * 1000);

  // Monitor memory usage every minute
  setInterval(() => {
    DebugUtils.logMemoryUsage();
  }, 60 * 1000);

  // Monitor API response times
  const originalFetch = global.fetch;
  global.fetch = async (...args) => {
    return DebugUtils.measureAsync('API Call', () => originalFetch(...args));
  };
} 