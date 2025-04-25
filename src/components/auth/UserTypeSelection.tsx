import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const UserTypeSelection = () => {
  const [selectedType, setSelectedType] = useState<'seeker' | 'landlord' | 'broker'>('seeker');
  const { user } = useAuth();

  const handleTypeSelection = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user?.id,
        user_type: selectedType,
        email: user?.email
      });

    if (!error) {
      if (selectedType === 'seeker') {
        // Redirect to home page
        window.location.href = '/';
      } else {
        // Redirect to verification form
        window.location.href = '/verify';
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Select Your Account Type</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="seeker"
            name="userType"
            value="seeker"
            checked={selectedType === 'seeker'}
            onChange={(e) => setSelectedType('seeker')}
            className="form-radio"
          />
          <label htmlFor="seeker">
            <div className="font-medium">Property Seeker</div>
            <div className="text-sm text-gray-500">Looking for properties to rent or buy</div>
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="landlord"
            name="userType"
            value="landlord"
            checked={selectedType === 'landlord'}
            onChange={(e) => setSelectedType('landlord')}
            className="form-radio"
          />
          <label htmlFor="landlord">
            <div className="font-medium">Landlord</div>
            <div className="text-sm text-gray-500">Own properties to rent or sell</div>
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="broker"
            name="userType"
            value="broker"
            checked={selectedType === 'broker'}
            onChange={(e) => setSelectedType('broker')}
            className="form-radio"
          />
          <label htmlFor="broker">
            <div className="font-medium">Broker</div>
            <div className="text-sm text-gray-500">Professional real estate broker</div>
          </label>
        </div>
      </div>

      <button
        onClick={handleTypeSelection}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
}; 