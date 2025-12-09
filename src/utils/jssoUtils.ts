import { store } from '../store';
import { AppDispatch } from '../store';
import { getCookie } from './cookieUtils';
// Note: ET Login specific actions removed from jssoAuthSlice
// These actions are now handled in loginFlowSlice or commented out
// import {
//   setUserToken,
//   setUserProductDetails,
// } from '../store/slices/jssoAuthSlice';

// ET Login Action Types
export const ET_LOGIN_ACTIONS = {
  SET_EMAIL_INPUT: 'SET_EMAIL_INPUT',
  SET_PASSWORD_INPUT: 'SET_PASSWORD_INPUT',
  SET_EMAIL: 'SET_EMAIL',
  SET_PASSWORD: 'SET_PASSWORD',
  SET_EMAIL_ERROR: 'SET_EMAIL_ERROR',
  SET_PASSWORD_ERROR: 'SET_PASSWORD_ERROR',
  SET_LOADING: 'SET_LOADING',
  SET_LOGIN_SUCCESS: 'SET_LOGIN_SUCCESS',
  SET_LOGIN_ERROR: 'SET_LOGIN_ERROR',
  RESET_FORM: 'RESET_FORM',
  SET_SHOW_EMAIL_INPUT: 'SET_SHOW_EMAIL_INPUT',
  SET_SHOW_PASSWORD_INPUT: 'SET_SHOW_PASSWORD_INPUT',
  SET_USER_EXISTENCE_RESPONSE: 'SET_USER_EXISTENCE_RESPONSE',
  SET_OTP_SENT: 'SET_OTP_SENT',
  SET_SSOID: 'SET_SSOID',
  SET_INTERACTION_TYPE: 'SET_INTERACTION_TYPE',
  SET_USER_REGISTRATION_RESPONSE: 'SET_USER_REGISTRATION_RESPONSE',
  SET_VERIFY_OTP_RESPONSE: 'SET_VERIFY_OTP_RESPONSE',
  SET_LOGIN_VERIFICATION_RESPONSE: 'SET_LOGIN_VERIFICATION_RESPONSE',
  SET_USER_TOKEN: 'SET_USER_TOKEN',
  SET_USER_PRODUCT_DETAILS: 'SET_USER_PRODUCT_DETAILS',
  SET_LOGIN_OTP_SENT: 'SET_LOGIN_OTP_SENT',
  SET_FORGOT_PASSWORD_OTP_SENT: 'SET_FORGOT_PASSWORD_OTP_SENT',
  SET_IS_LOGIN_FROM_APPLE_CONTINUE_TO_PAY: 'SET_IS_LOGIN_FROM_APPLE_CONTINUE_TO_PAY',
  SET_IS_SIGNUP_FLOW: 'SET_IS_SIGNUP_FLOW',
} as const;

// ET Login Action Types
export type ETLoginActionType = (typeof ET_LOGIN_ACTIONS)[keyof typeof ET_LOGIN_ACTIONS];

// ET Login Action Interfaces
export interface ETLoginAction {
  type: ETLoginActionType;
  payload?: any;
}

// ET Login State Interface
export interface ETLoginState {
  showEmailInput: boolean;
  showPasswordInput: boolean;
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  loading: boolean;
  loginSuccess: boolean;
  loginError: string | null;
  userExistenceResponse: any;
  isOtpSent: boolean;
  ssoid: string;
  interactionType: string;
  userRegistrationResponse: any;
  verifyOtpResponse: any;
  loginVerificationResponse: any;
  userToken: string;
  userProductDetails: any;
  isLoginOtpSent: boolean;
  isForgotPasswordOtpSent: boolean;
  isLoginFromAppleContinueToPay: boolean;
  isSignUpFlow: boolean;
}

// Action Creators
export const setUserExistenceResponseAction = (response: any) => ({
  type: ET_LOGIN_ACTIONS.SET_USER_EXISTENCE_RESPONSE,
  payload: response,
});

export const setOtpSentAction = (isSent: boolean) => ({
  type: ET_LOGIN_ACTIONS.SET_OTP_SENT,
  payload: isSent,
});

