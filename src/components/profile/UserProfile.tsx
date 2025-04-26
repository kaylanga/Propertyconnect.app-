import * as React from 'react';
import { useState, useEffect } from 'react';
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

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch user profile data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch profile');
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSave = async (): Promise<void> => {
    if (!user || !profile) return;
    
    try {
      // Save profile data
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to save profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
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