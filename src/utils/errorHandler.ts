import { toast } from 'react-toastify';
import { LoggingService } from '../services/LoggingService';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = async (error: any) => {
  if (error instanceof AppError) {
    toast.error(error.message);
    
    if (!error.isOperational) {
      await LoggingService.log({
        level: 'error',
        message: error.message,
        metadata: { stack: error.stack }
      });
    }
  } else {
    toast.error('An unexpected error occurred');
    await LoggingService.log({
      level: 'error',
      message: 'Unhandled error',
      metadata: { error }
    });
  }
}; 