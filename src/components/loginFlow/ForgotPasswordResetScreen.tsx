import React, { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { PasswordValidationTooltip, validatePasswordRules } from './PasswordValidationTooltip';

interface ForgotPasswordResetScreenProps {
  emailOrMobile: string;
  otp: string[];
  setOtpValue: (index: number, value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  otpError: string;
  passwordError: string;
  isLoading: boolean;
  isResendingOtp: boolean;
  onSubmit: () => void;
  onResend: () => void;
  onBack: () => void;
}

export const ForgotPasswordResetScreen: React.FC<ForgotPasswordResetScreenProps> = ({
  emailOrMobile,
  otp,
  setOtpValue,
  password,
  setPassword,
  otpError,
  passwordError,
  isLoading,
  isResendingOtp,
  onSubmit,
  onResend,
  onBack,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first OTP input when component mounts
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    setOtpValue(index, value);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if all characters are digits
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    // Find the currently focused input index
    const activeElement = document.activeElement as HTMLInputElement;
    const focusedIndex = activeElement ? parseInt(activeElement.id.split('-')[1]) : 0;

    // Check if paste fits within remaining input boxes
    const remainingBoxes = 6 - focusedIndex;
    if (pastedData.length > remainingBoxes) {
      return;
    }

    // Handle partial or full paste
    for (let i = 0; i < pastedData.length; i++) {
      if (focusedIndex + i < 6) {
        setOtpValue(focusedIndex + i, pastedData[i]);
      }
    }

    // Focus the next empty input or the last filled input
    const nextIndex = Math.min(focusedIndex + pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const otpString = otp.join('');
  
  // Check if password meets all validation rules
  const isPasswordValid = validatePasswordRules(password);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Reset Your Password
        </h2>
        <p className="text-gray-600 mb-2 text-center">
          To reset your password, we have sent you a verification code at
        </p>
        <p className="text-gray-900 font-medium mb-2 text-center">
          {emailOrMobile}
        </p>
        <p className="text-gray-600 mb-8 text-center">
          Please enter the code below along with your new password to verify your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    otpError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              ))}
            </div>
            {otpError && (
              <p className="mt-2 text-sm text-red-600">{otpError}</p>
            )}
          </div>

          <div>
            <div className="flex items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
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
                placeholder="Enter your new password"
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

          <button
            type="submit"
            disabled={isLoading || otpString.length !== 6 || !password.trim() || !isPasswordValid}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={onResend}
              disabled={isResendingOtp}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResendingOtp ? 'Resending...' : 'Resend OTP'}
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

