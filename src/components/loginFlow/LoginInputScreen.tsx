import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface LoginInputScreenProps {
  emailOrMobile: string;
  setEmailOrMobile: (value: string) => void;
  error: string;
  isLoading: boolean;
  onSubmit: () => void;
}

export const LoginInputScreen: React.FC<LoginInputScreenProps> = ({
  emailOrMobile,
  setEmailOrMobile,
  error,
  isLoading,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isValidMobile = (value: string) => {
    return /^[6-9]\d{9}$/.test(value);
  };

  const getInputType = () => {
    if (!emailOrMobile.trim()) return 'text';
    if (isValidEmail(emailOrMobile.trim())) return 'email';
    if (isValidMobile(emailOrMobile.trim())) return 'tel';
    return 'text';
  };

  const getPlaceholder = () => {
    if (!emailOrMobile.trim()) return 'Enter your email or mobile number';
    if (isValidEmail(emailOrMobile.trim())) return 'email@example.com';
    if (isValidMobile(emailOrMobile.trim())) return '9876543210';
    return 'Enter your email or mobile number';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Sign In
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Enter your email or mobile number to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="emailOrMobile" className="block text-sm font-medium text-gray-700 mb-2">
              Email or Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isValidEmail(emailOrMobile.trim()) ? (
                  <Mail className="h-5 w-5 text-gray-400" />
                ) : (
                  <Phone className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <input
                id="emailOrMobile"
                type={getInputType()}
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                placeholder={getPlaceholder()}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                autoFocus
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !emailOrMobile.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

