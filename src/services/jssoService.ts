import { store } from '../store';
import {
  loadJSSOSDK,
  getValidLoggedInUser,
  getUserDetails,
  getPermissions,
  setUserInfo,
  setTicketId,
  setPermissions,
  setPermissionObj,
  setUserType,
  setIsGroupUser,
  setSubscriptionDetails,
  setGuestLogin,
  clearUserInfo,
  setChannelInfo,
  addAfterLoginCallback,
  setAfterLoginProcessDone,
  clearAfterLoginStack,
} from '../store/slices/jssoAuthSlice';
import {
  updateGAEvents,
  updateCSEvents,
  setCustomDimension,
  clearAnalytics,
} from '../store/slices/analyticsSlice';
import { RootState } from '../store';

// Cookie utilities (replicated from original)
class CookieUtils {
  static setCookie(cname: string, cvalue: string, seconds: number): void {
    const dt = new Date();
    dt.setTime(dt.getTime() + seconds * 1000);
    const expires = `; expires=${dt.toUTCString()}`;
    const hostname = location.hostname;
    let domain = '';

    if (hostname.includes('indiatimes.com')) {
      domain = 'indiatimes.com';
    } else if (hostname.includes('timeshealthplus.com')) {
      domain = 'timeshealthplus.com';
    } else if (hostname.includes('economictimes.com')) {
      domain = 'economictimes.com';
    }

    document.cookie = `${cname}=${cvalue}${expires}; domain=${domain}; path=/;`;
  }

  static readCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  static removeCookie(name: string): boolean {
    const expiredDate = 'Thu, 01 Jan 1970 00:00:01 GMT';
    const domains = ['indiatimes.com', 'timeshealthplus.com', 'economictimes.com'];
    for (const domain of domains) {
      document.cookie = `${name}=; Path=/; Expires=${expiredDate}; Domain=.${domain}`;
    }
    document.cookie = `${name}=; Path=/; Expires=${expiredDate}`;
    return true;
  }
}

// Session storage utilities
class SessionStorageUtils {
  static updateSessionStorage(value: Record<string, any>, sessionItem: string): void {
    const stored = sessionStorage.getItem(sessionItem);
    if (stored !== null) {
      const prevData = JSON.parse(stored);
      Object.keys(value).forEach((key) => {
        prevData[key] = value[key];
      });
      sessionStorage.setItem(sessionItem, JSON.stringify(prevData));
    } else {
      sessionStorage.setItem(sessionItem, JSON.stringify({}));
      this.updateSessionStorage(value, sessionItem);
    }
  }
}

class JSSOService {
  private get store(): typeof store {
    // Lazy access - store is imported at top level but only accessed when needed
    // This getter ensures store is only accessed when methods are called, not during construction
    return store;
  }

  // Initialize JSSO - replicates objUser.init()
  async init(): Promise<void> {
    console.log('[JSSO Service] 🚀 Initializing JSSO Service...');
    const state = this.store.getState();
    const config = state.config;
    const jssoAuth = state.jssoAuth;

    console.log('[JSSO Service] 📋 Config:', {
      channelType: config.channelType,
      jssoSDK: config.jssoSDK,
      merchantCode: config.merchantCode,
    });

    // Set channel info
    this.store.dispatch(
      setChannelInfo({
        merchant: config.channelType,
        platform: (window as any).planparams?.platform || '',
      })
    );
    console.log('[JSSO Service] 📡 Channel info set:', {
      merchant: config.channelType,
      platform: (window as any).planparams?.platform || '',
    });

    // Check if plan is selected in session storage
    const selectedPlan = sessionStorage.getItem('et_plans_selectedPlan');
    const checkReferer = selectedPlan
      ? JSON.parse(selectedPlan).checkReferer &&
        document.referrer.indexOf(config.loginUrl) >= 0
      : false;
    console.log('[JSSO Service] 📝 Plan check:', { selectedPlan: !!selectedPlan, checkReferer });

    // Load JSSO SDK and get user details
    console.log('[JSSO Service] 🔄 Starting getUserDetailOpt...');
    await this.getUserDetailOpt();
    console.log('[JSSO Service] 🔄 Starting getUserDetailHandler...');
    await this.getUserDetailHandler(checkReferer);
    console.log('[JSSO Service] ✅ Initialization complete');
  }

