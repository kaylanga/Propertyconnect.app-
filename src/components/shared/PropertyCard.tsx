import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2, MapPin, Bed, Bath, Grid, Ruler } from 'lucide-react';
import { Property } from '../../types/property';
import { cn } from '../../utils/cn';

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, featured, className }) => {
  return (
    <div className={cn("card group transition-all duration-300 hover:shadow-lg", 
      featured ? "border-l-4 border-accent-500" : "", 
      className
    )}>
      <div className="relative overflow-hidden">
        {/* Main Image */}
        <Link to={`/property/${property.id}`} className="block">
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Price Tag */}
        <div className="absolute top-4 left-4 bg-white py-1 px-3 rounded-md shadow-md">
          <span className="font-bold text-lg">
            {property.price.toLocaleString('en-UG', { 
              style: 'currency', 
              currency: property.currency || 'UGX',
              maximumFractionDigits: 0
            })}
          </span>
          {property.type === 'rent' && <span className="text-sm text-gray-500">/month</span>}
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
          <button className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100">
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {property.isVerified && (
            <span className="property-badge-verified">
              Verified
            </span>
          )}
          {featured && (
            <span className="property-badge-featured">
              Featured
            </span>
          )}
          {property.isNew && (
            <span className="property-badge bg-primary-100 text-primary-800">
              New
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Title */}
        <Link to={`/property/${property.id}`} className="block">
          <h3 className="text-lg font-semibold line-clamp-1 hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center mt-1 text-gray-500">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between mt-3 py-2 border-t border-gray-100">
          {property.bedrooms !== undefined && (
            <div className="flex items-center text-gray-700">
              <Bed className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.bedrooms} beds</span>
            </div>
          )}
          
          {property.bathrooms !== undefined && (
            <div className="flex items-center text-gray-700">
              <Bath className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.bathrooms} baths</span>
            </div>
          )}
          
          {property.area !== undefined && (
            <div className="flex items-center text-gray-700">
              <Ruler className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.area} sqft</span>
            </div>
          )}
          
          {property.rooms !== undefined && !property.bedrooms && (
            <div className="flex items-center text-gray-700">
              <Grid className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.rooms} rooms</span>
            </div>
          )}
        </div>

        {/* Agent Info */}
        {property.agent && (
          <div className="flex items-center mt-3 pt-2 border-t border-gray-100">
            <img 
              src={property.agent.avatar} 
              alt={property.agent.name}
              className="w-8 h-8 rounded-full mr-2" 
            />
            <div>
              <span className="block text-xs text-gray-500">Listed by</span>
              <span className="text-sm font-medium">{property.agent.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;