import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { UtensilsCrossed } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleAuthError = (message: string) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <UtensilsCrossed className="w-8 h-8 text-amber-700 mr-2" />
          <h1 className="text-3xl font-bold text-amber-900">Little Lemon</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 font-semibold text-center border-b-2 transition-colors ${
                isLogin
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              aria-selected={isLogin}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 font-semibold text-center border-b-2 transition-colors ${
                !isLogin
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              aria-selected={!isLogin}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
              {error}
            </div>
          )}

          {isLogin ? (
            <LoginForm onError={handleAuthError} />
          ) : (
            <RegisterForm onError={handleAuthError} />
          )}

          <p className="mt-6 text-center text-gray-600 text-sm">
            Welcome to Little Lemon Restaurant. Sign in to make your reservation.
          </p>
        </div>
      </div>
    </div>
  );
}
