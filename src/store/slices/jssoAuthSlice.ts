import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types based on the original JSSO implementation
export interface JSSOUserInfo {
  ssoid?: string;
  primaryEmail?: string;
  emailId?: string;
  firstName?: string;
  full_name?: string;
  loginId?: string;
  ticketId?: string;
  identifier?: string;
  isLogged?: boolean;
  emailList?: Record<string, string>;
  mobileList?: Record<string, string>;
  mobileData?: {
    Verified?: {
      mobile?: string;
      code?: string;
    };
  };
}

export interface JSSOPermissions {
  permissions: string[];
  accessibleFeatures?: string[];
  subscriptionDetail?: {
    userAcquisitionType?: string;
  };
  subscribed?: boolean;
  prc?: string;
}

export interface JSSOState {
  // User state
  userInfo: JSSOUserInfo;
  isLogin: boolean;
  isGuestLogin: boolean;
  guestEmail: string;
  guestMobile: string;
  
  // Permissions state
  permissionsArr: string[];
  accessibleFeatures: string[];
  userType: string;
  isGroupUser: boolean;
  permissionObj: {
    data?: {
      productDetails?: Array<{
        productCode: string;
        permissions: string[];
        accessibleFeatures?: string[];
        subscriptionDetail?: {
          userAcquisitionType?: string;
        };
        subscribed?: boolean;
        prc?: string;
      }>;
      emailId?: string;
      token?: string;
    };
  };
  subscriptionDetails: Record<string, any>;
  
  // Auth state
  ticketId: string;
  
  // Loading states
  isLoading: boolean;
  isCheckingLogin: boolean;
  isGettingPermissions: boolean;
  isFetchingUserToken: boolean; // Loading state for unified auth flow
  
  // Error states
  error: string | null;
  
  // OAuth URL API response (stores full response from oauthUrl API)
  oauthUrlResponse: any | null;
  
  // Channel info
  channelMerchant: string;
  channelPlatform: string;
  
  // After login callbacks
  afterLoginStack: Array<() => void>;
  afterLoginProcessDone: number;
  
  // User token and product details
  userToken: string;
  userProductDetails: any;
}

const initialState: JSSOState = {
  userInfo: {},
  isLogin: false,
  isGuestLogin: false,
  guestEmail: '',
  guestMobile: '',
  permissionsArr: [],
  accessibleFeatures: [],
  userType: '',
  isGroupUser: false,
  permissionObj: {},
  subscriptionDetails: {},
  ticketId: '',
  isLoading: false,
  isCheckingLogin: false,
  isGettingPermissions: false,
  isFetchingUserToken: false,
  error: null,
  oauthUrlResponse: null,
  channelMerchant: '',
  channelPlatform: '',
  afterLoginStack: [],
  afterLoginProcessDone: 0,
  userToken: '',
  userProductDetails: null,
};