  // Load JSSO SDK and get user details - replicates getUserDetailOpt()
  async getUserDetailOpt(): Promise<void> {
    console.log('[JSSO Service] 🔍 getUserDetailOpt called');
    const state = this.store.getState();
    const config = state.config;
    const jssoAuth = state.jssoAuth;

    try {
      // Check if SDK is already loaded
      // @ts-ignore
      if (typeof JssoCrosswalk !== 'undefined') {
        console.log('[JSSO Service] ✅ JssoCrosswalk is already available');
      } else if (document.querySelector('script[src*="jsso_crosswalk"]')) {
        console.log('[JSSO Service] ⏳ Script exists, waiting for class...');
        // Wait a bit for the script to execute
        await new Promise(resolve => setTimeout(resolve, 100));
        // @ts-ignore
        if (typeof JssoCrosswalk !== 'undefined') {
          console.log('[JSSO Service] ✅ JssoCrosswalk became available after wait');
        } else {
          console.warn('[JSSO Service] ⚠️ JSSO SDK script exists but class still not available');
        }
      } else {
        console.log('[JSSO Service] 📥 Loading JSSO SDK...');
        // Load JSSO SDK if not already loaded
        await this.store.dispatch(loadJSSOSDK(config.jssoSDK) as unknown as any).unwrap();
        console.log('[JSSO Service] ✅ JSSO SDK loading completed');
      }

      // Check if JssoCrosswalk is loaded
      // @ts-ignore
      if (typeof JssoCrosswalk === 'undefined') {
        console.error('[JSSO Service] ❌ JssoCrosswalk is still not available, aborting');
        return;
      }

      // Get valid logged in user
      console.log('[JSSO Service] 🔐 Calling getValidLoggedInUser...');
      const result: any = await this.store
        .dispatch(
          getValidLoggedInUser({
            channelMerchant: jssoAuth.channelMerchant || config.channelType,
            channelPlatform: jssoAuth.channelPlatform || (window as any).planparams?.platform || '',
          }) as unknown as any
        )
        .unwrap();

      console.log('[JSSO Service] 📥 getValidLoggedInUser result:', {
        status: result.response.status,
        hasData: !!result.response.data,
      });

      if (result.response.status === 'SUCCESS') {
        console.log('[JSSO Service] ✅ User is logged in, processing user details...');
        const ticketId = result.response.data.ticketId;
        const encTicket = result.response.data.encTicket;

        // Update cookies
        if (CookieUtils.readCookie('TicketId') !== ticketId) {
          CookieUtils.setCookie('TicketId', ticketId, 3600 * 24 * 30);
        }
        if (CookieUtils.readCookie('encTicket') !== encTicket) {
          CookieUtils.setCookie('encTicket', encTicket, 3600 * 24 * 30);
        }

        this.store.dispatch(setTicketId(ticketId));

        // Update session storage for analytics
        SessionStorageUtils.updateSessionStorage({ dimension146: 'LOGGEDIN' }, 'updateGAEvents');
        SessionStorageUtils.updateSessionStorage({ loggedin: 'y' }, 'updateCSEvents');
        this.store.dispatch(updateGAEvents({ dimension146: 'LOGGEDIN' }));
        this.store.dispatch(updateCSEvents({ loggedin: 'y' }));

        // Get user details
        console.log('[JSSO Service] 👤 Calling getUserDetails...');
        const userDetailsResult: any = await this.store
          .dispatch(
            getUserDetails({
              channelMerchant: jssoAuth.channelMerchant || config.channelType,
              channelPlatform: jssoAuth.channelPlatform || '',
            }) as unknown as any
          )
          .unwrap();

        console.log('[JSSO Service] 📥 getUserDetails result:', {
          status: userDetailsResult.response.status,
          hasData: !!userDetailsResult.response.data,
        });

        if (userDetailsResult.response.data) {
          console.log('[JSSO Service] ✅ User details received, updating state...');
          const userInfo = userDetailsResult.response.data;
          const updatedUserInfo = {
            ...userInfo,
            isLogged: true,
            ticketId: userInfo.ticketId,
            identifier: userInfo.identifier,
          };

          this.store.dispatch(setUserInfo(updatedUserInfo));

          // Update cookies
          if (userInfo.ssoid) {
            CookieUtils.setCookie('ssoid', userInfo.ssoid, 3600 * 24 * 30);
          }

          // Update session storage and Redux for analytics
          SessionStorageUtils.updateSessionStorage({ email: userInfo.emailId }, 'updateCSEvents');
          SessionStorageUtils.updateSessionStorage({ firstName: userInfo.firstName }, 'updateCSEvents');
          SessionStorageUtils.updateSessionStorage({ full_name: userInfo.full_name }, 'updateCSEvents');

          this.store.dispatch(updateCSEvents({ email: userInfo.emailId }));
          this.store.dispatch(updateCSEvents({ firstName: userInfo.firstName }));

          // Check for verified mobile
          const verifiedMobile = this.getVerifiedMobile();
          if (verifiedMobile?.verified) {
            SessionStorageUtils.updateSessionStorage({ phone: verifiedMobile.mobileNumber }, 'updateCSEvents');
            SessionStorageUtils.updateSessionStorage({ phone: verifiedMobile.mobileNumber }, 'updateGAEvents');
            this.store.dispatch(updateCSEvents({ phone: verifiedMobile.mobileNumber }));
            this.store.dispatch(updateGAEvents({ phone: verifiedMobile.mobileNumber }));
          }

          // Set GRX user ID if available
          if ((window as any).grx && userInfo.ssoid) {
            (window as any).grx('userId', userInfo.ssoid);
          }

          // Dispatch login check event
          console.log('[JSSO Service] 📢 Dispatching loginCheck event');
          document.dispatchEvent(new Event('loginCheck'));
        } else {
          console.log('[JSSO Service] ⚠️ No user data in response, clearing user info');
          this.store.dispatch(clearUserInfo());
        }
      } else {
        // User not logged in
        console.log('[JSSO Service] ℹ️ User is not logged in');
        this.handleNotLoggedIn();
      }
    } catch (error) {
      console.error('[JSSO Service] ❌ Error in getUserDetailOpt:', error);
      this.handleNotLoggedIn();
    }
  }

