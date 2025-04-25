import { LoggingService } from '../services/LoggingService';

export const debugConfig = {
  autoSave: true,
  debugLevel: 'info',
  maxRetries: 3,
  saveInterval: 5000, // 5 seconds
  
  async handleError(error: any) {
    await LoggingService.log({
      level: 'error',
      message: error.message,
      metadata: { stack: error.stack }
    });
  }
}; 