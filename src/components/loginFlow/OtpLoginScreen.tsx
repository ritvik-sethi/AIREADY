import React, { useEffect, useRef } from 'react';

interface OtpLoginScreenProps {
  emailOrMobile: string;
  otp: string[];
  setOtpValue: (index: number, value: string) => void;
  otpError: string;
  isLoading: boolean;
  isResendingOtp: boolean;
  isSignUp: boolean;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}

export const OtpLoginScreen: React.FC<OtpLoginScreenProps> = ({
  emailOrMobile,
  otp,
  setOtpValue,
  otpError,
  isLoading,
  isResendingOtp,
  isSignUp,
  onVerify,
  onResend,
  onBack,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input when component mounts
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
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
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify();
    }
  };

  const otpString = otp.join('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Enter Verification Code
        </h2>
        <p className="text-gray-600 mb-2 text-center">
          We've sent a 6-digit code to
        </p>
        <p className="text-gray-900 font-medium mb-8 text-center">
          {emailOrMobile}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  otpError ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
            ))}
          </div>

          {otpError && (
            <p className="text-sm text-red-600 text-center">{otpError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || otpString.length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
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

