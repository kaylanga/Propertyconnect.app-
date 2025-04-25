interface PropertyDetails {
  id: string;
  title: string;
  location: {
    district: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    }
  };
  price: {
    amount: number;
    currency: string;
    paymentTerms: string;
  };
  specifications: {
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    size: number;
    amenities: string[];
  };
  media: {
    images: string[];
    videos?: string[];
    virtualTour?: string;
  };
  verification: {
    status: 'verified' | 'pending' | 'unverified';
    documents: string[];
    lastVerified?: Date;
  };
} 