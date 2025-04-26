import * as React from 'react';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserPreferences } from '../types';

// Extend the User type to include preferences
interface ExtendedUser extends User {
  preferences?: UserPreferences;
}

interface AppState {
  user: ExtendedUser | null;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  sidebarOpen: boolean;
}

interface AppContextType extends AppState {
  setUser: (user: ExtendedUser | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  setNotifications: (enabled: boolean) => void;
  toggleSidebar: () => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
}

const initialState: AppState = {
  user: null,
  theme: 'system',
  language: 'en',
  notifications: true,
  sidebarOpen: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
  initialState?: Partial<AppState>;
}

export function AppProvider({ children, initialState: initialAppState }: AppProviderProps): JSX.Element {
  const [state, setState] = useState<AppState>({
    ...initialState,
    ...initialAppState
  });

  const setUser = useCallback((user: ExtendedUser | null): void => {
    setState(prev => ({ ...prev, user }));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system'): void => {
    setState(prev => ({ ...prev, theme }));
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setLanguage = useCallback((language: string): void => {
    setState(prev => ({ ...prev, language }));
  }, []);

  const setNotifications = useCallback((enabled: boolean): void => {
    setState(prev => ({ ...prev, notifications: enabled }));
  }, []);

  const toggleSidebar = useCallback((): void => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  const updateUserPreferences = useCallback((preferences: Partial<UserPreferences>): void => {
    setState(prev => {
      if (!prev.user) return prev;
      
      // Create a new user object with updated preferences
      const updatedUser: ExtendedUser = {
        ...prev.user,
        preferences: {
          notifications_enabled: prev.user.preferences?.notifications_enabled ?? true,
          email_notifications: prev.user.preferences?.email_notifications ?? true,
          theme: prev.user.preferences?.theme ?? 'system',
          language: prev.user.preferences?.language ?? 'en',
          ...preferences
        }
      };
      
      return {
        ...prev,
        user: updatedUser
      };
    });
  }, []);

  const value: AppContextType = {
    ...state,
    setUser,
    setTheme,
    setLanguage,
    setNotifications,
    toggleSidebar,
    updateUserPreferences
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
} 