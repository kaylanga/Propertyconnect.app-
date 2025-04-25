import { supabase } from '../lib/supabase';
import { LoggingService } from './LoggingService';

export class MonitoringService {
  static async trackUserActivity(userId: string, action: string, metadata: any = {}) {
    try {
      await supabase.from('user_activity').insert([{
        user_id: userId,
        action,
        metadata,
      }]);
    } catch (error) {
      await LoggingService.log({
        level: 'error',
        message: 'Failed to track user activity',
        userId,
        action,
        metadata: { error },
      });
    }
  }

  static async trackAPIMetrics(endpoint: string, responseTime: number, status: number) {
    try {
      await supabase.from('api_metrics').insert([{
        endpoint,
        response_time: responseTime,
        status,
      }]);
    } catch (error) {
      await LoggingService.log({
        level: 'error',
        message: 'Failed to track API metrics',
        metadata: { error, endpoint, responseTime, status },
      });
    }
  }

  static async getSystemHealth() {
    try {
      // Check database connection
      const dbStart = Date.now();
      const { data: dbHealth, error: dbError } = await supabase
        .from('health_check')
        .select('count')
        .single();
      const dbResponseTime = Date.now() - dbStart;

      // Check storage service
      const storageStart = Date.now();
      const { data: storageHealth, error: storageError } = await supabase
        .storage
        .getBucket('verifications');
      const storageResponseTime = Date.now() - storageStart;

      return {
        database: {
          status: dbError ? 'unhealthy' : 'healthy',
          responseTime: dbResponseTime,
          error: dbError,
        },
        storage: {
          status: storageError ? 'unhealthy' : 'healthy',
          responseTime: storageResponseTime,
          error: storageError,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      await LoggingService.log({
        level: 'error',
        message: 'Failed to check system health',
        metadata: { error },
      });
      throw error;
    }
  }
} 