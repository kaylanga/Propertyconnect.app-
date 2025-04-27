import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';

// Define user roles type
export type UserRole = 'client' | 'landlord' | 'broker' | 'admin';

// Define user type
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar_url?: string;
}

/**
 * Authentication Context Interface
 * Defines the shape of the authentication context data and methods
 */
interface AuthContextType {
  user: User | null;          // Current user data
  isAuthenticated: boolean;   // Indicates if the user is authenticated
  loading: boolean;           // Loading state
  error: string | null;       // Error message if any
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyEmail: () => Promise<void>;
}

/**
 * Create the Authentication Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demonstration
const DEMO_USERS = [
  {
    id: '1',
    name: 'John Client',
    email: 'client@example.com',
    password: 'password123',
    role: 'client' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=68',
  },
  {
    id: '2',
    name: 'Sarah Landlord',
    email: 'landlord@example.com',
    password: 'password123',
    role: 'landlord' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '3',
    name: 'Mark Broker',
    email: 'broker@example.com',
    password: 'password123',
    role: 'broker' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin' as UserRole,
    avatar: 'https://i.pravatar.cc/150?img=45',
  },
];

/**
 * Authentication Provider Component
 * 
 * Manages authentication state and provides authentication methods to children
 * - Handles user session persistence
 * - Provides login/logout functionality
 * - Manages user profile updates
 * - Handles password reset
 * - Manages email verification
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata.role || 'client',
          name: session.user.user_metadata.name,
          avatar_url: session.user.user_metadata.avatar_url,
        });
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata.role || 'client',
          name: session.user.user_metadata.name,
          avatar_url: session.user.user_metadata.avatar_url,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * User Login
   * @param email - User's email
   * @param password - User's password
   */
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await auth.signInWithEmailAndPassword(email, password);
      // Fetch and set additional user data
      if (result.user) {
        const userData = await fetchUserData(result.user.uid);
        setUser({
          id: result.user.uid,
          email: result.user.email!,
          emailVerified: result.user.emailVerified,
          ...userData
        });
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * User Registration
   * @param email - User's email
   * @param password - User's password
   * @param userData - Additional user data
   */
  const register = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    try {
      setError(null);
      const result = await auth.createUserWithEmailAndPassword(email, password);
      if (result.user) {
        // Create user profile in database
        await createUserProfile(result.user.uid, {
          email,
          ...userData
        });
        // Send email verification
        await result.user.sendEmailVerification();
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * User Logout
   */
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Password Reset
   * @param email - User's email
   */
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await auth.sendPasswordResetEmail(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Update User Profile
   * @param data - Updated user data
   */
  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');
      
      // Update in database
      await updateUserProfile(user.id, data);
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Email Verification
   */
  const verifyEmail = async () => {
    try {
      setError(null);
      if (!auth.currentUser) throw new Error('No user logged in');
      await auth.currentUser.sendEmailVerification();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    verifyEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};