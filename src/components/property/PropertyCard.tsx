import React from 'react';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    size: number;
    images: string[];
    type: 'sale' | 'rent';
  };
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Link to={`/properties/${property.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        {/* Property Image */}
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${property.type === 'sale' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'}
            `}>
              For {property.type === 'sale' ? 'Sale' : 'Rent'}
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
            {property.title}
          </h3>
          
          <p className="mt-1 text-sm text-gray-500">
            {property.location}
          </p>
          
          <p className="mt-2 text-xl font-semibold text-primary-600">
            UGX {property.price.toLocaleString()}
            {property.type === 'rent' && '/month'}
          </p>

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {property.bedrooms} beds
            </span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {property.bathrooms} baths
            </span>
            <span className="mx-2">•</span>
            <span>{property.size} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}; 