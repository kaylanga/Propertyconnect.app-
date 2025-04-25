import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserType();
      checkVerificationStatus();
    }
  }, [user]);

  const fetchUserType = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('id', user?.id)
      .single();
    
    if (data) {
      setUserType(data.user_type);
    }
  };

  const checkVerificationStatus = async () => {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('status')
      .eq('user_id', user?.id)
      .eq('status', 'approved')
      .single();
    
    setIsVerified(!!data);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              Logo
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                Home
              </Link>
              <Link to="/search" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                Search Properties
              </Link>
              
              {/* Show property management link only for verified landlords and brokers */}
              {isVerified && (userType === 'landlord' || userType === 'broker') && (
                <Link to="/properties/manage" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent">
                  Manage Properties
                </Link>
              )}
            </div>
          </div>

          {user && (
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.user_metadata.avatar_url || '/default-avatar.png'}
                    alt="Profile"
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    
                    {/* Show verification link for unverified landlords and brokers */}
                    {!isVerified && (userType === 'landlord' || userType === 'broker') && (
                      <Link to="/verify" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Complete Verification
                      </Link>
                    )}
                    
                    {/* Show property management for verified landlords and brokers */}
                    {isVerified && (userType === 'landlord' || userType === 'broker') && (
                      <Link to="/properties/manage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Manage Properties
                      </Link>
                    )}
                    
                    <button
                      onClick={signOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}; 