export const setSsoidAction = (ssoid: string) => ({
  type: ET_LOGIN_ACTIONS.SET_SSOID,
  payload: ssoid,
});

export const setInteractionTypeAction = (type: string) => ({
  type: ET_LOGIN_ACTIONS.SET_INTERACTION_TYPE,
  payload: type,
});

export const setUserRegistrationResponseAction = (response: any) => ({
  type: ET_LOGIN_ACTIONS.SET_USER_REGISTRATION_RESPONSE,
  payload: response,
});

export const setVerifyOtpResponseAction = (response: any) => ({
  type: ET_LOGIN_ACTIONS.SET_VERIFY_OTP_RESPONSE,
  payload: response,
});

export const setLoginVerificationResponseAction = (response: any) => ({
  type: ET_LOGIN_ACTIONS.SET_LOGIN_VERIFICATION_RESPONSE,
  payload: response,
});

export const setUserTokenAction = (token: string) => ({
  type: ET_LOGIN_ACTIONS.SET_USER_TOKEN,
  payload: token,
});

export const setUserProductDetailsAction = (productDetails: any) => ({
  type: ET_LOGIN_ACTIONS.SET_USER_PRODUCT_DETAILS,
  payload: productDetails,
});

export const setLoginOtpSentAction = (isSent: boolean) => ({
  type: ET_LOGIN_ACTIONS.SET_LOGIN_OTP_SENT,
  payload: isSent,
});

export const setForgotPasswordOtpSentAction = (isSent: boolean) => ({
  type: ET_LOGIN_ACTIONS.SET_FORGOT_PASSWORD_OTP_SENT,
  payload: isSent,
});

export const setIsLoginFromAppleContinueToPayAction = (value: boolean) => ({
  type: ET_LOGIN_ACTIONS.SET_IS_LOGIN_FROM_APPLE_CONTINUE_TO_PAY,
  payload: value,
});

export const setIsSignUpFlowAction = (isSignUp: boolean) => ({
  type: ET_LOGIN_ACTIONS.SET_IS_SIGNUP_FLOW,
  payload: isSignUp,
});

/**
 * Check if JssoCrosswalk class is available
 */
const isJssoClassAvailable = (): boolean => {
  // @ts-ignore - JssoCrosswalk is loaded dynamically
  return typeof JssoCrosswalk !== 'undefined';
};

/**
 * Get or create JSSO instance
 */
const getJssoInstance = (channelMerchant?: string, channelPlatform?: string): any => {
  if (!isJssoClassAvailable()) {
    console.error({ error: 'JssoCrosswalk class is not available' });
    return null;
  }

  const state = store.getState();
  const jssoAuth = state.jssoAuth;
  const config = state.config;

  const merchant = channelMerchant || jssoAuth.channelMerchant || config.channelType || 'ET';
  const platform = channelPlatform || jssoAuth.channelPlatform || (window as any).planparams?.platform || '';

  try {
    // @ts-ignore
    return new JssoCrosswalk(merchant, platform);
  } catch (error) {
    console.error({ error: 'Failed to create JssoCrosswalk instance', details: error });
    return null;
  }
};

/**
 * Check if JSSO instance or class is available
 */
export const isJssoAvailable = (): boolean => {
  return isJssoClassAvailable();
};

// Function to check if user exists and handle the response
export const checkIfUserExists = (input: string, dispatch: AppDispatch) => {
  return new Promise((resolve, reject) => {
    const jsso = getJssoInstance();
    if (!jsso) {
      console.error({ error: 'JssoCrosswalk instance is not available' });
      return;
    }

    // Check if checkUserExists method exists
    if (typeof jsso.checkUserExists !== 'function') {
      console.error({ error: 'checkUserExists method is not available' });
      return;
    }

    try {
      jsso.checkUserExists(input, (res: any) => {
        // Store the response in Redux state
        // Note: setUserExistenceResponse removed from jssoAuthSlice - ET Login specific state
        // dispatch(setUserExistenceResponse(res));

        // Handle API failure
        if (!res || res.error || res.status === 'ERROR') {
          return;
        }

        // Resolve with the response for further handling
        resolve(res);
      });
    } catch (error) {
      console.error({ error: 'API call failed', details: error });
    }
  });
};

