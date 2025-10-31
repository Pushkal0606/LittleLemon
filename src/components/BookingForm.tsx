import { useContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, Users, FileText, Loader, CheckCircle } from 'lucide-react';

export default function BookingForm() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    numberOfGuests: 2,
    occasion: '',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateForm = (): boolean => {
    if (!formData.date || !formData.time) {
      setError('Please select a date and time');
      return false;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('Cannot book in the past');
      return false;
    }

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (selectedDate > maxDate) {
      setError('Can only book up to 30 days in advance');
      return false;
    }

    if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
      const dayName = selectedDate.getDay() === 0 ? 'Sunday' : 'Saturday';
      setError(`Bookings currently closed on ${dayName}s`);
      return false;
    }

    if (formData.numberOfGuests < 1 || formData.numberOfGuests > 6) {
      setError('Number of guests must be between 1 and 6');
      return false;
    }

    const [hours, minutes] = formData.time.split(':').map(Number);
    if (hours < 11 || hours >= 22 || (hours === 21 && minutes > 0)) {
      setError('Bookings available between 11:00 AM and 9:00 PM');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      const { error: bookingError } = await supabase.from('bookings').insert({
        user_id: user.id,
        date: formData.date,
        time: formData.time,
        number_of_guests: formData.numberOfGuests,
        occasion: formData.occasion,
        special_requests: formData.specialRequests,
      });

      if (bookingError) {
        setError('Failed to create booking. Please try again.');
      } else {
        setSuccess(true);
        setFormData({
          date: '',
          time: '',
          numberOfGuests: 2,
          occasion: '',
          specialRequests: '',
        });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl">
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3" role="alert">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900">Booking Confirmed!</h3>
            <p className="text-green-700 text-sm">Your reservation has been successfully created. Check your bookings for details.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Date
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={getTodayDate()}
              max={getMaxDate()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              disabled={loading}
              required
            />
            <p className="text-gray-500 text-xs mt-1">Within 30 days from today</p>
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Time
            </label>
            <input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              min="11:00"
              max="21:00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              disabled={loading}
              required
            />
            <p className="text-gray-500 text-xs mt-1">11:00 AM to 9:00 PM</p>
          </div>
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline w-4 h-4 mr-1" />
            Number of Guests
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    numberOfGuests: Math.max(1, formData.numberOfGuests - 1),
                  })
                }
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                disabled={loading || formData.numberOfGuests === 1}
              >
                −
              </button>
              <span className="px-6 py-2 font-semibold text-center min-w-[60px]">
                {formData.numberOfGuests}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    numberOfGuests: Math.min(6, formData.numberOfGuests + 1),
                  })
                }
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                disabled={loading || formData.numberOfGuests === 6}
              >
                +
              </button>
            </div>
            <p className="text-gray-500 text-sm">1 to 6 guests</p>
          </div>
        </div>

        <div>
          <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-2">
            Occasion (Optional)
          </label>
          <input
            id="occasion"
            type="text"
            value={formData.occasion}
            onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
            placeholder="e.g., Birthday, Anniversary, Business Meeting"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            disabled={loading}
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline w-4 h-4 mr-1" />
            Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            placeholder="Let us know any dietary restrictions, seating preferences, or other requests..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            disabled={loading}
            maxLength={500}
          />
          <p className="text-gray-500 text-xs mt-1">{formData.specialRequests.length}/500 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {loading ? 'Booking...' : 'Book Your Table'}
        </button>
      </form>
    </div>
  );
}
