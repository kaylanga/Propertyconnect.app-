import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { trackPresence, onPresenceChange } from '../lib/supabase';

interface OnlineStatusContextType {
  onlineUsers: Set<string>;
  isUserOnline: (userId: string) => boolean;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export const OnlineStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    // Track current user's presence
    const cleanup = trackPresence(user.id);

    // Listen for presence changes
    const unsubscribe = onPresenceChange((presence) => {
      const online = new Set(
        Object.values(presence)
          .flat()
          .map((p: any) => p.user_id)
      );
      setOnlineUsers(online);
    });

    return () => {
      cleanup();
      unsubscribe();
    };
  }, [user]);

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId);
  };

  return (
    <OnlineStatusContext.Provider value={{ onlineUsers, isUserOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext);
  if (!context) {
    throw new Error('useOnlineStatus must be used within an OnlineStatusProvider');
  }
  return context;
};