import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LoggingService } from '../services/LoggingService';

interface VerificationRequest {
  id: string;
  user_id: string;
  user_type: 'landlord' | 'broker';
  full_name: string;
  phone_number: string;
  email: string;
  business_license_url?: string;
  certificate_of_incorporation_url?: string;
  office_location?: string;
  property_ownership_proof_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const AdminPanel = () => {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadVerificationRequests();
  }, [filter]);

  const loadVerificationRequests = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('verification_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setVerificationRequests(data || []);
    } catch (error) {
      console.error('Error loading verification requests:', error);
      await LoggingService.log({
        level: 'error',
        message: 'Failed to load verification requests',
        metadata: { error }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('verification_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      // Update user profile type if approved
      if (status === 'approved') {
        const request = verificationRequests.find(r => r.id === requestId);
        if (request) {
          await supabase
            .from('user_profiles')
            .update({ user_type: request.user_type })
            .eq('id', request.user_id);
        }
      }

      await loadVerificationRequests();
      
      await LoggingService.log({
        level: 'info',
        message: `Verification request ${status}`,
        metadata: { requestId, status }
      });
    } catch (error) {
      console.error('Error updating verification status:', error);
      await LoggingService.log({
        level: 'error',
        message: 'Failed to update verification status',
        metadata: { error, requestId, status }
      });
    }
  };

  const ViewDocument = ({ url, label }: { url: string; label: string }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline"
    >
      View {label}
    </a>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      {/* Filter Controls */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-6">
          {verificationRequests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-lg">{request.full_name}</h3>
                  <p className="text-gray-600">{request.email}</p>
                  <p className="text-gray-600">{request.phone_number}</p>
                  <p className="capitalize">Type: {request.user_type}</p>
                  <p className={`font-semibold ${
                    request.status === 'approved' ? 'text-green-600' :
                    request.status === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    Status: {request.status}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {request.user_type === 'broker' && (
                    <>
                      {request.business_license_url && (
                        <ViewDocument url={request.business_license_url} label="Business License" />
                      )}
                      {request.certificate_of_incorporation_url && (
                        <ViewDocument url={request.certificate_of_incorporation_url} label="Certificate of Incorporation" />
                      )}
                      <p>Office: {request.office_location}</p>
                    </>
                  )}
                  
                  {request.user_type === 'landlord' && request.property_ownership_proof_url && (
                    <ViewDocument url={request.property_ownership_proof_url} label="Property Ownership Proof" />
                  )}
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="mt-4 space-x-4">
                  <button
                    onClick={() => handleVerificationAction(request.id, 'approved')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerificationAction(request.id, 'rejected')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 