// User registration details interface
export interface UserRegistrationDetails {
  dob: string;
  email: string;
  firstName: string;
  gender: string;
  isSendOffer: boolean;
  lastName: string;
  mobile: string;
  password: string;
  shareDataAllowed: string;
  termsAccepted: string;
  timespointsPolicy: string;
}

// Function to register user and store response in Redux state
export const registerUser = (userDetails: UserRegistrationDetails, dispatch: AppDispatch) => {
  return new Promise((resolve, reject) => {
    const {
      dob,
      email,
      firstName,
      gender,
      isSendOffer,
      lastName,
      mobile,
      password,
      shareDataAllowed,
      termsAccepted,
      timespointsPolicy,
    } = userDetails;

    const jsso = getJssoInstance();
    if (!jsso) {
      console.error({ error: 'JssoCrosswalk instance is not available' });
      return;
    }

    if (typeof jsso.registerUser !== 'function') {
      console.error({ error: 'registerUser method is not available' });
      return;
    }

    try {
      // Call the registerUser API with the original signature
      jsso.registerUser(
        firstName || 'User', // userType
        null, // firstName
        null, // lastName
        null, // dob
        email, // email
        mobile, // mobile
        password, // password
        'false', // isSendOffer
        '1', // shareDataAllowed
        '1', // termsAccepted
        '1', // timespointsPolicy
        (registerRes: any) => {
          // Store the registration response in Redux state
          // Note: setUserRegistrationResponse removed from jssoAuthSlice - ET Login specific state
          // dispatch(setUserRegistrationResponse(registerRes));

          // Handle API failure
          if (!registerRes || registerRes.error || registerRes.status === 'ERROR') {
            console.error(registerRes || { error: 'Registration failed' });
            return;
          }

          // Handle successful registration
          if (registerRes.status === 'SUCCESS') {
            // Set SSO ID in Redux state
            // Note: setSsoid is in loginFlowSlice, not jssoAuthSlice
            // dispatch(setSsoid(registerRes.data?.ssoid || ''));

            // Set SSO ID in global objects
            if ((window as any).planparams) {
              (window as any).planparams.ssoid = registerRes.data?.ssoid;
            }
          }

          // Resolve with the response for further handling
          resolve(registerRes);
        }
      );
    } catch (error) {
      console.error({ error: 'API call failed', details: error });
    }
  });
};

// Function to verify sign up OTP
export const verifySignUpOTP = (emailOrMobile: string, otp: string, ssoid: string, dispatch: AppDispatch) => {
  return new Promise((resolve, reject) => {
    // Determine if input is email or mobile
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);

    // Create payload based on input type
    const payload = isEmail ? { email: emailOrMobile, otp, ssoid } : { mobile: emailOrMobile, otp, ssoid };

    const jsso = getJssoInstance();
    if (!jsso) {
      console.error({ error: 'JssoCrosswalk instance is not available' });
      return;
    }

    // Check if at least one verification method is available
    if (typeof jsso.verifyEmailSignUp !== 'function' && typeof jsso.verifyMobileSignUp !== 'function') {
      console.error({ error: 'Verification methods are not available' });
      return;
    }

    try {
      // Call the appropriate API based on input type
      if (isEmail) {
        if (typeof jsso.verifyEmailSignUp !== 'function') {
          console.error({ error: 'verifyEmailSignUp method is not available' });
          return;
        }

        jsso.verifyEmailSignUp(payload.email, payload.ssoid, payload.otp, (verifyRes: any) => {
          // Store the verification response in Redux state
          // Note: setVerifyOtpResponse removed from jssoAuthSlice - ET Login specific state
          // dispatch(setVerifyOtpResponse(verifyRes));

          // Handle API failure
          if (!verifyRes || verifyRes.error || verifyRes.status === 'ERROR') {
            console.error(verifyRes || { error: 'Email OTP verification failed' });
            return;
          }

          // Resolve with the response for further handling
          resolve(verifyRes);
        });
      } else {
        if (typeof jsso.verifyMobileSignUp !== 'function') {
          console.error({ error: 'verifyMobileSignUp method is not available' });
          return;
        }

        jsso.verifyMobileSignUp(payload.mobile, payload.ssoid, payload.otp, (verifyRes: any) => {
          // Store the verification response in Redux state
          // Note: setVerifyOtpResponse removed from jssoAuthSlice - ET Login specific state
          // dispatch(setVerifyOtpResponse(verifyRes));

          // Handle API failure
          if (!verifyRes || verifyRes.error || verifyRes.status === 'ERROR') {
            console.error(verifyRes || { error: 'Mobile OTP verification failed' });
            return;
          }

          // Resolve with the response for further handling
          resolve(verifyRes);
        });
      }
    } catch (error) {
      console.error({ error: 'API call failed', details: error });
    }
  });
};

