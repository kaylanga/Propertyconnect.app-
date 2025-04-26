import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ImageUpload } from '../common/ImageUpload';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  role: 'USER' | 'AGENT' | 'ADMIN';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'UNVERIFIED';
}

export const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        // Fetch user profile data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user || !profile) return;
    
    try {
      // Save profile data
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          {/* Profile content will go here */}
          <p>Profile content</p>
        </div>
      )}
    </div>
  );
}; 