/**
 * Validation utilities for login flow
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile.trim());
};

export const isValidEmailOrMobile = (value: string): boolean => {
  return isValidEmail(value) || isValidMobile(value);
};

export const validateEmailOrMobile = (value: string): string => {
  if (!value.trim()) {
    return 'Please enter your email or mobile number';
  }
  
  if (isValidEmail(value.trim())) {
    return '';
  }
  
  if (isValidMobile(value.trim())) {
    return '';
  }
  
  return 'Please enter a valid email or 10-digit mobile number';
};

export const validatePassword = (password: string): string => {
  if (!password.trim()) {
    return 'Please enter a password';
  }
  
  if (password.length < 6 || password.length > 14) {
    return 'Password must be between 6-14 characters';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  
  return '';
};

export const validateName = (name: string): string => {
  if (!name.trim()) {
    return 'Please enter your full name';
  }
  
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  return '';
};

export const validateMobile = (mobile: string, required: boolean = false): string => {
  if (!mobile.trim()) {
    return required ? 'Please enter your mobile number' : '';
  }
  
  if (!isValidMobile(mobile.trim())) {
    return 'Please enter a valid 10-digit mobile number';
  }
  
  return '';
};

export const validateOtp = (otp: string[]): string => {
  const otpString = otp.join('');
  
  if (otpString.length !== 6) {
    return 'Please enter all 6 digits';
  }
  
  if (!/^\d{6}$/.test(otpString)) {
    return 'OTP must contain only numbers';
  }
  
  return '';
};