export const verifyLoginOTP = (emailOrMobile: string, otp: string, dispatch: AppDispatch) => {
  return new Promise((resolve, reject) => {
    // Determine if input is email or mobile
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);

    // Create payload based on input type
    const payload = isEmail ? { email: emailOrMobile, otp } : { mobile: emailOrMobile, otp };

    const jsso = getJssoInstance();
    if (!jsso) {
      console.error({ error: 'JssoCrosswalk instance is not available' });
      return;
    }

    // Check if at least one verification method is available
    if (typeof jsso.verifyEmailLogin !== 'function' && typeof jsso.verifyMobileLogin !== 'function') {
      console.error({ error: 'Verification methods are not available' });
      return;
    }

    try {
      // Call the appropriate API based on input type
      if (isEmail) {
        if (typeof jsso.verifyEmailLogin !== 'function') {
          console.error({ error: 'verifyEmailLogin method is not available' });
          return;
        }

        jsso.verifyEmailLogin(payload.email, payload.otp, (verifyRes: any) => {
          // Store the verification response in Redux state
          // Note: setVerifyOtpResponse removed from jssoAuthSlice - ET Login specific state
          // dispatch(setVerifyOtpResponse(verifyRes));

          // Handle API failure
          if (!verifyRes || verifyRes.error || verifyRes.status === 'ERROR') {
            console.error(verifyRes || { error: 'Email OTP verification failed' });
            return;
          }

          // Resolve with the response for further handling
          resolve(verifyRes);
        });
      } else {
        if (typeof jsso.verifyMobileLogin !== 'function') {
          console.error({ error: 'verifyMobileLogin method is not available' });
          return;
        }

        jsso.verifyMobileLogin(payload.mobile, payload.otp, (verifyRes: any) => {
          // Store the verification response in Redux state
          // Note: setVerifyOtpResponse removed from jssoAuthSlice - ET Login specific state
          // dispatch(setVerifyOtpResponse(verifyRes));

          // Handle API failure
          if (!verifyRes || verifyRes.error || verifyRes.status === 'ERROR') {
            console.error(verifyRes || { error: 'Mobile OTP verification failed' });
            return;
          }

          // Resolve with the response for further handling
          resolve(verifyRes);
        });
      }
    } catch (error) {
      console.error({ error: 'API call failed', details: error });
    }
  });
};

