import React from 'react';
import { Payment } from './Payment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';

interface PropertyBookingProps {
  propertyId: string;
  price: number;
}

export const PropertyBooking: React.FC<PropertyBookingProps> = ({ propertyId, price }) => {
  const navigate = useNavigate();

  const handlePaymentSuccess = async () => {
    try {
      // Update booking status
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('property_id', propertyId);

      if (error) throw error;

      toast.success('Booking confirmed successfully!');
      navigate('/bookings');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to confirm booking');
    }
  };

  const handlePaymentError = (error: Error) => {
    toast.error('Payment failed: ' + error.message);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>
      
      <Payment
        amount={price}
        propertyId={propertyId}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}; 