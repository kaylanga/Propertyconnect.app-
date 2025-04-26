import { useState, useCallback, useEffect } from 'react';
import { ApiResponse, ApiError } from '../types';
import { getErrorMessage, logError } from '../utils/errorHandling';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  onFinally?: () => void;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

/**
 * Type guard to check if a response is an ApiResponse
 */
function isApiResponse<T>(response: any): response is ApiResponse<T> {
  return response && typeof response === 'object' && 'data' in response;
}

/**
 * Custom hook for making API calls with loading and error states
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<any>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiFunction(...args);
        
        // Extract data from response
        let result: T;
        
        if (isApiResponse<T>(response)) {
          result = response.data;
        } else {
          result = response as T;
        }
        
        setData(result);
        options.onSuccess?.(result);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        const apiError: ApiError = {
          code: 'API_ERROR',
          message: errorMessage,
          details: err instanceof Error ? { stack: err.stack } : undefined
        };
        
        setError(apiError);
        options.onError?.(apiError);
        
        logError(err, 'useApi', { apiFunction: apiFunction.name });
      } finally {
        setLoading(false);
        options.onFinally?.();
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback((): void => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * Custom hook for making API calls with automatic execution on mount
 */
export function useApiOnMount<T>(
  apiFunction: () => Promise<any>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const result = useApi(apiFunction, options);
  
  // Execute on mount
  useEffect(() => {
    result.execute();
  }, [result.execute]);
  
  return result;
} 