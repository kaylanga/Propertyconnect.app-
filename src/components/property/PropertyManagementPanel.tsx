import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const PropertyManagementPanel = () => {
  const [properties, setProperties] = useState([]);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    checkVerificationStatus();
    loadProperties();
  }, []);

  const checkVerificationStatus = async () => {
    const { data: user } = await supabase.auth.getUser();
    const { data: verification } = await supabase
      .from('verification_requests')
      .select('status')
      .eq('user_id', user.id)
      .single();
    
    setIsVerified(verification?.status === 'approved');
  };

  const loadProperties = async () => {
    const { data: user } = await supabase.auth.getUser();
    const { data: properties } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', user.id);
    
    setProperties(properties || []);
  };

  if (!isVerified) {
    return <div>Please complete verification to access the property management panel.</div>;
  }

  return (
    <div>
      <h2>My Properties</h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Add New Property
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {properties.map((property) => (
          <div key={property.id} className="border p-4 rounded">
            <h3>{property.title}</h3>
            <p>{property.description}</p>
            <div className="mt-2">
              <button className="mr-2">Edit</button>
              <button>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 