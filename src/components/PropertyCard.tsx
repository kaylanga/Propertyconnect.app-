import React from 'react'
import { format } from 'date-fns'
import type { Property } from '@/services/api'

interface PropertyCardProps {
  property: Property
  onView?: (id: string) => void
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onView }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(property.price)

  const formattedDate = format(new Date(property.createdAt), 'MMM dd, yyyy')

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="relative h-48">
        <img
          src={property.images[0] || '/placeholder-property.jpg'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{property.location}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">{formattedPrice}</span>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{property.bedrooms} beds</span>
            <span>{property.bathrooms} baths</span>
            <span>{property.area} sqft</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Listed on {formattedDate}</span>
          <button
            onClick={() => onView?.(property.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
} 