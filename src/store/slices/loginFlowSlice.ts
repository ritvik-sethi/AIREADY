import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  checkIfUserExists,
  registerUser,
  verifySignUpOTP,
  verifyLoginGdpr,
  getLoginOtp,
  getForgotPasswordOtp,
  verifyForgotPassword,
  resendSignUpOtp,
  verifyLoginOTP,
  UserRegistrationDetails,
} from '../../utils/jssoUtils';
import { AppDispatch } from '../index';
import { setUserInfo, getUserDetails } from './jssoAuthSlice';
import { store } from '../index';

export type LoginScreen = 
  | 'loginInput' 
  | 'setPassword' 
  | 'passwordLogin' 
  | 'otpLogin' 
  | 'forgotPasswordReset' 
  | 'success'
  | 'planSelection';

export interface LoginFlowState {
  // Current screen
  currentScreen: LoginScreen;
  
  // User input
  emailOrMobile: string;
  password: string;
  name: string;
  mobile: string;
  
  // OTP
  otp: string[];
  
  // User status
  userStatus: 'unknown' | 'unregistered' | 'unverified' | 'verified';
  ssoid: string;
  
  // Loading states
  isLoading: boolean;
  isCheckingUser: boolean;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  isResendingOtp: boolean;
  
  // Error states
  emailOrMobileError: string;
  passwordError: string;
  nameError: string;
  mobileError: string;
  otpError: string;
  
  // API responses
  userExistenceResponse: any;
  registrationResponse: any;
  otpResponse: any;
  loginResponse: any;
  
  // Plans for selection
  availablePlans: any[];
}

const initialState: LoginFlowState = {
  currentScreen: 'loginInput',
  emailOrMobile: '',
  password: '',
  name: '',
  mobile: '',
  otp: ['', '', '', '', '', ''],
  userStatus: 'unknown',
  ssoid: '',
  isLoading: false,
  isCheckingUser: false,
  isSendingOtp: false,
  isVerifyingOtp: false,
  isResendingOtp: false,
  emailOrMobileError: '',
  passwordError: '',
  nameError: '',
  mobileError: '',
  otpError: '',
  userExistenceResponse: null,
  registrationResponse: null,
  otpResponse: null,
  loginResponse: null,
  availablePlans: [],
};

// Async thunks
export const checkUserExists = createAsyncThunk(
  'loginFlow/checkUserExists',
  async (emailOrMobile: string, { dispatch }) => {
    const response = await checkIfUserExists(emailOrMobile, dispatch as AppDispatch);
    return response;
  }
);

export const registerNewUser = createAsyncThunk(
  'loginFlow/registerUser',
  async (userDetails: UserRegistrationDetails, { dispatch }) => {
    const response = await registerUser(userDetails, dispatch as AppDispatch);
    return response;
  }
);

export const verifySignUpOtp = createAsyncThunk(
  'loginFlow/verifySignUpOtp',
  async (
    { emailOrMobile, otp, ssoid }: { emailOrMobile: string; otp: string; ssoid: string },
    { dispatch }
  ) => {
    const response: any = await verifySignUpOTP(emailOrMobile, otp, ssoid, dispatch as AppDispatch);
    
    // If verification successful, fetch user details
    if (response && (response.code === 200 || response.status === 'SUCCESS')) {
      
      // Get config from store
      const state = store.getState();
      const config = state.config;
      const jssoAuth = state.jssoAuth;
      
      try {
        // Fetch user details
        const userDetailsResult = await dispatch(
          getUserDetails({
            channelMerchant: jssoAuth.channelMerchant || config.channelType,
            channelPlatform: jssoAuth.channelPlatform || '',
          })
        ).unwrap();
        
        
        // User info is automatically set in jssoAuthSlice reducer
      } catch (error) {
        console.error('[Login Flow] Failed to fetch user details:', error);
        // Fallback: try to extract from response
        const userData = response?.data || response?.response?.data || response;
        if (userData) {
          const userInfo = {
            ssoid: userData.ssoid || userData.data?.ssoid || ssoid,
            primaryEmail: userData.primaryEmail || userData.emailId || userData.email,
            emailId: userData.emailId || userData.email,
            firstName: userData.firstName || userData.first_name,
            full_name: userData.full_name || userData.fullName,
            loginId: userData.loginId || userData.mobile,
            ticketId: userData.ticketId,
            identifier: userData.identifier,
            isLogged: true,
            emailList: userData.emailList,
            mobileList: userData.mobileList,
          };
          dispatch(setUserInfo(userInfo));
        }
      }
    }
    
    return response;
  }
);

