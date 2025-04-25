import { cacheManager } from './cacheManager';
import { connectionManager } from './connectionManager';
import { LoggingService } from '../services/LoggingService';

class FlushManager {
  async flushAll() {
    try {
      // Clear all caches
      cacheManager.clear();

      // Clear all connections
      await connectionManager.clearConnections();

      // Clear localStorage cache
      this.clearLocalStorage();

      // Clear sessionStorage
      this.clearSessionStorage();

      // Clear service worker caches
      await this.clearServiceWorkerCaches();

      // Reset any active WebSocket connections
      await this.resetWebSockets();

      await LoggingService.log({
        level: 'info',
        message: 'System flush completed successfully',
      });

      return { success: true, message: 'All systems flushed successfully' };
    } catch (error) {
      await LoggingService.log({
        level: 'error',
        message: 'System flush failed',
        metadata: { error },
      });
      throw error;
    }
  }

  private clearLocalStorage() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  private clearSessionStorage() {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }

  private async clearServiceWorkerCaches() {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
    } catch (error) {
      console.error('Error clearing service worker caches:', error);
    }
  }

  private async resetWebSockets() {
    try {
      // Implement WebSocket reset logic here
      // This is a placeholder for your specific WebSocket implementation
      await connectionManager.clearConnections();
    } catch (error) {
      console.error('Error resetting WebSockets:', error);
    }
  }
}

export const flushManager = new FlushManager(); 