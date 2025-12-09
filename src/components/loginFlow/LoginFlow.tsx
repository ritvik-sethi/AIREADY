import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { store } from '../../store';
import {
  checkUserExists,
  registerNewUser,
  verifySignUpOtp,
  loginWithPassword,
  sendLoginOtp,
  verifyLoginOtp,
  sendForgotPasswordOtp,
  resetPassword,
  resendOtp,
  setCurrentScreen,
  setEmailOrMobile,
  setPassword,
  setName,
  setMobile,
  setOtpValue,
  setEmailOrMobileError,
  setPasswordError,
  setNameError,
  setMobileError,
  setOtpError,
  resetLoginFlow,
  setSsoid,
  setAvailablePlans,
} from '../../store/slices/loginFlowSlice';
import {
  validateEmailOrMobile,
  validatePassword,
  validateName,
  validateMobile,
  validateOtp,
  isValidEmail,
  isValidMobile,
} from '../../utils/validation';
import { getCookie } from '../../utils/cookieUtils';
import { checkUserIfSubscribed } from '../../utils/jssoUtils';
import { continueToPay, PaymentPlan } from '../../utils/paymentUtils';
import { LoginInputScreen } from './LoginInputScreen';
import { SetPasswordScreen } from './SetPasswordScreen';
import { PasswordLoginScreen } from './PasswordLoginScreen';
import { OtpLoginScreen } from './OtpLoginScreen';
import { ForgotPasswordResetScreen } from './ForgotPasswordResetScreen';
import { SuccessScreen } from './SuccessScreen';
import { PlanSelectionScreen } from './PlanSelectionScreen';

interface LoginFlowProps {
  onSuccess?: () => void;
  onClose?: () => void;
  embedded?: boolean; // If true, renders without modal wrapper for embedding in other modals
}