export const loginWithPassword = createAsyncThunk(
  'loginFlow/loginWithPassword',
  async ({ emailOrMobile, password }: { emailOrMobile: string; password: string }, { dispatch }) => {
    const response: any = await verifyLoginGdpr(emailOrMobile, password, dispatch as AppDispatch);
    
    // If login successful, fetch user details
    if (response && (response.code === 200 || response.status === 'SUCCESS')) {
      
      // Get config from store
      const state = store.getState();
      const config = state.config;
      const jssoAuth = state.jssoAuth;
      
      try {
        // Fetch user details
        const userDetailsResult = await dispatch(
          getUserDetails({
            channelMerchant: jssoAuth.channelMerchant || config.channelType,
            channelPlatform: jssoAuth.channelPlatform || '',
          })
        ).unwrap();
        
        
        // User info is automatically set in jssoAuthSlice reducer
      } catch (error) {
        console.error('[Login Flow] Failed to fetch user details:', error);
        // Fallback: try to extract from login response
        const userData = response?.data || response?.response?.data || response;
        if (userData) {
          const userInfo = {
            ssoid: userData.ssoid || userData.data?.ssoid,
            primaryEmail: userData.primaryEmail || userData.emailId || userData.email,
            emailId: userData.emailId || userData.email,
            firstName: userData.firstName || userData.first_name,
            full_name: userData.full_name || userData.fullName,
            loginId: userData.loginId || userData.mobile,
            ticketId: userData.ticketId,
            identifier: userData.identifier,
            isLogged: true,
            emailList: userData.emailList,
            mobileList: userData.mobileList,
          };
          dispatch(setUserInfo(userInfo));
        }
      }
    }
    
    return response;
  }
);

export const sendLoginOtp = createAsyncThunk(
  'loginFlow/sendLoginOtp',
  async (emailOrMobile: string, { dispatch }) => {
    const response: any = await getLoginOtp(emailOrMobile, dispatch as AppDispatch);
    return response;
  }
);

export const verifyLoginOtp = createAsyncThunk(
  'loginFlow/verifyLoginOtp',
  async ({ emailOrMobile, otp }: { emailOrMobile: string; otp: string }, { dispatch }) => {
    const response: any = await verifyLoginOTP(emailOrMobile, otp, dispatch as AppDispatch);
    
    // If login successful, fetch user details
    if (response && (response.code === 200 || response.status === 'SUCCESS')) {
      
      // Get config from store
      const state = store.getState();
      const config = state.config;
      const jssoAuth = state.jssoAuth;
      
      try {
        // Fetch user details
        const userDetailsResult = await dispatch(
          getUserDetails({
            channelMerchant: jssoAuth.channelMerchant || config.channelType,
            channelPlatform: jssoAuth.channelPlatform || '',
          })
        ).unwrap();
        
        
        // User info is automatically set in jssoAuthSlice reducer
      } catch (error) {
        console.error('[Login Flow] Failed to fetch user details:', error);
        // Fallback: try to extract from login response
        const userData = response?.data || response?.response?.data || response;
        if (userData) {
          const userInfo = {
            ssoid: userData.ssoid || userData.data?.ssoid,
            primaryEmail: userData.primaryEmail || userData.emailId || userData.email,
            emailId: userData.emailId || userData.email,
            firstName: userData.firstName || userData.first_name,
            full_name: userData.full_name || userData.fullName,
            loginId: userData.loginId || userData.mobile,
            ticketId: userData.ticketId,
            identifier: userData.identifier,
            isLogged: true,
            emailList: userData.emailList,
            mobileList: userData.mobileList,
          };
          dispatch(setUserInfo(userInfo));
        }
      }
    }
    
    return response;
  }
);

export const sendForgotPasswordOtp = createAsyncThunk(
  'loginFlow/sendForgotPasswordOtp',
  async (emailOrMobile: string, { dispatch }) => {
    const response: any = await getForgotPasswordOtp(emailOrMobile, dispatch as AppDispatch);
    return response;
  }
);

export const resetPassword = createAsyncThunk(
  'loginFlow/resetPassword',
  async (
    {
      emailOrMobile,
      otp,
      password,
      confirmPassword,
    }: { emailOrMobile: string; otp: string; password: string; confirmPassword: string },
    { dispatch }
  ) => {
    const response: any = await verifyForgotPassword(
      emailOrMobile,
      otp,
      password,
      confirmPassword,
      dispatch as AppDispatch
    );
    return response;
  }
);

