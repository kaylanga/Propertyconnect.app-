// User related types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'USER' | 'AGENT' | 'ADMIN';
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  phone?: string;
  bio?: string;
  verification_status: 'PENDING' | 'VERIFIED' | 'UNVERIFIED';
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications_enabled: boolean;
  email_notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

// Property related types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  status: PropertyStatus;
  owner_id: string;
  created_at: string;
  updated_at: string;
  images?: PropertyImage[];
  amenities?: string[];
  features?: string[];
}

export type PropertyType = 'apartment' | 'house' | 'condo' | 'townhouse' | 'land' | 'commercial';
export type PropertyStatus = 'available' | 'rented' | 'sold' | 'pending' | 'off_market';

export interface PropertyImage {
  id: string;
  url: string;
  is_primary: boolean;
  caption?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Error handling types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}; 