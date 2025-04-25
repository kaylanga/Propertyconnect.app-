import React, { useState, useEffect } from 'react';
import { format, addDays, isBefore, parseISO } from 'date-fns';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/outline';

interface Tour {
  id: string;
  propertyId: string;
  propertyTitle: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  agentId: string;
  agentName: string;
  notes: string;
  virtualTour: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export const PropertyTourScheduler: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
    virtualTour: false
  });

  useEffect(() => {
    fetchTours();
  }, [propertyId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tours?propertyId=${propertyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch tours');
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTimeSlots = async () => {
    try {
      const response = await fetch(
        `/api/tours/time-slots?propertyId=${propertyId}&date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch time slots');
      const data = await response.json();
      setTimeSlots(data);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const scheduleTour = async () => {
    try {
      const response = await fetch('/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          propertyId,
          date: selectedDate,
          time: selectedTime,
          ...formData
        })
      });

      if (!response.ok) throw new Error('Failed to schedule tour');

      const newTour = await response.json();
      setTours([...tours, newTour]);
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error scheduling tour:', error);
      alert('Failed to schedule tour. Please try again.');
    }
  };

  const cancelTour = async (tourId: string) => {
    if (!confirm('Are you sure you want to cancel this tour?')) return;

    try {
      const response = await fetch(`/api/tours/${tourId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to cancel tour');

      setTours(tours.filter(tour => tour.id !== tourId));
    } catch (error) {
      console.error('Error cancelling tour:', error);
      alert('Failed to cancel tour. Please try again.');
    }
  };

  const resetForm = () => {
    setSelectedDate('');
    setSelectedTime('');
    setFormData({
      notes: '',
      virtualTour: false
    });
  };

  const getStatusColor = (status: Tour['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'text-green-800 bg-green-100';
      case 'Pending':
        return 'text-yellow-800 bg-yellow-100';
      case 'Completed':
        return 'text-blue-800 bg-blue-100';
      case 'Cancelled':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Schedule a Property Tour
      </h2>

      {/* Tour Scheduling Form */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(7)].map((_, index) => {
                const date = addDays(new Date(), index + 1);
                const dateString = format(date, 'yyyy-MM-dd');
                return (
                  <button
                    key={dateString}
                    onClick={() => setSelectedDate(dateString)}
                    className={`p-2 text-center rounded-lg border ${
                      selectedDate === dateString
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    <div className="text-xs">{format(date, 'EEE')}</div>
                    <div className="text-sm font-semibold">
                      {format(date, 'd')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`p-2 text-center rounded-lg border ${
                      selectedTime === slot.time
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : slot.available
                        ? 'border-gray-300 hover:border-primary-500'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedDate && selectedTime && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Any special requests or questions..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="virtualTour"
                checked={formData.virtualTour}
                onChange={(e) =>
                  setFormData({ ...formData, virtualTour: e.target.checked })
                }
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="virtualTour"
                className="ml-2 text-sm text-gray-700"
              >
                Request Virtual Tour
              </label>
            </div>

            <button
              onClick={scheduleTour}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Schedule Tour
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Tours */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Your Scheduled Tours
        </h3>
        <div className="space-y-4">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium text-gray-900">
                  {tour.propertyTitle}
                </h4>
                <div className="mt-1 text-sm text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(parseISO(tour.date), 'MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {tour.time}
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {tour.agentName}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                    tour.status
                  )}`}
                >
                  {tour.status}
                </span>
                {tour.status !== 'Cancelled' && tour.status !== 'Completed' && (
                  <button
                    onClick={() => cancelTour(tour.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}

          {tours.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No scheduled tours yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 