export const resendOtp = createAsyncThunk(
  'loginFlow/resendOtp',
  async ({ emailOrMobile, isSignUp }: { emailOrMobile: string; isSignUp: boolean }, { dispatch }) => {
    if (isSignUp) {
      const response: any = await resendSignUpOtp(emailOrMobile, dispatch as AppDispatch);
      return response;
    } else {
      const response: any = await getLoginOtp(emailOrMobile, dispatch as AppDispatch);
      return response;
    }
  }
);

const loginFlowSlice = createSlice({
  name: 'loginFlow',
  initialState,
  reducers: {
    setCurrentScreen: (state, action: PayloadAction<LoginScreen>) => {
      state.currentScreen = action.payload;
    },
    setEmailOrMobile: (state, action: PayloadAction<string>) => {
      state.emailOrMobile = action.payload;
      state.emailOrMobileError = '';
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      state.passwordError = '';
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.nameError = '';
    },
    setMobile: (state, action: PayloadAction<string>) => {
      state.mobile = action.payload;
      state.mobileError = '';
    },
    setOtp: (state, action: PayloadAction<string[]>) => {
      state.otp = action.payload;
      state.otpError = '';
    },
    setOtpValue: (state, action: PayloadAction<{ index: number; value: string }>) => {
      const newOtp = [...state.otp];
      newOtp[action.payload.index] = action.payload.value;
      state.otp = newOtp;
      state.otpError = '';
    },
    setEmailOrMobileError: (state, action: PayloadAction<string>) => {
      state.emailOrMobileError = action.payload;
    },
    setPasswordError: (state, action: PayloadAction<string>) => {
      state.passwordError = action.payload;
    },
    setNameError: (state, action: PayloadAction<string>) => {
      state.nameError = action.payload;
    },
    setMobileError: (state, action: PayloadAction<string>) => {
      state.mobileError = action.payload;
    },
    setOtpError: (state, action: PayloadAction<string>) => {
      state.otpError = action.payload;
    },
    resetLoginFlow: (state) => {
      return { ...initialState };
    },
    setSsoid: (state, action: PayloadAction<string>) => {
      state.ssoid = action.payload;
    },
    setAvailablePlans: (state, action: PayloadAction<any[]>) => {
      state.availablePlans = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check user exists
      .addCase(checkUserExists.pending, (state) => {
        state.isCheckingUser = true;
        state.emailOrMobileError = '';
      })
      .addCase(checkUserExists.fulfilled, (state, action) => {
        state.isCheckingUser = false;
        state.userExistenceResponse = action.payload;
        
        const response: any = action.payload;
        const status = response?.data?.status || response?.status;
        const statusCode = response?.data?.statusCode || response?.statusCode;
        
        // Determine user status
        if (
          status === 'UNREGISTERED_MOBILE' ||
          status === 'UNREGISTERED_EMAIL' ||
          statusCode === 214
        ) {
          state.userStatus = 'unregistered';
          state.currentScreen = 'setPassword';
        } else if (
          status === 'UNVERIFIED_MOBILE' ||
          status === 'UNVERIFIED_EMAIL' ||
          statusCode === 206
        ) {
          state.userStatus = 'unverified';
          state.currentScreen = 'setPassword';
        } else {
          state.userStatus = 'verified';
          state.currentScreen = 'passwordLogin';
        }
      })
      .addCase(checkUserExists.rejected, (state, action) => {
        state.isCheckingUser = false;
        state.emailOrMobileError = action.error.message || 'Failed to check user. Please try again.';
      })
      
      // Register user
      .addCase(registerNewUser.pending, (state) => {
        state.isLoading = true;
        state.passwordError = '';
        state.nameError = '';
        state.mobileError = '';
      })
      .addCase(registerNewUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationResponse = action.payload;
        
        const response: any = action.payload;
        if (response?.status === 'SUCCESS') {
          state.ssoid = response?.data?.ssoid || '';
          state.currentScreen = 'otpLogin';
        } else {
          state.passwordError = 'Registration failed. Please try again.';
        }
      })
      .addCase(registerNewUser.rejected, (state, action) => {
        state.isLoading = false;
        state.passwordError = action.error.message || 'Registration failed. Please try again.';
      })
      
      // Verify sign up OTP
      .addCase(verifySignUpOtp.pending, (state) => {
        state.isVerifyingOtp = true;
        state.otpError = '';
      })
      .addCase(verifySignUpOtp.fulfilled, (state, action) => {
        state.isVerifyingOtp = false;
        
        if (action.payload?.code === 200 || action.payload?.status === 'SUCCESS') {
          // User info is already set in the thunk, just update screen
          // Show plan selection screen if plans are available, otherwise show success
          state.currentScreen = state.availablePlans.length > 0 ? 'planSelection' : 'success';
        } else if (action.payload?.code === 414) {
          state.otpError = 'The OTP entered is incorrect';
        } else {
          state.otpError = 'Verification failed. Please try again.';
        }
      })
      .addCase(verifySignUpOtp.rejected, (state, action) => {
        state.isVerifyingOtp = false;
        state.otpError = action.error.message || 'Verification failed. Please try again.';
      })
      
      // Login with password
      .addCase(loginWithPassword.pending, (state) => {
        state.isLoading = true;
        state.passwordError = '';
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loginResponse = action.payload;
        
        if (action.payload?.code === 200 || action.payload?.status === 'SUCCESS') {
          // Show plan selection screen if plans are available, otherwise show success
          state.currentScreen = state.availablePlans.length > 0 ? 'planSelection' : 'success';
        } else {
          state.passwordError = 'Invalid credentials. Please try again.';
        }
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.passwordError = action.error.message || 'Login failed. Please try again.';
      })
      
      // Send login OTP
      .addCase(sendLoginOtp.pending, (state) => {
        state.isSendingOtp = true;
        state.otpError = '';
      })
      .addCase(sendLoginOtp.fulfilled, (state, action) => {
        state.isSendingOtp = false;
        
        if (action.payload?.code === 200) {
          state.currentScreen = 'otpLogin';
          state.otp = ['', '', '', '', '', ''];
        } else {
          state.otpError = 'Failed to send OTP. Please try again.';
        }
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.isSendingOtp = false;
        state.otpError = action.error.message || 'Failed to send OTP. Please try again.';
      })
      
      // Verify login OTP
      .addCase(verifyLoginOtp.pending, (state) => {
        state.isVerifyingOtp = true;
        state.otpError = '';
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.isVerifyingOtp = false;
        
        if (action.payload?.code === 200 || action.payload?.status === 'SUCCESS') {
          // Show plan selection screen if plans are available, otherwise show success
          state.currentScreen = state.availablePlans.length > 0 ? 'planSelection' : 'success';
        } else if (action.payload?.code === 414) {
          state.otpError = 'The OTP entered is incorrect';
        } else {
          state.otpError = 'Verification failed. Please try again.';
        }
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.isVerifyingOtp = false;
        state.otpError = action.error.message || 'Verification failed. Please try again.';
      })
      
      // Send forgot password OTP
      .addCase(sendForgotPasswordOtp.pending, (state) => {
        state.isSendingOtp = true;
        state.otpError = '';
      })
      .addCase(sendForgotPasswordOtp.fulfilled, (state, action) => {
        state.isSendingOtp = false;
        
        if (action.payload?.code === 200) {
          state.currentScreen = 'forgotPasswordReset';
          state.otp = ['', '', '', '', '', ''];
        } else {
          state.otpError = 'Failed to send OTP. Please try again.';
        }
      })
      .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
        state.isSendingOtp = false;
        state.otpError = action.error.message || 'Failed to send OTP. Please try again.';
      })
      
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.otpError = '';
        state.passwordError = '';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload?.code === 200 || action.payload?.status === 'SUCCESS') {
          state.currentScreen = 'passwordLogin';
          state.otp = ['', '', '', '', '', ''];
          state.password = '';
        } else if (action.payload?.code === 414) {
          state.otpError = 'Please enter correct OTP';
        } else {
          state.passwordError = 'Password reset failed. Please try again.';
        }
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.passwordError = action.error.message || 'Password reset failed. Please try again.';
      })
      
      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.isResendingOtp = true;
        state.otpError = '';
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.isResendingOtp = false;
        
        if (action.payload?.code === 200) {
          state.otp = ['', '', '', '', '', ''];
        } else {
          state.otpError = 'Failed to resend OTP. Please try again.';
        }
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isResendingOtp = false;
        state.otpError = action.error.message || 'Failed to resend OTP. Please try again.';
      });
  },
});

export const {
  setCurrentScreen,
  setEmailOrMobile,
  setPassword,
  setName,
  setMobile,
  setOtp,
  setOtpValue,
  setEmailOrMobileError,
  setPasswordError,
  setNameError,
  setMobileError,
  setOtpError,
  resetLoginFlow,
  setSsoid,
  setAvailablePlans,
} = loginFlowSlice.actions;

export default loginFlowSlice.reducer;