// Function to verify login with email or mobile
export const verifyLoginGdpr = (input: string, password: string, dispatch: AppDispatch) => {
  return new Promise((resolve, reject) => {
    // Check if input is email or mobile
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const isMobile = /^[6-9]\d{9}$/.test(input);

    if (!isEmail && !isMobile) {
      console.error({ error: 'Invalid input format. Please provide a valid email or mobile number.' });
      return;
    }

    const jsso = getJssoInstance();
    if (!jsso) {
      console.error({ error: 'JssoCrosswalk instance is not available' });
      return;
    }

    try {
      if (isEmail) {
        // Call verifyEmailLoginGdpr for email
        if (typeof jsso.verifyEmailLoginGdpr !== 'function') {
          console.error({ error: 'verifyEmailLoginGdpr method is not available' });
          return;
        }

        const payload = {
          email: input,
          password: password,
          shareDataAllowed: '1',
          termsAccepted: '1',
          timespointsPolicy: '1',
        };

        jsso.verifyEmailLoginGdpr(
          payload.email,
          payload.password,
          payload.shareDataAllowed,
          payload.termsAccepted,
          payload.timespointsPolicy,
          (response: any) => {
            // Store the response in Redux state
            // Note: setLoginVerificationResponse removed from jssoAuthSlice - ET Login specific state
            // dispatch(setLoginVerificationResponse(response));

            // Handle API failure
            if (!response || response.error || response.status === 'ERROR') {
              console.error(response || { error: 'Email login verification failed' });
              return;
            }

            // Resolve with the response for further handling
            resolve(response);
          }
        );
      } else {
        // Call verifyMobileLoginGdpr for mobile
        if (typeof jsso.verifyMobileLoginGdpr !== 'function') {
          console.error({ error: 'verifyMobileLoginGdpr method is not available' });
          return;
        }

        const payload = {
          mobile: input,
          password: password,
          shareDataAllowed: '1',
          termsAccepted: '1',
          timespointsPolicy: '1',
        };

        jsso.verifyMobileLoginGdpr(
          payload.mobile,
          payload.password,
          payload.shareDataAllowed,
          payload.termsAccepted,
          payload.timespointsPolicy,
          (response: any) => {
            // Store the response in Redux state
            // Note: setLoginVerificationResponse removed from jssoAuthSlice - ET Login specific state
            // dispatch(setLoginVerificationResponse(response));

            // Handle API failure
            if (!response || response.error || response.status === 'ERROR') {
              console.error(response || { error: 'Mobile login verification failed' });
              return;
            }

            // Resolve with the response for further handling
            resolve(response);
          }
        );
      }
    } catch (error) {
      console.error({ error: 'API call failed', details: error });
    }
  });
};

// Import jssoService at top level - the service itself handles lazy initialization
import { jssoService } from '../services/jssoService';

// Get user details - uses Redux instead of window objects
export const getUserDetailOpt = async (callback?: (response?: any) => void): Promise<void> => {
  try {
    await jssoService.getUserDetailOpt();
    if (callback) {
      const state = store.getState();
      callback({ status: 'SUCCESS', data: state.jssoAuth.userInfo });
    }
  } catch (error) {
    console.error('[jssoUtils] Error in getUserDetailOpt:', error);
    if (callback) {
      callback({ status: 'ERROR', error });
    }
    throw error;
  }
};

// Get user details with forced update - uses Redux instead of window objects
export const getUserDetailOptForced = async (callback?: (response?: any) => void): Promise<void> => {
  try {
    await jssoService.getUserDetailOptForced(callback);
  } catch (error) {
    console.error('[jssoUtils] Error in getUserDetailOptForced:', error);
    if (callback) {
      callback({ status: 'ERROR', error });
    }
    throw error;
  }
};

export const getUserDetailsForETLogin = async (dispatch: AppDispatch): Promise<void> => {
  try {
    await getUserDetailOptForced();
  } catch (error) {
    console.error('[jssoUtils] Error in getUserDetailsForETLogin:', error);
    throw error;
  }
};

export const checkUserIfSubscribed = async (dispatch: AppDispatch) => {
  try {
    await getUserDetailOptForced(callCheckUserTokenSubscription);
  } catch (error) {
    console.error('[jssoUtils] Error in checkUserIfSubscribed:', error);
  }
};

// Check if user is logged in on app load based on cookies
export const checkInitialLoginStatus = async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const ssoid = getCookie('jsso_crosswalk_tksec_epaperet') || getCookie('ssoid');
    const ticketId = getCookie('TicketId');
    
    
    // If we have cookies, user might be logged in
    if (ssoid || ticketId) {
      // Get user details to verify and set Redux state
      try {
        await getUserDetailOptForced(async () => {
          // After getting user details, check permissions
          await callCheckUserTokenSubscription();
        });
        
        // Check Redux state to confirm login
        const state = store.getState();
        const isLoggedIn = state.jssoAuth.isLogin;
        return isLoggedIn;
      } catch (error) {
        console.error('[jssoUtils] Error checking initial login status:', error);
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error('[jssoUtils] Error in checkInitialLoginStatus:', error);
    return false;
  }
};

