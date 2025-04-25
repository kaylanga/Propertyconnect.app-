import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../services/LoggingService';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = async (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    // Log operational errors
    await LoggingService.log({
      level: 'error',
      message: err.message,
      userId: req.user?.id,
      action: req.path,
      metadata: {
        stack: err.stack,
        statusCode: err.statusCode,
        isOperational: err.isOperational,
      },
    });

    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Log programming or other unknown errors
  await LoggingService.log({
    level: 'error',
    message: 'Internal server error',
    userId: req.user?.id,
    action: req.path,
    metadata: {
      stack: err.stack,
      error: err.message,
    },
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  return res.status(500).json({
    status: 'error',
    message,
  });
}; 