export const LoginFlow: React.FC<LoginFlowProps> = ({ onSuccess, onClose, embedded = false }) => {
  const dispatch = useAppDispatch();
  const [flag, setFlag] = useState(false);
  const {
    currentScreen,
    emailOrMobile,
    password,
    name,
    mobile,
    otp,
    ssoid,
    isLoading,
    isCheckingUser,
    isSendingOtp,
    isVerifyingOtp,
    isResendingOtp,
    emailOrMobileError,
    passwordError,
    nameError,
    mobileError,
    otpError,
    registrationResponse,
    availablePlans,
  } = useAppSelector((state) => state.loginFlow);
  
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const executionCountRef = useRef(0);
  const continueToPayCalledRef = useRef(false);
  const MAX_EXECUTIONS = 5;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Set default plans on mount (you can fetch from API or use static plans)
  useEffect(() => {
    // Default plans - can be replaced with API call
    const defaultPlans: PaymentPlan[] = [
        {
            planCode: 'varienttest1', 
            flatDiscount: '20%',
            recurring: 'true',
            planPeriod: '1',
            planPeriodUnit: 'month',
            finalPlanPrice: 1999,
            currency: 'INR',
            mobileNumber: '9876543210',
            abTestKey: { set: 'testAbKey' },
            udf6: 'testUdfAb6',
            udf7: 'testUdfAb7',
            udf8: 'testUdfAb8',
            checkReferer: false,
          },
          {
            planCode: 'varienttest2', 
            flatDiscount: '20%',
            recurring: 'true',
            planPeriod: '1',
            planPeriodUnit: 'month',
            finalPlanPrice: 1999,
            currency: 'INR',
            mobileNumber: '9876543210',
            abTestKey: { set: 'testAbKey' },
            udf6: 'testUdfAb6',
            udf7: 'testUdfAb7',
            udf8: 'testUdfAb8',
            checkReferer: false,
          }
    ];
    
    // Only set if plans are not already set
    if (availablePlans.length === 0) {
      dispatch(setAvailablePlans(defaultPlans));
    }
  }, [dispatch, availablePlans.length]);

  // Periodic cookie checking while popup is open
  useEffect(() => {
    let hasCalledSuccess = false;

    const checkCookiesPeriodically = () => {
      // Don't check if we've already called success or if we're on plan selection screen
      const currentScreenState = store.getState().loginFlow.currentScreen;
      if (hasCalledSuccess || currentScreenState === 'planSelection') {
        return true;
      }

      const ssoid = getCookie('jsso_crosswalk_tksec_epaperet');
      const currentState = store.getState();
      const isLogged = currentState.jssoAuth.isLogin;
      const loginFlowScreen = currentState.loginFlow.currentScreen;
      const availablePlans = currentState.loginFlow.availablePlans;
      
      // If ssoid exists and user is logged in
      if (flag && ssoid && isLogged && flag) {
        // Don't close if we're showing plan selection or if plans are available
        if (loginFlowScreen === 'planSelection' || availablePlans.length > 0) {
          // Stop checking but don't close popup
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
          return true;
        }
        
        hasCalledSuccess = true;
        
        // Clear the interval
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }

        // Call checkUserIfSubscribed if needed
        checkUserIfSubscribed(dispatch);

        // Small delay before calling success handler
        setTimeout(() => {
          // Double check we're not on plan selection screen
          const finalState = store.getState();
          if (finalState.loginFlow.currentScreen !== 'planSelection' && finalState.loginFlow.availablePlans.length === 0) {
            dispatch(resetLoginFlow());
            
            // Check if we need to continue to pay
            const hasPlan = handleContinueToPayIfNeeded();
            if (!hasPlan) {
              onSuccess?.();
            }
          }
        }, 500);

        return true;
      }
      console.log('aaaaaaa', ssoid, flag);
      // Set flag when ssoid is first detected
      if (!flag && ssoid) {
        checkUserIfSubscribed(dispatch);
        setFlag(true);
      }
      console.log('bbbbbb', ssoid, flag);
      executionCountRef.current += 1;
      return false;
    };

    // Check immediately
    if (checkCookiesPeriodically()) {
      return;
    }

    // Set up interval to check periodically (every 100ms)
    checkIntervalRef.current = setInterval(() => {
      if (checkCookiesPeriodically()) {
        // Success - interval will be cleared in the function
        return;
      }

      // Stop checking after max executions
      if (executionCountRef.current >= MAX_EXECUTIONS) {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      }
    }, 100);

    // Clear interval after 3 seconds to prevent infinite checking
    const timeoutId = setTimeout(() => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      executionCountRef.current = 0;
    }, 3000);

    // Cleanup
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      clearTimeout(timeoutId);
      executionCountRef.current = 0;
    };
  }, [dispatch, onSuccess]);

  // Handle login input submit
  const handleLoginInputSubmit = async () => {
    const error = validateEmailOrMobile(emailOrMobile);
    if (error) {
      dispatch(setEmailOrMobileError(error));
      return;
    }

    dispatch(setEmailOrMobileError(''));
    await dispatch(checkUserExists(emailOrMobile) as unknown as any);
  };

  // Handle set password submit
  const handleSetPasswordSubmit = async () => {
    let hasError = false;

    const nameError = validateName(name);
    if (nameError) {
      dispatch(setNameError(nameError));
      hasError = true;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      dispatch(setPasswordError(passwordError));
      hasError = true;
    }

    if (mobile.trim()) {
      const mobileError = validateMobile(mobile);
      if (mobileError) {
        dispatch(setMobileError(mobileError));
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    const userDetails = {
      dob: '',
      email: isValidEmail(emailOrMobile) ? emailOrMobile : '',
      firstName: name,
      gender: '',
      isSendOffer: false,
      lastName: '',
      mobile: isValidMobile(emailOrMobile) ? emailOrMobile : mobile,
      password: password,
      shareDataAllowed: '1',
      termsAccepted: '1',
      timespointsPolicy: '1',
    };

    const result: any = await dispatch(registerNewUser(userDetails) as unknown as any);
    if (registerNewUser.fulfilled.match(result)) {
      const response = result.payload as { data?: { ssoid?: string } };
      if (response?.data?.ssoid) {
        dispatch(setSsoid(response.data.ssoid));
      }
    }
  };

  // Handle password login
  const handlePasswordLogin = async () => {
    if (!password.trim()) {
      dispatch(setPasswordError('Please enter your password'));
      return;
    }

    dispatch(setPasswordError(''));
    await dispatch(loginWithPassword({ emailOrMobile, password }) as unknown as any);
    // Screen will change to 'success' via reducer if login succeeds
    // continueToPay will be handled by useEffect when screen changes to 'success'
  };

  // Handle login via OTP
  const handleLoginViaOtp = async () => {
    dispatch(setOtpError(''));
    await dispatch(sendLoginOtp(emailOrMobile) as unknown as any);
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    dispatch(setOtpError(''));
    await dispatch(sendForgotPasswordOtp(emailOrMobile) as unknown as any);
  };

  // Handle OTP verify
  const handleVerifyOtp = async () => {
    const error = validateOtp(otp);
    if (error) {
      dispatch(setOtpError(error));
      return;
    }

    dispatch(setOtpError(''));
    const otpString = otp.join('');

    // Check if this is sign-up flow (has registration response)
    const isSignUp = !!registrationResponse;
    
    if (isSignUp) {
      await dispatch(verifySignUpOtp({ emailOrMobile, otp: otpString, ssoid }) as unknown as any);
    } else {
      await dispatch(verifyLoginOtp({ emailOrMobile, otp: otpString }) as unknown as any);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    const isSignUp = !!registrationResponse;
    await dispatch(resendOtp({ emailOrMobile, isSignUp }) as unknown as any);
  };

  // Handle reset password
  const handleResetPassword = async () => {
    let hasError = false;

    const otpError = validateOtp(otp);
    if (otpError) {
      dispatch(setOtpError(otpError));
      hasError = true;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      dispatch(setPasswordError(passwordError));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const otpString = otp.join('');
    await dispatch(resetPassword({ emailOrMobile, otp: otpString, password, confirmPassword: password }) as unknown as any);
  };

  // Check if there's a plan waiting and continue to pay
  const handleContinueToPayIfNeeded = () => {
    try {
      const selectedPlanStr = sessionStorage.getItem('et_plans_selectedPlan');
      if (selectedPlanStr) {
        const selectedPlan: PaymentPlan = JSON.parse(selectedPlanStr);
        // Only continue to pay if checkReferer is not set (meaning user came from payment flow)
        if (!selectedPlan.checkReferer) {
          continueToPay(selectedPlan, dispatch, store.getState);
          return true;
        }
      }
    } catch (e) {
      console.error('Error checking for selected plan:', e);
    }
    return false;
  };

  // Stop cookie checking when on plan selection screen
  useEffect(() => {
    if (currentScreen === 'planSelection') {
      // Stop any cookie checking that might close the popup
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      executionCountRef.current = 0;
    }
  }, [currentScreen]);

  // Handle continue to pay when screen changes to success
  useEffect(() => {
    if (currentScreen === 'success' && !continueToPayCalledRef.current) {
      // Small delay to ensure user info is updated in Redux
      const timeoutId = setTimeout(() => {
        const hasPlan = handleContinueToPayIfNeeded();
        if (hasPlan) {
          continueToPayCalledRef.current = true;
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentScreen]);

  // Handle success continue
  const handleSuccessContinue = () => {
    dispatch(resetLoginFlow());
    continueToPayCalledRef.current = false; // Reset the flag
    
    // Check if we need to continue to pay (in case it wasn't called yet)
    if (!handleContinueToPayIfNeeded()) {
      onSuccess?.();
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentScreen === 'setPassword' || currentScreen === 'passwordLogin') {
      dispatch(setCurrentScreen('loginInput'));
    } else if (currentScreen === 'otpLogin') {
      // Go back to previous screen based on flow
      if (registrationResponse) {
        dispatch(setCurrentScreen('setPassword'));
      } else {
        dispatch(setCurrentScreen('passwordLogin'));
      }
    } else if (currentScreen === 'forgotPasswordReset') {
      dispatch(setCurrentScreen('passwordLogin'));
    }
  };

  // Handle change email
  const handleChangeEmail = () => {
    dispatch(setCurrentScreen('loginInput'));
  };

  // Handle plan selection
  const handlePlanSelect = (plan: PaymentPlan) => {
    continueToPay(plan, dispatch, store.getState);
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'loginInput':
        return (
          <LoginInputScreen
            emailOrMobile={emailOrMobile}
            setEmailOrMobile={(value) => dispatch(setEmailOrMobile(value))}
            error={emailOrMobileError}
            isLoading={isCheckingUser}
            onSubmit={handleLoginInputSubmit}
          />
        );

      case 'setPassword':
        return (
          <SetPasswordScreen
            emailOrMobile={emailOrMobile}
            name={name}
            setName={(value) => dispatch(setName(value))}
            password={password}
            setPassword={(value) => dispatch(setPassword(value))}
            mobile={mobile}
            setMobile={(value) => dispatch(setMobile(value))}
            nameError={nameError}
            passwordError={passwordError}
            mobileError={mobileError}
            isLoading={isLoading}
            onSubmit={handleSetPasswordSubmit}
            onBack={handleBack}
          />
        );

      case 'passwordLogin':
        return (
          <PasswordLoginScreen
            emailOrMobile={emailOrMobile}
            password={password}
            setPassword={(value) => dispatch(setPassword(value))}
            passwordError={passwordError}
            isLoading={isLoading}
            isSendingOtp={isSendingOtp}
            onLogin={handlePasswordLogin}
            onLoginViaOtp={handleLoginViaOtp}
            onForgotPassword={handleForgotPassword}
            onBack={handleBack}
            onChangeEmail={handleChangeEmail}
          />
        );

      case 'otpLogin':
        return (
          <OtpLoginScreen
            emailOrMobile={emailOrMobile}
            otp={otp}
            setOtpValue={(index, value) => dispatch(setOtpValue({ index, value }))}
            otpError={otpError}
            isLoading={isVerifyingOtp}
            isResendingOtp={isResendingOtp}
            isSignUp={!!registrationResponse}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onBack={handleBack}
          />
        );

      case 'forgotPasswordReset':
        return (
          <ForgotPasswordResetScreen
            emailOrMobile={emailOrMobile}
            otp={otp}
            setOtpValue={(index, value) => dispatch(setOtpValue({ index, value }))}
            password={password}
            setPassword={(value) => dispatch(setPassword(value))}
            otpError={otpError}
            passwordError={passwordError}
            isLoading={isLoading}
            isResendingOtp={isResendingOtp}
            onSubmit={handleResetPassword}
            onResend={handleResendOtp}
            onBack={handleBack}
          />
        );

      case 'success':
        return <SuccessScreen onContinue={handleSuccessContinue} />;

      case 'planSelection':
        return (
          <PlanSelectionScreen
            plans={availablePlans}
            onPlanSelect={handlePlanSelect}
            isLoading={isLoading}
          />
        );

      default:
        return null;
    }
  };

  // If embedded, render without modal wrapper
  if (embedded) {
    return (
      <div className="w-full">
        {renderScreen()}
      </div>
    );
  }

  // Standalone modal version
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        )}
        {renderScreen()}
      </div>
    </div>
  );
};

