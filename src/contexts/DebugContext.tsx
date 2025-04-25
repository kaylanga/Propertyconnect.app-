import React, { createContext, useContext, useEffect } from 'react';
import { autoSaveService } from '../services/AutoSaveService';
import { debugConfig } from '../config/debugConfig';
import { LoggingService } from '../services/LoggingService';

interface DebugContextType {
  logError: (error: any) => Promise<void>;
  trackChange: (key: string, data: any) => Promise<void>;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Start auto-save service
    autoSaveService.startAutoSave(debugConfig.saveInterval);

    // Global error handling
    const handleError = async (event: ErrorEvent) => {
      event.preventDefault();
      await debugConfig.handleError(event.error);
    };

    window.addEventListener('error', handleError);
    
    return () => {
      autoSaveService.stopAutoSave();
      window.removeEventListener('error', handleError);
    };
  }, []);

  const value = {
    logError: debugConfig.handleError,
    trackChange: autoSaveService.trackChange.bind(autoSaveService)
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
}

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
}; 