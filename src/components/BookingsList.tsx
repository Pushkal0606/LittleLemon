import { useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Clock, Users, FileText, Trash2, Loader } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  time: string;
  number_of_guests: number;
  occasion: string;
  special_requests: string;
  status: string;
  created_at: string;
}

export default function BookingsList() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  const fetchBookings = async () => {
    if (!user?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (fetchError) {
        setError('Failed to load bookings');
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setDeletingId(bookingId);

    try {
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (deleteError) {
        setError('Failed to cancel booking');
      } else {
        setBookings(bookings.filter((b) => b.id !== bookingId));
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isUpcoming = (dateStr: string, timeStr: string) => {
    const bookingDate = new Date(`${dateStr}T${timeStr}`);
    return bookingDate > new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 animate-spin text-amber-600" />
        <span className="ml-2 text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
        <p className="text-gray-600">Go to "Make a Booking" to create your first reservation</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const upcoming = isUpcoming(booking.date, booking.time);
        return (
          <div
            key={booking.id}
            className={`border rounded-lg p-6 transition-all ${
              upcoming
                ? 'bg-white border-amber-200 hover:shadow-md'
                : 'bg-gray-50 border-gray-200 opacity-75'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-gray-900">{formatDate(booking.date)}</span>
                  {!upcoming && (
                    <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded">
                      Past
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>{formatTime(booking.time)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>{booking.number_of_guests} {booking.number_of_guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>

                  {booking.occasion && (
                    <div className="text-gray-700">
                      <span className="font-medium">Occasion:</span> {booking.occasion}
                    </div>
                  )}
                </div>

                {booking.special_requests && (
                  <div className="flex gap-2 text-sm">
                    <FileText className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Special Requests:</p>
                      <p className="text-gray-600">{booking.special_requests}</p>
                    </div>
                  </div>
                )}
              </div>

              {upcoming && (
                <button
                  onClick={() => handleDelete(booking.id)}
                  disabled={deletingId === booking.id}
                  className="bg-red-50 hover:bg-red-100 disabled:bg-gray-200 text-red-700 disabled:text-gray-500 font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 self-start md:self-center"
                >
                  {deletingId === booking.id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Cancel
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
