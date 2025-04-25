import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, DollarSign, MapPin } from 'lucide-react';

interface HeroSearchFormProps {
  type: 'buy' | 'rent';
}

const HeroSearchForm: React.FC<HeroSearchFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  
  // Popular locations for suggestions
  const popularLocations = [
    'Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu', 'Mbale', 'Fort Portal'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (propertyType) params.append('type', propertyType);
    if (priceRange) params.append('price', priceRange);
    params.append('purpose', type);
    
    // Navigate to search page with filters
    navigate({
      pathname: '/search',
      search: params.toString()
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Location"
            className="input pl-10"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {location && location.length > 1 && (
            <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
              {popularLocations
                .filter(loc => loc.toLowerCase().includes(location.toLowerCase()))
                .map((loc, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setLocation(loc)}
                  >
                    {loc}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Property Type */}
        <div>
          <select
            className="select"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
            <option value="office">Office Space</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="select pl-10"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Price Range</option>
            <option value="0-100000">Below 100,000 UGX</option>
            <option value="100000-500000">100,000 - 500,000 UGX</option>
            <option value="500000-1000000">500,000 - 1,000,000 UGX</option>
            <option value="1000000-5000000">1,000,000 - 5,000,000 UGX</option>
            <option value="5000000-10000000">5,000,000 - 10,000,000 UGX</option>
            <option value="10000000+">Above 10,000,000 UGX</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="btn-primary py-3 text-base"
        >
          <Search className="mr-2 h-5 w-5" />
          Find Properties
        </button>
      </div>
    </form>
  );
};

export default HeroSearchForm;