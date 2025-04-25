import { useState, useEffect } from 'react';
import { useDebug } from '../contexts/DebugContext';

export function useDebugForm<T>(
  initialData: T,
  key: string,
  validateForm?: (data: T) => boolean
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { trackChange } = useDebug();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (validateForm && !validateForm(formData)) return;
      await trackChange(key, formData);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, key]);

  const handleChange = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return {
    formData,
    errors,
    handleChange,
    setErrors
  };
} 