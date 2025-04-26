import { ApiError } from '../types';

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Type guard to check if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes('Network Error') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('No internet connection'))
  );
}

/**
 * Type guard to check if an error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return (
    isApiError(error) &&
    error.code.startsWith('VALIDATION_') &&
    Array.isArray(error.details)
  );
}

/**
 * Extracts a user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

/**
 * Creates a standardized error object
 */
export function createError(
  message: string,
  code: string = 'UNKNOWN_ERROR',
  details?: Record<string, any>
): ApiError {
  return {
    code,
    message,
    details
  };
}

/**
 * Wraps an async function with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: unknown) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error('Error in withErrorHandling:', error);
    
    if (errorHandler) {
      errorHandler(error);
    }
    
    return null;
  }
}

/**
 * Logs an error with additional context
 */
export function logError(
  error: unknown,
  context: string,
  additionalData?: Record<string, any>
): void {
  const errorMessage = getErrorMessage(error);
  
  console.error(`[${context}] ${errorMessage}`, {
    error,
    context,
    ...additionalData
  });
  
  // Here you could also send to a logging service
  // LoggingService.log({
  //   level: 'error',
  //   message: errorMessage,
  //   metadata: { context, ...additionalData }
  // });
} 