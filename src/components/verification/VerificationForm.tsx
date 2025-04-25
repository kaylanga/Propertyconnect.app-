import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api/ApiService';

interface VerificationFormData {
  fullName: string;
  phoneNumber: string;
  businessLicense?: File;
  certificateOfIncorporation?: File;
  officeLocation?: string;
  propertyOwnershipProof?: File;
}

export const VerificationForm: React.FC = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<VerificationFormData>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: VerificationFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await apiService.post('/api/verification-requests', formData);
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
      {/* Form fields */}
    </form>
  );
}; 