  // Get user details with forced update - replicates getUserDetailOptForced()
  async getUserDetailOptForced(callback?: (response?: any) => void): Promise<void> {
    console.log('[JSSO Service] 🔄 getUserDetailOptForced called (forced update)');
    const state = this.store.getState();
    const config = state.config;
    const jssoAuth = state.jssoAuth;

    try {
      // Check if SDK is already loaded
      // @ts-ignore
      if (typeof JssoCrosswalk === 'undefined') {
        console.log('[JSSO Service] 📥 Loading JSSO SDK for forced update...');
        // Load JSSO SDK if not already loaded
        await this.store.dispatch(loadJSSOSDK(config.jssoSDK) as unknown as any).unwrap();
      } else {
        console.log('[JSSO Service] ✅ JssoCrosswalk is already available');
      }

      // Check if JssoCrosswalk is loaded
      // @ts-ignore
      if (typeof JssoCrosswalk === 'undefined') {
        console.error('[JSSO Service] ❌ JssoCrosswalk is not loaded.');
        if (callback) callback({ status: 'ERROR', error: 'JssoCrosswalk is not loaded' });
        return;
      }

      console.log('[JSSO Service] 🏗️ Creating JssoCrosswalk instance for forced update...');
      // @ts-ignore
      const JSSO = new JssoCrosswalk(
        jssoAuth.channelMerchant || config.channelType,
        jssoAuth.channelPlatform || (window as any).planparams?.platform || ''
      );
      console.log('[JSSO Service] ✅ JssoCrosswalk instance created');

      // Get valid logged in user
      console.log('[JSSO Service] 📞 Calling JSSO.getValidLoggedInUser (forced)...');
      JSSO.getValidLoggedInUser(async (response: any) => {
        console.log('[JSSO Service] 📥 getValidLoggedInUser response (forced):', {
          status: response.status,
          hasData: !!response.data,
        });
        if (response.status === 'SUCCESS') {
          console.log('[JSSO Service] ✅ User is logged in (forced), getting user details...');
          const ticketId = response.data.ticketId;
          const encTicket = response.data.encTicket;

          // Update cookies
          if (CookieUtils.readCookie('TicketId') !== ticketId) {
            CookieUtils.setCookie('TicketId', ticketId, 3600 * 24 * 30);
          }
          if (CookieUtils.readCookie('encTicket') !== encTicket) {
            CookieUtils.setCookie('encTicket', encTicket, 3600 * 24 * 30);
          }

          // Update ssoid cookie if not present
          const currentSsoid = CookieUtils.readCookie('ssoid');
          const stateSsoid = this.store.getState().jssoAuth.userInfo.ssoid;
          if (!currentSsoid && stateSsoid) {
            CookieUtils.setCookie('ssoid', stateSsoid, 3600 * 24 * 30);
          }

          this.store.dispatch(setTicketId(ticketId));

          // Update session storage for analytics
          SessionStorageUtils.updateSessionStorage({ dimension146: 'LOGGEDIN' }, 'updateGAEvents');
          SessionStorageUtils.updateSessionStorage({ loggedin: 'y' }, 'updateCSEvents');
          this.store.dispatch(updateGAEvents({ dimension146: 'LOGGEDIN' }));
          this.store.dispatch(updateCSEvents({ loggedin: 'y' }));

          // Get user details with force update
          console.log('[JSSO Service] 📞 Calling JSSO.getUserDetails (forced update)...');
          JSSO.getUserDetails(
            async (res: any) => {
              console.log('[JSSO Service] 📥 getUserDetails response (forced):', {
                status: res.status,
                hasData: !!res.data,
                ssoid: res.data?.ssoid,
              });
              if (res.data) {
                console.log('[JSSO Service] ✅ User details received (forced), updating state...');
                const userInfo = res.data;
                const updatedUserInfo = {
                  ...userInfo,
                  isLogged: true,
                  ticketId: res.data.ticketId,
                  identifier: res.data.identifier,
                };

                this.store.dispatch(setUserInfo(updatedUserInfo));

                // Update cookies
                if (userInfo.ssoid) {
                  CookieUtils.setCookie('ssoid', userInfo.ssoid, 3600 * 24 * 30);
                }

                // Update session storage and Redux for analytics
                SessionStorageUtils.updateSessionStorage({ email: res.data.emailId }, 'updateCSEvents');
                SessionStorageUtils.updateSessionStorage({ firstName: res.data.firstName }, 'updateCSEvents');
                SessionStorageUtils.updateSessionStorage({ full_name: res.data.full_name }, 'updateCSEvents');

                this.store.dispatch(updateCSEvents({ email: res.data.emailId }));
                this.store.dispatch(updateCSEvents({ firstName: res.data.firstName }));

                // Check for verified mobile
                const verifiedMobile = this.getVerifiedMobile();
                if (verifiedMobile?.verified) {
                  const csEvents = JSON.parse(sessionStorage.getItem('updateCSEvents') || '{}');
                  if (!csEvents.phone) {
                    SessionStorageUtils.updateSessionStorage({ phone: verifiedMobile.mobileNumber }, 'updateCSEvents');
                    SessionStorageUtils.updateSessionStorage({ phone: verifiedMobile.mobileNumber }, 'updateGAEvents');
                    this.store.dispatch(updateCSEvents({ phone: verifiedMobile.mobileNumber }));
                    this.store.dispatch(updateGAEvents({ phone: verifiedMobile.mobileNumber }));
                  }
                }

                // Set GRX user ID if available
                if ((window as any).grx && userInfo.ssoid) {
                  (window as any).grx('userId', userInfo.ssoid);
                } else if (!(window as any).grx && !(window as any).isGrxLoaded) {
                  document.addEventListener('ready', () => {
                    if ((window as any).grx && userInfo.ssoid) {
                      (window as any).grx('userId', userInfo.ssoid);
                    }
                  });
                }

                // Dispatch login check event
                document.dispatchEvent(new Event('loginCheck'));

                // Fire analytics tracking event
                // Note: objAnalytics.fireTrackingEvent is not available, skipping for now
                // You can add analytics tracking here if needed

                // Save logs

                if (callback) callback(res);
              } else {
                this.store.dispatch(clearUserInfo());
                if (callback) callback(res);
              }
            },
            true // forceUpdate parameter - forces refresh of user details
          );
        } else {
          // User not logged in
          this.handleNotLoggedIn();
          if (callback) callback(response);
        }
      });
    } catch (error) {
      console.error('[JSSO Service] ❌ Error in getUserDetailOptForced:', error);
      this.handleNotLoggedIn();
      if (callback) callback({ status: 'ERROR', error });
    }
  }

