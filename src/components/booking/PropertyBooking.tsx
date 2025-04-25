import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface BookingSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

interface BookingFormData {
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const PropertyBooking: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const { user } = useAuth();
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    time: '',
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: ''
  });

  const handleDateChange = async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/properties/${propertyId}/available-slots?date=${date}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch available slots');
      const slots = await response.json();
      setAvailableSlots(slots);
      setFormData(prev => ({ ...prev, date }));
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/properties/${propertyId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to book appointment');

      // Show success message and reset form
      alert('Booking successful! You will receive a confirmation email shortly.');
      setFormData({
        date: '',
        time: '',
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        message: ''
      });
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Schedule a Viewing</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Date
          </label>
          <input
            type="date"
            min={format(new Date(), 'yyyy-MM-dd')}
            value={formData.date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        {/* Time Slots */}
        {formData.date && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots
            </label>
            <div className="grid grid-cols-3 gap-2">
              {loading ? (
                <div className="col-span-3 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="col-span-3 text-sm text-gray-500">
                  No available slots for this date
                </p>
              ) : (
                availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(slot.id);
                      setFormData(prev => ({ ...prev, time: slot.time }));
                    }}
                    disabled={!slot.available}
                    className={`py-2 px-4 text-sm font-medium rounded-md ${
                      selectedSlot === slot.id
                        ? 'bg-primary-600 text-white'
                        : slot.available
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message (Optional)
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedSlot}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            loading || !selectedSlot ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Booking...' : 'Schedule Viewing'}
        </button>
      </form>
    </div>
  );
}; 