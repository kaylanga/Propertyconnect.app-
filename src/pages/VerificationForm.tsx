import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const VerificationForm: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idNumber: '',
    documentType: 'passport',
    documentFile: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your verification logic here
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your identity
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please provide your identification details
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="document-type" className="sr-only">
                Document Type
              </label>
              <select
                id="document-type"
                name="document-type"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              >
                <option value="passport">Passport</option>
                <option value="national-id">National ID</option>
                <option value="drivers-license">Driver's License</option>
              </select>
            </div>
            <div>
              <label htmlFor="id-number" className="sr-only">
                ID Number
              </label>
              <input
                id="id-number"
                name="id-number"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="ID Number"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="document-file" className="sr-only">
                Document File
              </label>
              <input
                id="document-file"
                name="document-file"
                type="file"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                onChange={(e) => setFormData({ ...formData, documentFile: e.target.files?.[0] || null })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 