  // Handle user detail response - replicates getUserDetailHandler()
  async getUserDetailHandler(checkReferer: boolean): Promise<void> {
    console.log('[JSSO Service] 🔄 getUserDetailHandler called, checkReferer:', checkReferer);
    const state = this.store.getState();
    const jssoAuth = state.jssoAuth;

    console.log('[JSSO Service] 📋 User state:', {
      hasSsoid: !!jssoAuth.userInfo.ssoid,
      hasLoginId: !!jssoAuth.userInfo.loginId,
      isGuestLogin: jssoAuth.isGuestLogin,
    });

    if (jssoAuth.userInfo.ssoid || jssoAuth.userInfo.loginId) {
      if (checkReferer) {
        console.log('[JSSO Service] 🔄 User logged in with referer, calling afterLogin...');
        // Handle after login flow
        await this.afterLogin();
      } else {
        console.log('[JSSO Service] 🔐 User logged in, getting permissions...');
        // Get permissions
        await this.getPermissionsOpt();
      }
    } else if (checkReferer && jssoAuth.isGuestLogin) {
      console.log('[JSSO Service] 👤 Guest login detected, calling afterGuestLogin...');
      await this.afterGuestLogin();
    } else {
      console.log('[JSSO Service] 📢 Dispatching loginCheck and loginStatus events');
      document.dispatchEvent(new Event('loginCheck'));
      document.dispatchEvent(new Event('loginStatus'));
    }
  }

