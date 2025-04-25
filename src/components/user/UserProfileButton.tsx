import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const UserProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center">
        <img src={user?.avatar_url || '/default-avatar.png'} className="w-8 h-8 rounded-full" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
          <a href="/profile" className="block px-4 py-2">Profile</a>
          <a href="/dashboard" className="block px-4 py-2">Dashboard</a>
          <button onClick={handleLogout} className="block w-full text-left px-4 py-2">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}; 