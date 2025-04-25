import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LoggingService } from '../services/LoggingService';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  status: 'available' | 'rented' | 'sold';
}

export const PropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    price: 0,
    location: '',
    property_type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    size_sqft: 0,
    status: 'available'
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      await LoggingService.log({
        level: 'error',
        message: 'Failed to load properties',
        metadata: { error }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('properties')
        .insert([{ ...formData, owner_id: user.id }]);

      if (error) throw error;

      setShowAddForm(false);
      setFormData({
        title: '',
        description: '',
        price: 0,
        location: '',
        property_type: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        size_sqft: 0,
        status: 'available'
      });
      
      await loadProperties();
    } catch (error) {
      console.error('Error adding property:', error);
      await LoggingService.log({
        level: 'error',
        message: 'Failed to add property',
        metadata: { error }
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      await LoggingService.log({
        level: 'error',
        message: 'Failed to delete property',
        metadata: { error }
      });
    }
  };

  return (
  );
}; 