  // Get permissions - replicates getPermissionsOpt()
  async getPermissionsOpt(callback?: (response?: any) => void): Promise<void> {
    console.log('[JSSO Service] 🔐 getPermissionsOpt called');
    const state = this.store.getState();
    const config = state.config;
    const jssoAuth = state.jssoAuth;

    try {
      const ticketId = CookieUtils.readCookie('TicketId') || jssoAuth.ticketId;
      const ssoid = CookieUtils.readCookie('ssoid') || jssoAuth.userInfo.ssoid || '';
      const deviceid = CookieUtils.readCookie('_grx') || '';

      console.log('[JSSO Service] 📋 Permission request params:', {
        hasTicketId: !!ticketId,
        hasSsoid: !!ssoid,
        hasDeviceid: !!deviceid,
      });

      if (!ssoid) {
        console.warn('[JSSO Service] ⚠️ No SSOID found, cannot fetch permissions');
        return;
      }

      // Get productCode from planparams or config
      const planparams = (window as any).planparams;
      let productCode = '';
      let merchantCode = config.merchantCode;
      
      try {
        productCode = planparams?.productCode || '';
        if (!merchantCode) {
          if (planparams?.product) {
            merchantCode = planparams.product;
          } else if (localStorage.getItem('planparams')) {
            const storedPlanparams = JSON.parse(localStorage.getItem('planparams') || '{}');
            merchantCode = storedPlanparams.product || '';
          }
        }
      } catch (e) {
        console.error('[JSSO Service] ❌ Error parsing planparams:', e);
      }

      // Default to 'ET' if merchantCode is still missing
      if (!merchantCode) {
        console.warn('[JSSO Service] ⚠️ Missing merchantCode, defaulting to ET');
        merchantCode = 'ET';
      }

      // Use defaults if config values are missing
      const clientId = config.clientId || 'w2a8e883ec676f417520f422068a4741';
      const appCode = config.appCode || 'd8bf11298a038d8f20be2c4486c3c728';
      const objAuthDomain = config.objAuthDomain || 'qa-oauth';

      if (!clientId || !appCode || !objAuthDomain) {
        console.error('[JSSO Service] ❌ Missing required config:', {
          hasClientId: !!clientId,
          hasAppCode: !!appCode,
          hasObjAuthDomain: !!objAuthDomain,
        });
        if (typeof callback === 'function') {
          callback({ error: 'Missing required configuration', status: 'ERROR', code: 'MISSING_CONFIG' });
        }
        return;
      }

      const headers: Record<string, string> = {
         Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
        'x-client-id': clientId,
        'x-device-id': deviceid || '',
        'x-sso-id': ssoid,
        'x-site-app-code': appCode,
        'X-TICKET-ID': ticketId,
      };
     console.log('headers', headers);
      const oauthUrl = `https://${objAuthDomain}.economictimes.indiatimes.com/auth/${merchantCode}/userToken?grantType=refresh_token`;
      
      console.log('[JSSO Service] 🌐 Fetching permissions from:', oauthUrl);
      
      // Validate URL
      try {
        new URL(oauthUrl);
      } catch (urlError) {
        console.error('[JSSO Service] ❌ Invalid URL:', oauthUrl, urlError);
        if (typeof callback === 'function') {
          callback({ error: 'Invalid URL', status: 'ERROR', code: 'INVALID_URL' });
        }
        return;
      }

      let response: Response;
      try {
        console.log('[JSSO Service] 📤 Sending fetch request...');
        response = await fetch(oauthUrl, {
          method: 'GET',
          headers: headers,
          credentials: 'include',
        });
        console.log('[JSSO Service] 📥 Fetch response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });
      } catch (fetchError) {
        console.error('[JSSO Service] ❌ Network error fetching permissions:', fetchError);
        if (typeof callback === 'function') {
          callback({ error: 'Network error', status: 'ERROR', code: 'NETWORK_ERROR' });
        }
        return;
      }

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        console.error('[JSSO Service] ❌ HTTP error:', response.status, response.statusText);
        try {
          const errorRes = await response.json();
          if (errorRes.code === '400') {
            const loadingLayer = document.getElementById('loading_layer');
            if (loadingLayer) {
              loadingLayer.style.display = 'none';
            }
          }
          if (typeof callback === 'function') {
            callback(errorRes);
          }
        } catch (parseError) {
          console.error('[JSSO Service] ❌ Error parsing error response:', parseError);
          if (typeof callback === 'function') {
            callback({ error: `HTTP ${response.status}: ${response.statusText}`, status: 'ERROR', code: response.status.toString() });
          }
        }
        return;
      }

      let res: any;
      try {
        res = await response.json();
        console.log('[JSSO Service] 📥 Permissions response parsed:', {
          code: res.code,
          hasData: !!res.data,
          hasProductDetails: !!res.data?.productDetails,
        });
      } catch (jsonError) {
        console.error('[JSSO Service] ❌ Error parsing JSON response:', jsonError);
        if (typeof callback === 'function') {
          callback({ error: 'Invalid JSON response', status: 'ERROR', code: 'JSON_PARSE_ERROR' });
        }
        return;
      }

      if (res && res.data) {
        console.log('[JSSO Service] ✅ Permissions data received, processing...');
        // Update OTR token if available
        if (res.data.token) {
          CookieUtils.removeCookie('OTR');
          CookieUtils.setCookie('OTR', res.data.token, 3600 * 24 * 30);
        }

        // Set login state
        this.store.dispatch(setUserInfo({ ...jssoAuth.userInfo, isLogged: true }));

        // Find product by productCode
        const productDetails = res.data.productDetails;
        if (productDetails && productDetails.length > 0) {
          // Find product by matching productCode
          const prodIndex = productDetails.findIndex(
            (item: any) => item.productCode === productCode
          );

          if (prodIndex > -1) {
            const productSelected = productDetails[prodIndex];

            // Set permissions in Redux
            this.store.dispatch(setPermissions({
              permissions: productSelected.permissions || [],
              accessibleFeatures: productSelected.accessibleFeatures || [],
            }));

            this.store.dispatch(setPermissionObj(res));

            // Determine user type
            const userType = this.getUserType(productSelected.permissions || []);
            this.store.dispatch(setUserType(userType));

            // Update session storage and Redux for analytics
            SessionStorageUtils.updateSessionStorage({
              dimension147: userType,
              dimension143: productSelected.accessibleFeatures?.join(', ') || '',
            }, 'updateGAEvents');

            SessionStorageUtils.updateSessionStorage({
              subscription_status: userType,
            }, 'updateCSEvents');

            this.store.dispatch(updateGAEvents({
              dimension147: userType,
              dimension143: productSelected.accessibleFeatures?.join(', ') || '',
            }));

            this.store.dispatch(updateCSEvents({
              subscription_status: userType,
            }));

            if (!productSelected.subscribed) {
              SessionStorageUtils.updateSessionStorage({
                subscription_type: 'free',
              }, 'updateCSEvents');
              this.store.dispatch(updateCSEvents({
                subscription_type: 'free',
              }));
            }

            if (productSelected.subscriptionDetail) {
              this.store.dispatch(setSubscriptionDetails(productSelected.subscriptionDetail));
              const subscriptionType = productSelected.subscriptionDetail.userAcquisitionType
                ? productSelected.subscriptionDetail.userAcquisitionType.toLowerCase()
                : 'free';
              SessionStorageUtils.updateSessionStorage({
                subscription_type: subscriptionType,
              }, 'updateCSEvents');
              this.store.dispatch(updateCSEvents({
                subscription_type: subscriptionType,
              }));
            }

            // Set PRC cookie
            if (productSelected.prc) {
              CookieUtils.setCookie(
                `${merchantCode.toLowerCase()}prc`,
                productSelected.prc,
                3600 * 24 * 30
              );
            }

            // Save logs
          } else {
            console.warn('[JSSO Service] ⚠️ Product not found for productCode:', productCode);
          }
        }

        // Call callback if provided
        if (typeof callback === 'function') {
          callback(res);
        }

        // Dispatch events
        document.dispatchEvent(new Event('checkOTRLoaded'));
      } else if (res.code === '400') {
        console.error('[JSSO Service] ❌ Error 400:', res);
        // Hide loading layer if exists
        const loadingLayer = document.getElementById('loading_layer');
        if (loadingLayer) {
          loadingLayer.style.display = 'none';
        }
        if (typeof callback === 'function') {
          callback(res);
        }
      } else {
        if (typeof callback === 'function') {
          callback(res);
        }
      }
    } catch (error) {
      console.error('[JSSO Service] ❌ Error in getPermissionsOpt:', error);
      if (typeof callback === 'function') {
        callback({ error, status: 'ERROR' });
      }
    }
  }

  // Get user type from permissions - replicates getUserType()
  getUserType(permissionsArr: string[]): string {
    let userType = 'New';

    if (permissionsArr.length > 0) {
      if (permissionsArr.some((str) => str.includes('expired_subscription'))) {
        userType = 'expired';
      } else if (
        permissionsArr.some((str) => str.includes('subscribed')) &&
        permissionsArr.some((str) => str.includes('cancelled_subscription')) &&
        permissionsArr.some((str) => str.includes('can_buy_subscription'))
      ) {
        userType = 'trial';
      } else if (permissionsArr.some((str) => str.includes('cancelled_subscription'))) {
        userType = 'cancelled';
      } else if (
        permissionsArr.some((str) => str.includes('active_subscription')) ||
        permissionsArr.some((str) => str.includes('subscribed'))
      ) {
        userType = 'Paid';
      } else if (permissionsArr.some((str) => str.includes('can_buy_subscription'))) {
        userType = 'free';
      }
    }

    return userType;
  }

