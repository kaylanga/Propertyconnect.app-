import winston, { format } from 'winston';
import { supabase } from '../lib/supabase';

// Create Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

interface LogEntry {
  level: string;
  message: string;
  userId?: string;
  action?: string;
  metadata?: any;
}

export class LoggingService {
  static async log({ level, message, userId, action, metadata }: LogEntry) {
    // Log to Winston
    logger.log({
      level,
      message,
      userId,
      action,
      metadata,
      timestamp: new Date().toISOString(),
    });

    // Store critical logs in database
    if (level === 'error' || level === 'warn') {
      try {
        await supabase.from('system_logs').insert([{
          level,
          message,
          user_id: userId,
          action,
          metadata,
        }]);
      } catch (error) {
        console.error('Failed to store log in database:', error);
      }
    }
  }

  static async getSystemLogs(filters: any = {}) {
    const query = supabase
      .from('system_logs')
      .select('*');

    if (filters.level) {
      query.eq('level', filters.level);
    }
    if (filters.userId) {
      query.eq('user_id', filters.userId);
    }
    if (filters.startDate && filters.endDate) {
      query.gte('created_at', filters.startDate)
           .lte('created_at', filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
} 