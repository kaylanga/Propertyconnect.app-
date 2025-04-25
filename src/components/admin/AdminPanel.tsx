import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const AdminPanel = () => {
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadVerificationRequests();
    loadUsers();
  }, []);

  const loadVerificationRequests = async () => {
    const { data } = await supabase
      .from('verification_requests')
      .select('*, users(*)');
    setVerificationRequests(data || []);
  };

  const loadUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*');
    setUsers(data || []);
  };

  const handleVerificationAction = async (requestId: string, status: 'approved' | 'rejected') => {
    await supabase
      .from('verification_requests')
      .update({ status })
      .eq('id', requestId);
    
    loadVerificationRequests();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Verification Requests</h2>
        <div className="space-y-4">
          {verificationRequests.map((request) => (
            <div key={request.id} className="border p-4 rounded">
              <p>User: {request.users?.email}</p>
              <p>Type: {request.user_type}</p>
              <p>Status: {request.status}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleVerificationAction(request.id, 'approved')}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleVerificationAction(request.id, 'rejected')}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 