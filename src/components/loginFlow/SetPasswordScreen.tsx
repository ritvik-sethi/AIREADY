import React, { useState } from 'react';
import { User, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { PasswordValidationTooltip, validatePasswordRules } from './PasswordValidationTooltip';

interface SetPasswordScreenProps {
  emailOrMobile: string;
  name: string;
  setName: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  mobile: string;
  setMobile: (value: string) => void;
  nameError: string;
  passwordError: string;
  mobileError: string;
  isLoading: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export const SetPasswordScreen: React.FC<SetPasswordScreenProps> = ({
  emailOrMobile,
  name,
  setName,
  password,
  setPassword,
  mobile,
  setMobile,
  nameError,
  passwordError,
  mobileError,
  isLoading,
  onSubmit,
  onBack,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isEmail = isValidEmail(emailOrMobile.trim());
  
  // Check if password meets all validation rules
  const isPasswordValid = validatePasswordRules(password);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Set Your Password
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          {isEmail 
            ? `We'll use ${emailOrMobile} for your account`
            : `We'll use ${emailOrMobile} for your account`
          }
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  nameError ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                required
                autoFocus
              />
            </div>
            {nameError && (
              <p className="mt-2 text-sm text-red-600">{nameError}</p>
            )}
          </div>

          <div>
            <div className="flex items-center mb-2 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="ml-2" style={{ position: 'relative', zIndex: 1000 }}>
                <PasswordValidationTooltip password={password} isVisible={true} />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                required
                minLength={6}
                maxLength={14}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-2 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  mobileError ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                maxLength={10}
              />
            </div>
            {mobileError && (
              <p className="mt-2 text-sm text-red-600">{mobileError}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim() || !password.trim() || !isPasswordValid}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Account & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

