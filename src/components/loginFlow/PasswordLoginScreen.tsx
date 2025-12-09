import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { PasswordValidationTooltip, validatePasswordRules } from './PasswordValidationTooltip';

interface PasswordLoginScreenProps {
  emailOrMobile: string;
  password: string;
  setPassword: (value: string) => void;
  passwordError: string;
  isLoading: boolean;
  isSendingOtp: boolean;
  onLogin: () => void;
  onLoginViaOtp: () => void;
  onForgotPassword: () => void;
  onBack: () => void;
  onChangeEmail: () => void;
}

export const PasswordLoginScreen: React.FC<PasswordLoginScreenProps> = ({
  emailOrMobile,
  password,
  setPassword,
  passwordError,
  isLoading,
  isSendingOtp,
  onLogin,
  onLoginViaOtp,
  onForgotPassword,
  onBack,
  onChangeEmail,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  // Check if password meets all validation rules
  const isPasswordValid = validatePasswordRules(password);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Enter Your Password
        </h2>
        <p className="text-gray-600 mb-2 text-center">
          Signed in as <span className="font-medium">{emailOrMobile}</span>
        </p>
        <button
          type="button"
          onClick={onChangeEmail}
          className="text-sm text-blue-600 hover:text-blue-700 mb-8 mx-auto block"
        >
          Change email/mobile
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="ml-2 relative">
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
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                required
                minLength={6}
                maxLength={14}
                autoFocus
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

          <button
            type="submit"
            disabled={isLoading || !password.trim() || !isPasswordValid}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="button"
              onClick={onLoginViaOtp}
              disabled={isSendingOtp}
              className="w-full bg-white text-blue-600 border-2 border-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSendingOtp ? 'Sending OTP...' : 'Login via OTP'}
            </button>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-700 text-center"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="w-full mt-4 text-gray-600 hover:text-gray-700 text-sm"
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  );
};