const callCheckUserTokenSubscription = async () => {
  try {
    // Use jssoService instead of calling on JSSO instance
    // Pass callback to handle the response
    await jssoService.getPermissionsOpt((res: any) => {
      // Dispatch events after permissions are fetched
      const checkOTRLoaded = new Event('checkOTRLoaded');
      document.dispatchEvent(checkOTRLoaded);
      
      // Note: objUser.AllAjaxHandler is not available in Redux implementation
      // Dispatch a custom event instead if needed
      document.dispatchEvent(new CustomEvent('permissionsSuccess', { detail: res }));
    });
  } catch (error) {
    console.error('[jssoUtils] Error in callCheckUserTokenSubscription:', error);
  }
};

// Function to get OTP for login (email or mobile)
export const getLoginOtp = (input: string, dispatch: AppDispatch) => {
  return new Promise((resolve, reject) => {
    // Check if input is email or mobile
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const isMobile = /^[6-9]\d{9}$/.test(input);

    const jsso = getJssoInstance();
    if (!jsso) {
      console.error({ error: 'JssoCrosswalk instance is not available' });
      return;
    }

    try {
      if (isMobile) {
        // Call getMobileLoginOtp for mobile
        if (typeof jsso.getMobileLoginOtp !== 'function') {
          console.error({ error: 'getMobileLoginOtp method is not available' });
          return;
        }

        jsso.getMobileLoginOtp(input, (response: any) => {
          // Store the OTP sent status in Redux state
          // Note: setLoginOtpSent removed from jssoAuthSlice - ET Login specific state
          // dispatch(setLoginOtpSent(true));
          // Handle API failure
          if (!response || response.error || response.status === 'ERROR') {
            console.error(response || { error: 'Mobile OTP sending failed' });
            return;
          }
          resolve(response);
        });
      } else if (isEmail) {
        // Call getEmailLoginOtp for email
        if (typeof jsso.getEmailLoginOtp !== 'function') {
          console.error({ error: 'getEmailLoginOtp method is not available' });
          return;
        }

        jsso.getEmailLoginOtp(input, (response: any) => {
          // Store the OTP sent status in Redux state
          // Note: setLoginOtpSent removed from jssoAuthSlice - ET Login specific state
          // dispatch(setLoginOtpSent(true));
          // Handle API failure
          if (!response || response.error || response.status === 'ERROR') {
            console.error(response || { error: 'Email OTP sending failed' });
            return;
          }
          // Resolve with the response for further handling
          resolve(response);
        });
      } else {
        console.error({ error: 'Invalid input format. Please provide a valid email or mobile number.' });
        return;
      }
    } catch (error) {
      console.error({ error: 'API call failed', details: error });
    }
  });
};

// Function to get OTP for forgot password (email or mobile)
export const getForgotPasswordOtp = (input: string, dispatch: AppDispatch) => {
  return new Promise((resolve, reject) => {
    // Check if input is email or mobile
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const isMobile = /^[6-9]\d{9}$/.test(input);

    const jsso = getJssoInstance();
    if (!jsso) {
      console.error({ error: 'JssoCrosswalk instance is not available' });
      return;
    }

    try {
      if (isMobile) {
        // Call getMobileForgotPasswordOtp for mobile
        if (typeof jsso.getMobileForgotPasswordOtp !== 'function') {
          console.error({ error: 'getMobileForgotPasswordOtp method is not available' });
          return;
        }

        jsso.getMobileForgotPasswordOtp(input, (response: any) => {
          // Store the OTP sent status in Redux state
          // Note: setForgotPasswordOtpSent removed from jssoAuthSlice - ET Login specific state
          // dispatch(setForgotPasswordOtpSent(true));
          // Handle API failure
          if (!response || response.error || response.status === 'ERROR') {
            console.error(response || { error: 'Mobile forgot password OTP sending failed' });
            return;
          }
          resolve(response);
        });
      } else if (isEmail) {
        // Call getEmailForgotPasswordOtp for email
        if (typeof jsso.getEmailForgotPasswordOtp !== 'function') {
          console.error({ error: 'getEmailForgotPasswordOtp method is not available' });
          return;
        }

        jsso.getEmailForgotPasswordOtp(input, (response: any) => {
          // Store the OTP sent status in Redux state
          // Note: setForgotPasswordOtpSent removed from jssoAuthSlice - ET Login specific state
          // dispatch(setForgotPasswordOtpSent(true));
          // Handle API failure
          if (!response || response.error || response.status === 'ERROR') {
            console.error(response || { error: 'Email forgot password OTP sending failed' });
            return;
          }
          // Resolve with the response for further handling
          resolve(response);
        });
      } else {
        console.error({ error: 'Invalid input format. Please provide a valid email or mobile number.' });
        return;
      }
    } catch (error) {
      console.error({ error: 'API call failed', details: error });
    }
  });
};

