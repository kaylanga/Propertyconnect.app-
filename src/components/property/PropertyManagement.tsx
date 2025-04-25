/**
 * Property Management System
 * 
 * Handles all property-related operations including:
 * - Property listing creation and editing
 * - Property status management
 * - Image upload and management
 * - Property verification
 * - Pricing management
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadImages } from '../../services/storage';
import { PropertyService } from '../../services/PropertyService';

interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: {
    amount: number;
    currency: string;
    period?: 'daily' | 'monthly' | 'yearly';
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    size: number;
    furnished: boolean;
    parking: boolean;
    yearBuilt: number;
  };
  amenities: string[];
  images: string[];
  verification: {
    status: 'pending' | 'verified' | 'rejected';
    documents: string[];
    verifiedAt?: Date;
  };
  owner: {
    id: string;
    name: string;
    contact: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  VILLA = 'villa',
  COMMERCIAL = 'commercial',
  LAND = 'land'
}

enum PropertyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  UNDER_REVIEW = 'under_review',
  INACTIVE = 'inactive',
  SOLD = 'sold',
  RENTED = 'rented'
}

export const PropertyManagement: React.FC = () => {
  // State management
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * Fetch user's properties on component mount
   */
  useEffect(() => {
    fetchProperties();
  }, []);

  /**
   * Fetch properties from the API
   */
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await PropertyService.getUserProperties(user!.id);
      setProperties(response.data);
    } catch (err) {
      setError('Failed to fetch properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create new property listing
   * @param propertyData - New property data
   */
  const createProperty = async (propertyData: Partial<Property>) => {
    try {
      // Handle image upload
      const imageUrls = await uploadImages(propertyData.images);

      // Create property with image URLs
      const response = await PropertyService.createProperty({
        ...propertyData,
        images: imageUrls,
        owner: {
          id: user!.id,
          name: user!.name,
          contact: user!.email
        }
      });

      setProperties([...properties, response.data]);
    } catch (err) {
      setError('Failed to create property');
      console.error(err);
    }
  };

  /**
   * Update existing property
   * @param propertyId - Property ID
   * @param updates - Property updates
   */
  const updateProperty = async (
    propertyId: string,
    updates: Partial<Property>
  ) => {
    try {
      // Handle image updates if any
      if (updates.images) {
        const imageUrls = await uploadImages(updates.images);
        updates.images = imageUrls;
      }

      const response = await PropertyService.updateProperty(propertyId, updates);
      
      setProperties(properties.map(prop =>
        prop.id === propertyId ? response.data : prop
      ));
    } catch (err) {
      setError('Failed to update property');
      console.error(err);
    }
  };

  /**
   * Delete property
   * @param propertyId - Property ID
   */
  const deleteProperty = async (propertyId: string) => {
    try {
      await PropertyService.deleteProperty(propertyId);
      setProperties(properties.filter(prop => prop.id !== propertyId));
    } catch (err) {
      setError('Failed to delete property');
      console.error(err);
    }
  };

  /**
   * Update property status
   * @param propertyId - Property ID
   * @param status - New status
   */
  const updatePropertyStatus = async (
    propertyId: string,
    status: PropertyStatus
  ) => {
    try {
      const response = await PropertyService.updatePropertyStatus(
        propertyId,
        status
      );
      
      setProperties(properties.map(prop =>
        prop.id === propertyId ? response.data : prop
      ));
    } catch (err) {
      setError('Failed to update property status');
      console.error(err);
    }
  };

  /**
   * Submit property for verification
   * @param propertyId - Property ID
   * @param documents - Verification documents
   */
  const submitForVerification = async (
    propertyId: string,
    documents: File[]
  ) => {
    try {
      // Upload verification documents
      const documentUrls = await uploadImages(documents);

      const response = await PropertyService.submitPropertyVerification(
        propertyId,
        documentUrls
      );

      setProperties(properties.map(prop =>
        prop.id === propertyId ? response.data : prop
      ));
    } catch (err) {
      setError('Failed to submit property for verification');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Property Management UI */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Management</h1>
        <button
          onClick={() => setSelectedProperty(null)}
          className="btn-primary"
        >
          Add New Property
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Property List */}
      {loading ? (
        <div>Loading properties...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={() => setSelectedProperty(property)}
              onDelete={() => deleteProperty(property.id)}
              onStatusUpdate={(status) => 
                updatePropertyStatus(property.id, status)
              }
              onVerificationSubmit={(docs) =>
                submitForVerification(property.id, docs)
              }
            />
          ))}
        </div>
      )}

      {/* Property Form Modal */}
      {selectedProperty !== undefined && (
        <PropertyForm
          property={selectedProperty}
          onSubmit={selectedProperty ? updateProperty : createProperty}
          onClose={() => setSelectedProperty(undefined)}
        />
      )}
    </div>
  );
};

/**
 * Property Card Component
 * Displays individual property information
 */
const PropertyCard: React.FC<{
  property: Property;
  onEdit: () => void;
  onDelete: () => void;
  onStatusUpdate: (status: PropertyStatus) => void;
  onVerificationSubmit: (documents: File[]) => void;
}> = ({ property, onEdit, onDelete, onStatusUpdate, onVerificationSubmit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Property Image */}
      <img
        src={property.images[0]}
        alt={property.title}
        className="w-full h-48 object-cover"
      />

      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-2">{property.location.address}</p>
        <p className="text-primary-600 font-bold mb-2">
          {property.price.currency} {property.price.amount}
          {property.price.period && `/${property.price.period}`}
        </p>

        {/* Property Status */}
        <div className="flex items-center mb-4">
          <span className={`status-badge status-${property.status}`}>
            {property.status}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onEdit}
            className="btn-secondary"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Property Form Component
 * Handles property creation and editing
 */
const PropertyForm: React.FC<{
  property?: Property;
  onSubmit: (data: Partial<Property>) => void;
  onClose: () => void;
}> = ({ property, onSubmit, onClose }) => {
  // Form implementation
  return (
    <div className="modal">
      {/* Form fields */}
    </div>
  );
}; 