import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  BellIcon,
  LockClosedIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/outline';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
    location: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    propertyAlerts: boolean;
    messageAlerts: boolean;
    newsletterSubscription: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
  };
  preferences: {
    currency: string;
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'system';
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginHistory: Array<{
      date: string;
      device: string;
      location: string;
      ip: string;
    }>;
  };
}

export const UserSettings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/user/settings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch user settings');

      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching user settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (
    section: keyof UserSettings,
    updates: Partial<UserSettings[keyof UserSettings]>
  ) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/user/settings/${section}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update settings');

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload avatar
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await fetch('/api/user/avatar', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: formData
        });

        if (!response.ok) throw new Error('Failed to upload avatar');

        const data = await response.json();
        setSettings((prev) => prev ? {
          ...prev,
          profile: {
            ...prev.profile,
            avatar: data.avatarUrl
          }
        } : null);
      } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Failed to upload avatar. Please try again.');
      }
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={avatarPreview || settings?.profile.avatar}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-sm">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <CogIcon className="h-5 w-5 text-gray-500" />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
          <p className="text-sm text-gray-500">
            JPG, GIF or PNG. Max size 2MB.
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={settings?.profile.name}
            onChange={(e) =>
              handleSettingsUpdate('profile', { name: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={settings?.profile.email}
            onChange={(e) =>
              handleSettingsUpdate('profile', { email: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            value={settings?.profile.phone}
            onChange={(e) =>
              handleSettingsUpdate('profile', { phone: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            value={settings?.profile.bio}
            onChange={(e) =>
              handleSettingsUpdate('profile', { bio: e.target.value })
            }
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={settings?.profile.location}
            onChange={(e) =>
              handleSettingsUpdate('profile', { location: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(settings?.notifications || {}).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </h4>
              <p className="text-sm text-gray-500">
                Receive notifications for {key.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  handleSettingsUpdate('notifications', {
                    [key]: e.target.checked
                  })
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Profile Visibility
        </label>
        <select
          value={settings?.privacy.profileVisibility}
          onChange={(e) =>
            handleSettingsUpdate('privacy', {
              profileVisibility: e.target.value as UserSettings['privacy']['profileVisibility']
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="contacts">Contacts Only</option>
        </select>
      </div>

      <div className="space-y-4">
        {Object.entries(settings?.privacy || {})
          .filter(([key]) => key !== 'profileVisibility')
          .map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Show {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </h4>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    handleSettingsUpdate('privacy', {
                      [key]: e.target.checked
                    })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">
            Two-Factor Authentication
          </h4>
          <p className="text-sm text-gray-500">
            Add an extra layer of security to your account
          </p>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings?.security.twoFactorEnabled}
            onChange={(e) =>
              handleSettingsUpdate('security', {
                twoFactorEnabled: e.target.checked
              })
            }
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Recent Login Activity
        </h4>
        <div className="space-y-4">
          {settings?.security.loginHistory.map((login, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-200"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {login.device}
                </p>
                <p className="text-sm text-gray-500">
                  {login.location} • {login.ip}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(login.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`${
              activeTab === 'notifications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <BellIcon className="h-5 w-5 mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`${
              activeTab === 'privacy'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Privacy
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`${
              activeTab === 'security'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <LockClosedIcon className="h-5 w-5 mr-2" />
            Security
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="p-6">
        {activeTab === 'profile' && renderProfileSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'privacy' && renderPrivacySettings()}
        {activeTab === 'security' && renderSecuritySettings()}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSettingsUpdate(activeTab as keyof UserSettings, {})}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}; 