  // Check permissions - replicates checkPermissions()
  checkPermissions(permissionsArr: string[]): boolean {
    if (permissionsArr.length > 0) {
      if (permissionsArr.indexOf('group_subscription') !== -1) {
        this.store.dispatch(setIsGroupUser(true));
        return false;
      }

      const filteredPermissions = permissionsArr.filter((e) => e !== 'etadfree_can_buy_subscription');

      if (filteredPermissions.some((str) => str.includes('expired_subscription'))) {
        return false;
      } else if (
        filteredPermissions.some((str) => str.includes('can_buy_subscription')) &&
        filteredPermissions.some((str) => str.includes('can_renew_subscription'))
      ) {
        const config = this.store.getState().config;
        if ((window as any).planparams?.appVariant === 'epaper') {
          return false;
        }
        if ((window as any).planparams?.planType === 'renew') {
          return false;
        }
        if (config.merchantCode === 'ET') {
          return false;
        }
        return true;
      } else if (filteredPermissions.some((str) => str.includes('can_buy_subscription'))) {
        return false;
      } else {
        if (filteredPermissions.some((str) => str.includes('subscribed'))) {
          const config = this.store.getState().config;
          if (config.merchantCode === 'ET') {
            return false;
          }
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  // After login handler - replicates afterLogin()
  async afterLogin(): Promise<void> {
    const state = this.store.getState();
    const jssoAuth = state.jssoAuth;

    if (!jssoAuth.userInfo.primaryEmail && !jssoAuth.userInfo.loginId) {
      return;
    }

    const selectedPlan = sessionStorage.getItem('et_plans_selectedPlan');
    if (selectedPlan) {
      const plan = JSON.parse(selectedPlan);
      await this.getPermissionsOpt();

      const eligibleToUpgrade = this.checkPermissions(jssoAuth.permissionsArr);
      if (eligibleToUpgrade) {
        const config = this.store.getState().config;
        const pathname = window.location.pathname;
        if (
          pathname.indexOf('/plans_success') === -1 &&
          (pathname.indexOf('/plans') > -1 ||
            pathname.indexOf('/women') > -1 ||
            pathname.indexOf('/student') > -1) &&
          config.merchantCode !== 'TH'
        ) {
          const search = window.location.search;
          if (search) {
            window.location.href = `/${config.merchantCode}/renew${search}&source=plan`;
          } else {
            window.location.href = `/${config.merchantCode}/renew?source=plan`;
          }
        }
      } else if (plan) {
        // Handle transaction initiation
        // This would call initiateTransaction() - not implemented here as it's payment-specific
      }

      document.dispatchEvent(new Event('checkOTRLoaded'));
    }
  }

  // After guest login handler - replicates afterGuestLogin()
  async afterGuestLogin(): Promise<void> {
    const state = this.store.getState();
    const config = state.config;
    const jssoAuth = state.jssoAuth;

    const guestEmail = jssoAuth.guestEmail;
    const guestMobile = jssoAuth.guestMobile;

    SessionStorageUtils.updateSessionStorage(
      {
        guestLogin: true,
        email: guestEmail,
        mobileNumber: guestMobile,
      },
      'et_plans_selectedPlan'
    );

    let url = `${config.subsDomain}/subscription/merchant/${config.merchantCode}/product/${(window as any).planparams?.productCode}/subscriptionDetail?`;

    if (guestMobile) {
      url += `mobileNumber=${guestMobile}`;
    } else if (guestEmail) {
      url += `email=${guestEmail}`;
    } else {
      console.error('Neither email nor mobile number available for guest login');
      return;
    }

    try {
      const response = await fetch(url, { method: 'GET' });
      const res = await response.json();

      if (!res.existingSubscriber || res.status === 'EXPIRED') {
        // Handle transaction initiation
        // This would call initiateTransaction() - not implemented here
      } else {
        window.location.href = `/${config.merchantCode}/error?errorType=guestUserActive&${guestMobile ? 'mobile' : 'email'}=${guestMobile || guestEmail}`;
      }
    } catch (error) {
      console.error('Error in afterGuestLogin:', error);
    }
  }

  // Handle not logged in state
  private handleNotLoggedIn(): void {
    console.log('[JSSO Service] 🚫 handleNotLoggedIn called - clearing user info');
    const state = this.store.getState();
    const config = state.config;

    this.store.dispatch(clearUserInfo());
    console.log('[JSSO Service] 🧹 User info cleared');
    CookieUtils.setCookie('ssoid', '', -1000);
    CookieUtils.setCookie('TicketId', '', -1000);
    CookieUtils.setCookie('OTR', '', -1000);

    SessionStorageUtils.updateSessionStorage({ dimension146: 'NONLOGGEDIN' }, 'updateGAEvents');
    SessionStorageUtils.updateSessionStorage({ loggedin: 'n' }, 'updateCSEvents');
    this.store.dispatch(updateGAEvents({ dimension146: 'NONLOGGEDIN' }));
    this.store.dispatch(updateCSEvents({ loggedin: 'n' }));

    // Check for guest login
    const guestId = sessionStorage.getItem('et_guest_id');
    if (guestId) {
      const guestValue = guestId.trim();
      const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegEx = /^\d{10}$/;

      if (mobileRegEx.test(guestValue)) {
        this.store.dispatch(setGuestLogin({ mobile: guestValue }));
      } else if (emailRegEx.test(guestValue)) {
        this.store.dispatch(setGuestLogin({ email: guestValue }));
      }
    }

    // Handle upgrade/renew redirects
    const pathname = window.location.pathname;
    if (pathname.indexOf('/upgrade') > -1 || pathname.indexOf('/renew') > -1) {
      window.location.href = `${config.loginUrl}?ref=${config.merchantCode}`;
    }

    document.dispatchEvent(new Event('loginCheck'));
    document.dispatchEvent(new Event('loginStatus'));
  }

  // Get verified mobile - replicates getVerifiedMobile()
  getVerifiedMobile(): { verified: boolean; mobileNumber: string | null } | null {
    const state = this.store.getState();
    const userInfo = state.jssoAuth.userInfo;

    if (userInfo.mobileList && Object.keys(userInfo.mobileList).length > 0) {
      const mobileList = userInfo.mobileList;
      const verifiedNumber = Object.entries(mobileList).find(
        ([, value]) => value === 'Verified'
      );

      if (verifiedNumber) {
        return {
          verified: true,
          mobileNumber: verifiedNumber[0],
        };
      } else {
        const unverifiedEntry = Object.entries(mobileList).find(
          ([, value]) => value === 'Unverified'
        );
        return {
          verified: false,
          mobileNumber: unverifiedEntry ? unverifiedEntry[0] : null,
        };
      }
    }

    return null;
  }

  // Verify login - replicates verifyLogin()
  async verifyLogin(): Promise<void> {
    console.log('[JSSO Service] ✅ verifyLogin called');
    const state = this.store.getState();
    const jssoAuth = state.jssoAuth;

    try {
      // @ts-ignore
      if (typeof JssoCrosswalk === 'undefined') {
        console.error('[JSSO Service] ❌ JssoCrosswalk is not available for verifyLogin');
        return;
      }
      
      console.log('[JSSO Service] 🏗️ Creating JssoCrosswalk instance for verifyLogin...');
      // @ts-ignore
      const jsso = new JssoCrosswalk(jssoAuth.channelMerchant, jssoAuth.channelPlatform);
      console.log('[JSSO Service] ✅ JssoCrosswalk instance created');

      return new Promise<void>((resolve) => {
        console.log('[JSSO Service] 📞 Calling jsso.getValidLoggedInUser...');
        jsso.getValidLoggedInUser((response: any) => {
          console.log('[JSSO Service] 📥 verifyLogin response:', {
            status: response.status,
            hasData: !!response.data,
          });
          if (response.status === 'SUCCESS') {
            console.log('[JSSO Service] ✅ Login verified successfully');
            this.store.dispatch(setTicketId(response.data.ticketId));
            this.store.dispatch(setPermissionObj({ response }));

            if (CookieUtils.readCookie('TicketId') !== response.data.ticketId) {
              CookieUtils.setCookie('TicketId', response.data.ticketId, 3600 * 24 * 30);
            }

            if (response.data.ticketId === jssoAuth.userInfo.ticketId) {
              this.afterLoginProcess();
            } else {
              this.setUserData(response);
            }
          } else {
            this.handleNotLoggedIn();
            const guestId = sessionStorage.getItem('et_guest_id');
            if (!guestId) {
              this.afterLoginProcess();
            }
          }

          document.dispatchEvent(new Event('loginStatus'));
          resolve();
        });
      });
    } catch (e) {
      this.store.dispatch(clearUserInfo());
      this.afterLoginProcess();
    }
  }

  // Set user data - replicates setUserData()
  private async setUserData(response: any): Promise<void> {
    const state = this.store.getState();
    const jssoAuth = state.jssoAuth;

    // @ts-ignore
    const jsso = new JssoCrosswalk(jssoAuth.channelMerchant, jssoAuth.channelPlatform);

    return new Promise<void>((resolve) => {
      jsso.getUserDetails((responseDetails: any) => {
        if (responseDetails.status === 'SUCCESS') {
          const data = responseDetails.data;
          const userInfo = {
            ...data,
            isLogged: true,
            ticketId: response?.data?.ticketId,
            identifier: response?.data?.identifier,
          };

          this.store.dispatch(setUserInfo(userInfo));

          if (userInfo.ssoid) {
            CookieUtils.setCookie('ssoid', userInfo.ssoid, 3600 * 24 * 30);
          }
          if (userInfo.ticketId) {
            CookieUtils.setCookie('TicketId', userInfo.ticketId, 3600 * 24 * 30);
          }
        } else {
          this.store.dispatch(clearUserInfo());
        }

        this.afterLoginProcess();
        resolve();
      });
    });
  }

  // After login process - replicates afterLoginProcess()
  private afterLoginProcess(): void {
    console.log('[JSSO Service] 🔄 afterLoginProcess called');
    const state = this.store.getState();
    this.store.dispatch(setAfterLoginProcessDone(1));

    const callbackCount = state.jssoAuth.afterLoginStack.length;
    console.log('[JSSO Service] 📞 Executing', callbackCount, 'after-login callbacks');
    
    state.jssoAuth.afterLoginStack.forEach((callback, index) => {
      if (typeof callback === 'function') {
        console.log('[JSSO Service] ▶️ Executing callback', index + 1, 'of', callbackCount);
        callback();
      }
    });

    this.store.dispatch(clearAfterLoginStack());
    console.log('[JSSO Service] ✅ After-login process complete');
  }

  // Add after login callback - replicates afterLoginCall()
  afterLoginCall(cb: () => void): void {
    console.log('[JSSO Service] 📝 afterLoginCall called');
    const state = this.store.getState();
    if (typeof cb === 'function') {
      this.store.dispatch(addAfterLoginCallback(cb));
      if (state.jssoAuth.afterLoginProcessDone === 1) {
        console.log('[JSSO Service] ✅ Login process already done, executing callback immediately');
        cb();
      } else {
        console.log('[JSSO Service] ⏳ Login process not done, callback queued');
      }
    }
  }

  // Remove cookies - replicates removeCookies()
  removeCookies(): void {
    const sessionCookies = [
      'FBOOK_ID', 'FBOOK_NAME', 'FBOOK_EMAIL', 'FBOOK_LOCATION', 'FBOOK_IMAGE',
      'TWEET_ID', 'TWEET_NAME', 'TWEET_LOCATION', 'TWEET_IMAGE',
      'articleid', 'txtmsg', 'tflocation', 'tfemail', 'setfocus', 'fbcheck', 'twtcheck',
      'usercomt', 'ifrmval', 'frmbtm', 'FaceBookEmail', 'Fbimage', 'Fboauthid',
      'Fbsecuritykey', 'Twimage', 'TwitterUserName', 'Twoauthid', 'Twsecuritykey',
      'ssoid', 'fbookname', 'CommLogP', 'CommLogU', 'fbooklocation', 'fbname',
      'fbLocation', 'fbimage', 'fbOAuthId', 'MSCSAuth', 'MSCSAuthDetail', 'MSCSAuthDetails',
      'ssosigninsuccess', 'peuuid', 'pfuuid', 'ticket', 'MSCSAuthID', 'et_subs',
      'TicketId', 'OTR', 'OID', 'OTP', 'etprc', 'etipr',
      'jsso_crosswalk_tksec_et-wap', 'jsso_crosswalk_ssec_et-wap',
      'jsso_crosswalk_daily_et-wap', 'ssec', 'jsso_crosswalk_tksec_epaperet',
    ];

    sessionCookies.forEach((cookieName) => {
      CookieUtils.removeCookie(cookieName);
    });

  }

  // Logout - replicates logout()
  async logout(cb?: () => void): Promise<void> {
    console.log('[JSSO Service] 🚪 logout called');
    const state = this.store.getState();
    const jssoAuth = state.jssoAuth;
    const config = state.config;

    try {
      // Ensure JSSO SDK is loaded before creating instance
      // @ts-ignore
      if (typeof JssoCrosswalk === 'undefined') {
        console.error('[JSSO Service] ❌ JssoCrosswalk is not available');
        // Still proceed with cleanup even if SDK is not available
        this.performLogoutCleanup(cb);
        return;
      }

      console.log('[JSSO Service] 🏗️ Creating JssoCrosswalk instance for logout...');
      // @ts-ignore
      const jsso = new JssoCrosswalk(
        jssoAuth.channelMerchant || config.channelType || config.merchantCode,
        jssoAuth.channelPlatform || ''
      );
      console.log('[JSSO Service] ✅ JssoCrosswalk instance created');

      return new Promise<void>((resolve) => {
        console.log('[JSSO Service] 📞 Calling jsso.signOutUser...');
        jsso.signOutUser((response: any) => {
          console.log('[JSSO Service] 📥 signOutUser response:', response);
          try {
            // Clear session storage items
            console.log('[JSSO Service] 🧹 Performing logout cleanup...');
            this.performLogoutCleanup(cb);
            console.log('[JSSO Service] ✅ Logout cleanup complete');
          } catch (e) {
            console.error('[JSSO Service] ❌ Error during logout cleanup:', e);
          }

          resolve();
        });
      });
    } catch (e) {
      console.error('[JSSO Service] ❌ Error in logout:', e);
      // Still perform cleanup even if signOutUser fails
      try {
        this.performLogoutCleanup(cb);
      } catch (cleanupError) {
        console.error('[JSSO Service] ❌ Error during logout cleanup:', cleanupError);
      }
    }
  }

  // Perform logout cleanup - clears storage and cookies
  private performLogoutCleanup(cb?: () => void): void {
    try {
      // Check if logout is from plans page
      const planparams = (window as any).planparams;
      if (planparams?.page === 'plans') {
        sessionStorage.setItem('logout', 'logout_planPage');
      } else {
        sessionStorage.removeItem('uniqueID');
      }

      // Clear Redux state
      this.store.dispatch(clearUserInfo());

      // Clear session storage items
      const sessionStorageItems = [
        'buy_customDimension',
        'epaper_customDimension',
        'grxMapping',
        'loginEventCheck',
        'grxUserData',
        'updateGAEvents',
        'updateCSEvents',
        'ga4Obj',
        'ga4LoginData',
        'grxLoginData',
        'et_plans_selectedPlan',
        'uniqueID',
        'revampedBenefitsDesign',
        'setBExp',
        'topLoginClick',
        'paidTrial',
        'autoMandate',
        'marketsPlanPage',
        'topLogin',
      ];

      sessionStorageItems.forEach((item) => {
        sessionStorage.removeItem(item);
      });

      // Clear localStorage
      localStorage.removeItem('planparams');
        
      // Remove cookies
      this.removeCookies(); 
      if (typeof cb === 'function') {
        cb();
      }
    } catch (e) {
      console.error('[JSSO Service] ❌ Error in logout cleanup:', e);
      if (typeof cb === 'function') {
        cb();
      }
    }
  }
}

// Export singleton instance - use lazy initialization to avoid circular dependency
// The issue is that store might not be initialized when this module loads
// So we delay the instantiation until the first property access
let jssoServiceInstance: JSSOService | null = null;

function createJssoService(): JSSOService {
  if (!jssoServiceInstance) {
    jssoServiceInstance = new JSSOService();
  }
  return jssoServiceInstance;
}

// Use a Proxy to delay instantiation until first access
export const jssoService = new Proxy({} as JSSOService, {
  get(_target, prop) {
    const instance = createJssoService();
    const value = instance[prop as keyof JSSOService];
    // If it's a method, bind it to the instance
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
  set(_target, prop, value) {
    const instance = createJssoService();
    (instance as any)[prop] = value;
    return true;
  },
}) as JSSOService;

// Export utilities
export { CookieUtils, SessionStorageUtils };

