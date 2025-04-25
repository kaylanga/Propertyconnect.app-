// Property agent/owner type
export interface PropertyAgent {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: 'owner' | 'agent' | 'broker';
  verified: boolean;
  avatar: string;
}

// Property type
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  type: 'rent' | 'sale';
  propertyType: 'apartment' | 'house' | 'land' | 'commercial' | 'office';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  rooms?: number;
  features: string[];
  images: string[];
  isVerified: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
  agent?: PropertyAgent;
}

// Property search filters
export interface PropertyFilters {
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  purpose?: 'rent' | 'buy';
}