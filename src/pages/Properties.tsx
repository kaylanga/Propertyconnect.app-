import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PropertyCard } from '@/components/PropertyCard'
import { useProperties } from '@/services/api'

export const PropertiesPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: properties, isLoading, error } = useProperties()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Error loading properties</h2>
        <p className="mt-2 text-gray-600">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
        <button
          onClick={() => navigate('/properties/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Property
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onView={(id) => navigate(`/properties/${id}`)}
          />
        ))}
      </div>
    </div>
  )
} 