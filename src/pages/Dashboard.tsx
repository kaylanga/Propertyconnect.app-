import { FC } from 'react';
import { useAppStore } from '../store';

export const Dashboard: FC = () => {
  const user = useAppStore(state => state.user);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900">Welcome, {user?.email}</h2>
              <p className="mt-2 text-gray-600">
                This is your dashboard. You can manage your properties and account settings here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 