// Function to verify forgot password OTP (email or mobile)
export const verifyForgotPassword = (
  input: string,
  otp: string,
  password: string,
  confirmPassword: string,
  dispatch: AppDispatch
) => {
  return new Promise((resolve, reject) => {
    // Check if input is email or mobile
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const isMobile = /^[6-9]\d{9}$/.test(input);

    if (!isEmail && !isMobile) {
      console.error({ error: 'Invalid input format. Please provide a valid email or mobile number.' });
      return;
    }

    const jsso = getJssoInstance();
    if (!jsso) {
      console.error({ error: 'JssoCrosswalk instance is not available' });
      return;
    }

    // Check if at least one verification method is available
    if (typeof jsso.verifyEmailForgotPassword !== 'function' && typeof jsso.verifyMobileForgotPassword !== 'function') {
      console.error({ error: 'Forgot password verification methods are not available' });
      return;
    }

    try {
      // Call the appropriate API based on input type
      if (isEmail) {
        if (typeof jsso.verifyEmailForgotPassword !== 'function') {
          console.error({ error: 'verifyEmailForgotPassword method is not available' });
          return;
        }

        jsso.verifyEmailForgotPassword(input, otp, password, confirmPassword, (response: any) => {
          // Store the verification response in Redux state
          // Note: setVerifyOtpResponse removed from jssoAuthSlice - ET Login specific state
          // dispatch(setVerifyOtpResponse(response));

          // Handle API failure
          if (!response || response.error || response.status === 'ERROR') {
            console.error(response || { error: 'Email forgot password OTP verification failed' });
            return;
          }

          // Resolve with the response for further handling
          resolve(response);
        });
      } else {
        if (typeof jsso.verifyMobileForgotPassword !== 'function') {
          console.error({ error: 'verifyMobileForgotPassword method is not available' });
          return;
        }

        jsso.verifyMobileForgotPassword(input, otp, password, confirmPassword, (response: any) => {
          // Store the verification response in Redux state
          // Note: setVerifyOtpResponse removed from jssoAuthSlice - ET Login specific state
          // dispatch(setVerifyOtpResponse(response));

          // Handle API failure
          if (!response || response.error || response.status === 'ERROR') {
            console.error(response || { error: 'Mobile forgot password OTP verification failed' });
            return;
          }

          // Resolve with the response for further handling
          resolve(response);
        });
      }
    } catch (error) {
      console.error({ error: 'API call failed', details: error });
    }
  });
};

