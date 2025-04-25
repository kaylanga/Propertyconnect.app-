import { useDebugForm } from '../hooks/useDebugForm';

interface PropertyData {
  title: string;
  price: number;
  description: string;
}

export function PropertyForm() {
  const {
    formData,
    errors,
    handleChange
  } = useDebugForm<PropertyData>(
    {
      title: '',
      price: 0,
      description: ''
    },
    'properties:new',
    (data) => data.title.length > 0 && data.price > 0
  );

  return (
    <form>
      <input
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      {errors.title && <span>{errors.title}</span>}
      
      <input
        type="number"
        value={formData.price}
        onChange={(e) => handleChange('price', Number(e.target.value))}
      />
      {errors.price && <span>{errors.price}</span>}
      
      <textarea
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />
      {errors.description && <span>{errors.description}</span>}
    </form>
  );
} 