// Async thunks for JSSO operations
export const loadJSSOSDK = createAsyncThunk(
  'jsso/loadSDK',
  async (sdkUrl: string) => {
    console.log('[JSSO SDK] 🚀 Starting to load JSSO SDK from:', sdkUrl);
    return new Promise<void>((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="jsso_crosswalk"]');
      if (existingScript) {
        console.log('[JSSO SDK] 📜 Script already exists in DOM');
        // @ts-ignore
        if (typeof JssoCrosswalk !== 'undefined') {
          console.log('[JSSO SDK] ✅ JssoCrosswalk class is already available');
          resolve();
          return;
        } else {
          console.log('[JSSO SDK] ⏳ Script exists but class not available, waiting...');
          // Wait for class to become available
          let attempts = 0;
          const checkInterval = setInterval(() => {
            attempts++;
            // @ts-ignore
            if (typeof JssoCrosswalk !== 'undefined') {
              console.log('[JSSO SDK] ✅ JssoCrosswalk class became available after', attempts, 'attempts');
              clearInterval(checkInterval);
              resolve();
            } else if (attempts >= 50) {
              console.warn('[JSSO SDK] ⚠️ Timeout waiting for JssoCrosswalk class after', attempts, 'attempts');
              clearInterval(checkInterval);
              resolve(); // Resolve anyway, let App.tsx handle verification
            }
          }, 100);
          return;
        }
      }

      console.log('[JSSO SDK] 📥 Creating new script element to load SDK');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      
      script.onload = () => {
        console.log('[JSSO SDK] 📦 Script loaded successfully, waiting for class initialization...');
        // Give script a moment to execute
        setTimeout(() => {
          // @ts-ignore
          if (typeof JssoCrosswalk !== 'undefined') {
            console.log('[JSSO SDK] ✅ JssoCrosswalk class is now available');
          } else {
            console.warn('[JSSO SDK] ⚠️ Script loaded but JssoCrosswalk class not yet available');
          }
          resolve();
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error('[JSSO SDK] ❌ Failed to load JSSO SDK script:', error);
        reject(new Error(`Failed to load JSSO SDK from ${sdkUrl}`));
      };
      
      script.src = sdkUrl;
      document.head.appendChild(script);
      console.log('[JSSO SDK] 📤 Script element appended to head');
    });
  }
);

export const getValidLoggedInUser = createAsyncThunk(
  'jsso/getValidLoggedInUser',
  async (params: { channelMerchant: string; channelPlatform: string }, { rejectWithValue }) => {
    console.log('[JSSO SDK] 🔍 getValidLoggedInUser called with params:', params);
    try {
      // @ts-ignore - JssoCrosswalk is loaded dynamically
      if (typeof JssoCrosswalk === 'undefined') {
        console.error('[JSSO SDK] ❌ JssoCrosswalk is not loaded');
        throw new Error('JssoCrosswalk is not loaded');
      }

      console.log('[JSSO SDK] 🏗️ Creating JssoCrosswalk instance...');
      // @ts-ignore
      const JSSO = new JssoCrosswalk(params.channelMerchant, params.channelPlatform);
      console.log('[JSSO SDK] ✅ JssoCrosswalk instance created successfully');

      return new Promise<any>((resolve) => {
        console.log('[JSSO SDK] 📞 Calling JSSO.getValidLoggedInUser...');
        JSSO.getValidLoggedInUser((response: any) => {
          console.log('[JSSO SDK] 📥 getValidLoggedInUser response:', {
            status: response.status,
            hasData: !!response.data,
            ticketId: response.data?.ticketId,
          });
          if (response.status === 'SUCCESS') {
            console.log('[JSSO SDK] ✅ User is logged in');
            resolve({ response, JSSO });
          } else {
            console.log('[JSSO SDK] ℹ️ User is not logged in');
            resolve({ response, JSSO });
          }
        });
      });
    } catch (error: any) {
      console.error('[JSSO SDK] ❌ Error in getValidLoggedInUser:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const getUserDetails = createAsyncThunk(
  'jsso/getUserDetails',
  async (params: { channelMerchant: string; channelPlatform: string }, { rejectWithValue }) => {
    console.log('[JSSO SDK] 👤 getUserDetails called with params:', params);
    try {
      // @ts-ignore
      if (typeof JssoCrosswalk === 'undefined') {
        console.error('[JSSO SDK] ❌ JssoCrosswalk is not loaded');
        throw new Error('JssoCrosswalk is not loaded');
      }

      console.log('[JSSO SDK] 🏗️ Creating JssoCrosswalk instance for getUserDetails...');
      // @ts-ignore
      const JSSO = new JssoCrosswalk(params.channelMerchant, params.channelPlatform);
      console.log('[JSSO SDK] ✅ JssoCrosswalk instance created successfully');

      return new Promise<any>((resolve) => {
        console.log('[JSSO SDK] 📞 Calling JSSO.getUserDetails...');
        JSSO.getUserDetails((response: any) => {
          console.log('[JSSO SDK] 📥 getUserDetails response:', {
            status: response.status,
            hasData: !!response.data,
            ssoid: response.data?.ssoid,
            emailId: response.data?.emailId,
            firstName: response.data?.firstName,
          });
          resolve({ response, JSSO });
        });
      });
    } catch (error: any) {
      console.error('[JSSO SDK] ❌ Error in getUserDetails:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const getPermissions = createAsyncThunk(
  'jsso/getPermissions',
  async (params: {
    ticketId: string;
    ssoid: string;
    deviceid: string;
    clientId: string;
    appCode: string;
    merchantCode: string;
    objAuthDomain: string;
  }, { rejectWithValue }) => {
    try {
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-client-id': params.clientId,
        'x-device-id': params.deviceid,
        'x-sso-id': params.ssoid,
        'x-site-app-code': params.appCode,
        'X-TICKET-ID': params.ticketId,
      };

      const oauthUrl = `https://${params.objAuthDomain}.economictimes.indiatimes.com/auth/${params.merchantCode}/userToken?grantType=refresh_token`;

      const response = await fetch(oauthUrl, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Unified UserToken API call - Single source of truth for authentication
export const fetchUserToken = createAsyncThunk(
  'jsso/fetchUserToken',
  async (params: {
    ticketId: string;
    ssoid: string;
    deviceid: string;
    clientId: string;
    appCode: string;
    merchantCode: string;
    objAuthDomain: string;
  }, { rejectWithValue }) => {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
        'x-client-id': params.clientId,
        'x-device-id': params.deviceid || '',
        'x-sso-id': params.ssoid,
        'x-site-app-code': params.appCode,
        'X-TICKET-ID': params.ticketId,
      };

      const oauthUrl = `https://${params.objAuthDomain}.economictimes.indiatimes.com/auth/${params.merchantCode}/userToken?grantType=refresh_token`;

      const response = await fetch(oauthUrl, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        return rejectWithValue(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user token');
    }
  }
);

const jssoAuthSlice = createSlice({
  name: 'jssoAuth',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<JSSOUserInfo>) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      state.isLogin = !!action.payload.isLogged;
    },
    clearUserInfo: (state) => {
      // Clear user info
      state.userInfo = {};
      state.isLogin = false;
      state.isGuestLogin = false;
      state.guestEmail = '';
      state.guestMobile = '';
      
      // Clear permissions
      state.permissionsArr = [];
      state.accessibleFeatures = [];
      state.userType = '';
      state.isGroupUser = false;
      state.permissionObj = {};
      state.subscriptionDetails = {};
      
      // Clear auth tokens
      state.ticketId = '';
      state.oauthUrlResponse = null;
      
      // Clear user token and product details
      state.userToken = '';
      state.userProductDetails = null;
    },
    setPermissions: (state, action: PayloadAction<JSSOPermissions>) => {
      state.permissionsArr = action.payload.permissions || [];
      state.accessibleFeatures = action.payload.accessibleFeatures || [];
    },
    setPermissionObj: (state, action: PayloadAction<any>) => {
      state.permissionObj = action.payload;
    },
    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload;
    },
    setIsGroupUser: (state, action: PayloadAction<boolean>) => {
      state.isGroupUser = action.payload;
    },
    setSubscriptionDetails: (state, action: PayloadAction<Record<string, any>>) => {
      state.subscriptionDetails = action.payload;
    },
    setTicketId: (state, action: PayloadAction<string>) => {
      state.ticketId = action.payload;
    },
    setGuestLogin: (state, action: PayloadAction<{ email?: string; mobile?: string }>) => {
      state.isGuestLogin = true;
      if (action.payload.email) state.guestEmail = action.payload.email;
      if (action.payload.mobile) state.guestMobile = action.payload.mobile;
    },
    clearGuestLogin: (state) => {
      state.isGuestLogin = false;
      state.guestEmail = '';
      state.guestMobile = '';
    },
    setChannelInfo: (state, action: PayloadAction<{ merchant: string; platform: string }>) => {
      state.channelMerchant = action.payload.merchant;
      state.channelPlatform = action.payload.platform;
    },
    addAfterLoginCallback: (state, action: PayloadAction<() => void>) => {
      state.afterLoginStack.push(action.payload);
    },
    clearAfterLoginStack: (state) => {
      state.afterLoginStack = [];
    },
    setAfterLoginProcessDone: (state, action: PayloadAction<number>) => {
      state.afterLoginProcessDone = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUserToken: (state, action: PayloadAction<string>) => {
      state.userToken = action.payload;
    },
    setUserProductDetails: (state, action: PayloadAction<any>) => {
      state.userProductDetails = action.payload;
    },
    setOauthUrlResponse: (state, action: PayloadAction<any>) => {
      state.oauthUrlResponse = action.payload;
      
      // Set isLogin based on presence of ssoId in response (API returns ssoId, not ssoID)
      const response = action.payload;
      const isSuccess = response?.code === '200' || response?.code === 200;
      const hasSsoId = !!response?.data?.ssoId;
      
      if (isSuccess && hasSsoId) {
        state.isLogin = true;
        // Update userInfo from response
        if (response.data) {
          state.userInfo = {
            ...state.userInfo,
            ssoid: response.data.ssoId,
            emailId: response.data.emailId,
            primaryEmail: response.data.emailId,
            firstName: response.data.fname || response.data.firstName,
            isLogged: true,
          };
          
          // Store token if available
          if (response.data.token) {
            state.userToken = response.data.token;
          }
          
          // Store product details if available
          if (response.data.productDetails) {
            state.userProductDetails = response.data.productDetails;
          }
        }
      } else {
        state.isLogin = false;
      }
    },
    setFetchingUserToken: (state, action: PayloadAction<boolean>) => {
      state.isFetchingUserToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadJSSOSDK.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadJSSOSDK.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loadJSSOSDK.rejected, (state, action) => {       
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load JSSO SDK';
      })
      .addCase(getValidLoggedInUser.pending, (state) => {
        state.isCheckingLogin = true;
      })
      .addCase(getValidLoggedInUser.fulfilled, (state, action) => {
        state.isCheckingLogin = false;
        if (action.payload.response.status === 'SUCCESS') {
          state.ticketId = action.payload.response.data.ticketId;
        }
      })
      .addCase(getValidLoggedInUser.rejected, (state, action) => {
        state.isCheckingLogin = false;
        state.error = action.payload as string;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        if (action.payload.response.data) {
          const userInfo = action.payload.response.data;
          state.userInfo = {
            ...userInfo,
            isLogged: true,
            ticketId: userInfo.ticketId,
            identifier: userInfo.identifier,
          };
          state.isLogin = true;
        }
      })
      .addCase(getPermissions.pending, (state) => {
        state.isGettingPermissions = true;
      })
      .addCase(getPermissions.fulfilled, (state, action) => {
        state.isGettingPermissions = false;
        
        // Store oauthUrl API response
        state.oauthUrlResponse = action.payload;
        
        // Set isLogin based on ssoId presence in response
        const response = action.payload;
        const isSuccess = response?.code === '200' || response?.code === 200;
        const hasSsoId = !!response?.data?.ssoId;
        
        if (isSuccess && hasSsoId) {
          state.isLogin = true;
          
          // Update userInfo from response
          if (response.data) {
            state.userInfo = {
              ...state.userInfo,
              ssoid: response.data.ssoId,
              emailId: response.data.emailId,
              primaryEmail: response.data.emailId,
              firstName: response.data.fname || response.data.firstName,
              isLogged: true,
            };
            
            // Store token if available
            if (response.data.token) {
              state.userToken = response.data.token;
            }
            
            // Store product details if available
            if (response.data.productDetails) {
              state.userProductDetails = response.data.productDetails;
            }
          }
        } else {
          state.isLogin = false;
        }
        
        // Process permissions if data exists
        if (action.payload?.data) {
          const productDetails = action.payload.data.productDetails;
          if (productDetails && productDetails.length > 0) {
            // Find product by productCode (would need to be passed from config)
            const productSelected = productDetails[0]; // Simplified - should match by productCode
            state.permissionsArr = productSelected.permissions || [];
            state.accessibleFeatures = productSelected.accessibleFeatures || [];
            state.permissionObj = action.payload;
            if (productSelected.subscriptionDetail) {
              state.subscriptionDetails = productSelected.subscriptionDetail;
            }
          }
        }
      })
      .addCase(getPermissions.rejected, (state, action) => {
        state.isGettingPermissions = false;
        state.error = action.payload as string;
      })
      // Unified UserToken fetch
      .addCase(fetchUserToken.pending, (state) => {
        state.isFetchingUserToken = true;
        state.error = null;
      })
      .addCase(fetchUserToken.fulfilled, (state, action) => {
        state.isFetchingUserToken = false;
        
        // Store oauthUrl API response
        state.oauthUrlResponse = action.payload;
        
        // Set isLogin based on ssoId presence in response (API returns ssoId, not ssoID)
        const response = action.payload;
        const isSuccess = response?.code === '200' || response?.code === 200;
        const hasSsoId = !!response?.data?.ssoId;
        
        if (isSuccess && hasSsoId) {
          state.isLogin = true;
          
          // Update userInfo immediately from response
          if (response.data) {
            state.userInfo = {
              ...state.userInfo,
              ssoid: response.data.ssoId,
              emailId: response.data.emailId,
              primaryEmail: response.data.emailId,
              firstName: response.data.fname || response.data.firstName,
              isLogged: true,
            };
            
            // Store token if available
            if (response.data.token) {
              state.userToken = response.data.token;
            }
            
            // Store product details if available
            if (response.data.productDetails) {
              state.userProductDetails = response.data.productDetails;
            }
          }
          
        } else {
          state.isLogin = false;
        }
      })
      .addCase(fetchUserToken.rejected, (state, action) => {
        console.error('[Redux] ❌ UserToken fetch failed:', action.payload);
        state.isFetchingUserToken = false;
        state.isLogin = false;
        state.error = action.payload as string;
        state.oauthUrlResponse = null;
      });
  },
});

export const {
  setUserInfo,
  clearUserInfo,
  setPermissions,
  setPermissionObj,
  setUserType,
  setIsGroupUser,
  setSubscriptionDetails,
  setTicketId,
  setGuestLogin,
  clearGuestLogin,
  setChannelInfo,
  addAfterLoginCallback,
  clearAfterLoginStack,
  setAfterLoginProcessDone,
  setError,
  setUserToken,
  setUserProductDetails,
  setOauthUrlResponse,
  setFetchingUserToken,
} = jssoAuthSlice.actions;

export default jssoAuthSlice.reducer;

