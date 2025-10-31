import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { UtensilsCrossed, LogOut } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import BookingsList from '../components/BookingsList';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'new' | 'manage'>('new');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-amber-700" />
            <h1 className="text-2xl font-bold text-amber-900">Little Lemon</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Restaurant Hours</h3>
            <p className="text-2xl font-bold text-amber-900 mt-2">11:00 AM - 10:00 PM</p>
            <p className="text-gray-600 text-xs mt-1">Daily</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Max Guests Per Table</h3>
            <p className="text-2xl font-bold text-amber-900 mt-2">6 Guests</p>
            <p className="text-gray-600 text-xs mt-1">Per reservation</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Booking Duration</h3>
            <p className="text-2xl font-bold text-amber-900 mt-2">2 Hours</p>
            <p className="text-gray-600 text-xs mt-1">Per reservation</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Advance Booking</h3>
            <p className="text-2xl font-bold text-amber-900 mt-2">30 Days</p>
            <p className="text-gray-600 text-xs mt-1">Max advance period</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors ${
                activeTab === 'new'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Make a Booking
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors ${
                activeTab === 'manage'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Bookings
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'new' ? <BookingForm /> : <BookingsList />}
          </div>
        </div>
      </main>
    </div>
  );
}
