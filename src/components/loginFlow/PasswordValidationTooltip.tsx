import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ValidationRule {
  id: string;
  label: string;
  isValid: boolean;
}

interface PasswordValidationTooltipProps {
  password: string;
  isVisible: boolean;
}

export const PasswordValidationTooltip: React.FC<PasswordValidationTooltipProps> = ({
  password,
  isVisible,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validationRules: ValidationRule[] = [
    {
      id: 'length',
      label: '6-14 characters',
      isValid: password.length >= 6 && password.length <= 14,
    },
    {
      id: 'lowercase',
      label: 'lower case character(a-z)',
      isValid: /[a-z]/.test(password),
    },
    {
      id: 'numeric',
      label: 'Numeric character (0-9)',
      isValid: /[0-9]/.test(password),
    },
    {
      id: 'special',
      label: 'Special character (Such as !,@,#,$,%,&)',
      isValid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
    },
  ];

  // Clear hide timeout helper
  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // Show tooltip on hover of password input field
  useEffect(() => {
    const passwordInput = document.getElementById('password');
    
    const handleMouseEnter = () => {
      clearHideTimeout();
      setShowTooltip(true);
    };
    
    const handleMouseLeave = () => {
      // Add a small delay before hiding to allow mouse to move to tooltip
      clearHideTimeout();
      hideTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 150);
    };

    if (passwordInput) {
      passwordInput.addEventListener('mouseenter', handleMouseEnter);
      passwordInput.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearHideTimeout();
      if (passwordInput) {
        passwordInput.removeEventListener('mouseenter', handleMouseEnter);
        passwordInput.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative inline-block" style={{ zIndex: 1000 }}>

      {showTooltip && (
        <div
          ref={tooltipRef}
          onMouseEnter={() => {
            clearHideTimeout();
            setShowTooltip(true);
          }}
          onMouseLeave={() => {
            clearHideTimeout();
            hideTimeoutRef.current = setTimeout(() => {
              setShowTooltip(false);
            }, 100);
          }}
          className="absolute left-full top-0 ml-[150px] w-48 bg-white border-2 border-gray-300 rounded-lg shadow-2xl p-2"
          style={{
            zIndex: 10000,
            position: 'absolute',
            pointerEvents: 'auto',
          }}
        >
          <div className="space-y-0.5">
            {validationRules.map((rule) => (
              <div key={rule.id} className="flex items-center space-x-1">
                {rule.isValid ? (
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="w-3 h-3 text-red-500 flex-shrink-0" />
                )}
                <span
                  className={`text-xs leading-tight ${
                    rule.isValid ? 'text-green-700' : 'text-gray-700'
                  }`}
                >
                  {rule.label}
                </span>
              </div>
            ))}
          </div>
          {/* Arrow pointing to the input field */}
          <div className="absolute left-0 top-2 -ml-1 w-1.5 h-1.5 bg-white border-l-2 border-t-2 border-gray-300 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export const validatePasswordRules = (password: string): boolean => {
  const validationRules = [
    password.length >= 6 && password.length <= 14,
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
  ];

  return validationRules.every((rule) => rule);
};