// Function to resend sign up OTP (email or mobile)
export const resendSignUpOtp = (input: string, dispatch: AppDispatch) => {
  return new Promise((resolve, reject) => {
    // Check if input is email or mobile
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const isMobile = /^[6-9]\d{9}$/.test(input);

    if (!isEmail && !isMobile) {
      console.error({ error: 'Invalid input format. Please provide a valid email or mobile number.' });
      return;
    }

    const jsso = getJssoInstance();
    if (!jsso) {
      console.error({ error: 'JssoCrosswalk instance is not available' });
      return;
    }

    // Check if at least one resend method is available
    if (typeof jsso.resendEmailSignUpOtp !== 'function' && typeof jsso.resendMobileSignUpOtp !== 'function') {
      console.error({ error: 'Sign up OTP resend methods are not available' });
      return;
    }

    try {
      // Call the appropriate API based on input type
      if (isEmail) {
        if (typeof jsso.resendEmailSignUpOtp !== 'function') {
          console.error({ error: 'resendEmailSignUpOtp method is not available' });
          return;
        }

        jsso.resendEmailSignUpOtp(input, (response: any) => {
          // Store the OTP sent status in Redux state
          // Note: setOtpSent removed from jssoAuthSlice - ET Login specific state
          // dispatch(setOtpSent(true));

          // Handle API failure
          if (!response || response.error || response.status === 'ERROR') {
            console.error(response || { error: 'Email sign up OTP resend failed' });
            return;
          }

          // Resolve with the response for further handling
          resolve(response);
        });
      } else {
        if (typeof jsso.resendMobileSignUpOtp !== 'function') {
          console.error({ error: 'resendMobileSignUpOtp method is not available' });
          return;
        }

        jsso.resendMobileSignUpOtp(input, (response: any) => {
          // Store the OTP sent status in Redux state
          // Note: setOtpSent removed from jssoAuthSlice - ET Login specific state
          // dispatch(setOtpSent(true));

          // Handle API failure
          if (!response || response.error || response.status === 'ERROR') {
            console.error(response || { error: 'Mobile sign up OTP resend failed' });
            return;
          }

          // Resolve with the response for further handling
          resolve(response);
        });
      }
    } catch (error) {
      console.error({ error: 'API call failed', details: error });
    }
  });
};

// Function to call gisLogin API
export const gisLogin = async (clientId: string, credential: string, select_by: string, dispatch: AppDispatch) => {
  const jsso = getJssoInstance();
  if (!jsso) {
    const error = { error: 'JssoCrosswalk instance is not available' };
    console.error(error);
    return error;
  }

  if (typeof jsso.GisLogin !== 'function') {
    const error = { error: 'GisLogin method is not available' };
    console.error(error);
    return error;
  }

  try {
    const response = await new Promise((resolve, reject) => {
      // Check how GisLogin is implemented — some APIs return (success, error) callbacks
      jsso.GisLogin(
        clientId,
        credential,
        select_by,
        (data: any) => resolve(data), // success callback
        (err: any) => reject(err) // error callback (if provided)
      );
    });

    return response;
  } catch (res) {
    console.error('GIS Login failed:', res);
    return res;
  }
};

// Function to call Apple Login API
export const appleLogin = (code: any, dispatch: AppDispatch) => {
  const jsso = getJssoInstance();
  if (!jsso) {
    const error = { error: 'JssoCrosswalk instance is not available' };
    console.error(error);
    return error;
  }

  if (typeof jsso.appleLogin !== 'function') {
    const error = { error: 'appleLogin method is not available' };
    console.error(error);
    return error;
  }

  try {
    // Call the Apple Login API (assuming similar structure to GIS login)
    const response = jsso.appleLogin(code);
    return response;
  } catch (error) {
    const errorObj = { error: 'Apple login API call failed', details: error };
    console.error(errorObj);
    return errorObj;
  }
};

export const trackCall = (eventName: string, data: any) => {
  if ((window as any).objAnalytics?.fireTrackingEvent) {
    if (eventName === 'event') {
      (window as any).objAnalytics.fireTrackingEvent(eventName, data, 'ga4', 0);
    } else {
      (window as any).objAnalytics.fireTrackingEvent(eventName, data, 'full', 1, eventName);
    }
  }
};

let throttleTimeout: NodeJS.Timeout | null = null;

export const throwAnalyticsEvent = (eventName: string, data: Record<string, any>, limit = 1000) => {
  if (!throttleTimeout) {
    trackCall(eventName, data);

    throttleTimeout = setTimeout(() => {
      throttleTimeout = null;
    }, limit);
  }
};

export const throttledFunction = (func: any, limit: number) => {
  let inThrottle: boolean;
  return (...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

