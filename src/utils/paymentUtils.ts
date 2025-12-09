/**
 * Payment utilities for handling subscription payment flow
 * Uses Redux state instead of window objects
 */

import { AppDispatch, RootState } from '../store';
import { getCookie } from './cookieUtils';

// Plan interface based on the payment handler logic
export interface PaymentPlan {
  planCode: string;
  planName?: string;
  direct?: boolean;
  isExtend?: boolean;
  isRenew?: boolean;
  autoRenew?: number;
  siConsent?: boolean;
  dealCode?: string;
  flatDiscount?: string;
  recurring?: string;
  planPeriod?: string;
  planPeriodUnit?: string;
  finalPlanPrice?: number;
  currency?: string;
  mobileNumber?: string;
  abTestKey?: {
    set?: string;
  };
  udf6?: string;
  udf7?: string;
  udf8?: string;
  checkReferer?: boolean;
}

// Plan params interface
interface PlanParams {
  product?: string;
  productCode?: string;
  page?: string;
  CLIENT_ID?: string;
  appCode?: string;
  msid?: string;
  meta?: string;
  acqSource?: string;
  acqSubSource?: string;
  subscriberId?: string;
  platform?: string;
}

// Geo info interface
interface GeoInfo {
  Continent?: string;
  CountryCode?: string;
  region_code?: string;
}

// User sources interface
interface UserSources {
  [key: string]: any;
}

/**
 * Update session storage with new values
 */
export const updateSessionStorage = (value: Record<string, any>, sessionItem: string): void => {
  const stored = sessionStorage.getItem(sessionItem);
  if (stored !== null) {
    const prevData = JSON.parse(stored);
    Object.keys(value).forEach((key) => {
      prevData[key] = value[key];
    });
    sessionStorage.setItem(sessionItem, JSON.stringify(prevData));
  } else {
    sessionStorage.setItem(sessionItem, JSON.stringify({}));
    updateSessionStorage(value, sessionItem);
  }
};

/**
 * Get planparams from window or localStorage
 */
const getPlanParams = (): PlanParams => {
  try {
    if ((window as any).planparams) {
      return (window as any).planparams;
    }
    const stored = localStorage.getItem('planparams');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error getting planparams:', e);
  }
  return {};
};

/**
 * Get geo info from window
 */
const getGeoInfo = (): GeoInfo => {
  try {
    return (window as any).geoinfo || {};
  } catch (e) {
    console.error('Error getting geo info:', e);
  }
  return {};
};

/**
 * Get user sources string (simplified version)
 */
const getUserSourcesString = (userSources: UserSources): string => {
  // Simplified implementation - adjust based on actual requirements
  try {
    const acqSourcesData = JSON.parse(sessionStorage.getItem('acqSourcesData') || '{}');
    return acqSourcesData.userSourcesString || 'not_defined';
  } catch (e) {
    return 'not_defined';
  }
};

/**
 * Update user sources (simplified version)
 */
const updateUserSources = (): UserSources => {
  // Simplified implementation - adjust based on actual requirements
  try {
    return JSON.parse(sessionStorage.getItem('acqSourcesData') || '{}');
  } catch (e) {
    return {};
  }
};

/**
 * Get verified mobile from user info
 */
const getVerifiedMobile = (userInfo: any): { mobileNumber: string; verified: boolean } | null => {
  if (userInfo?.mobileList) {
    const verified = userInfo.mobileList.Verified;
    if (verified && verified.mobile) {
      return { mobileNumber: verified.mobile, verified: true };
    }
  }
  return null;
};

/**
 * Get verified email from user info
 */
const getVerifiedEmail = (userInfo: any): { email: string; verified: boolean } | null => {
  if (userInfo?.emailList) {
    const verified = userInfo.emailList.Verified;
    if (verified && verified.email) {
      return { email: verified.email, verified: true };
    }
  }
  if (userInfo?.primaryEmail) {
    return { email: userInfo.primaryEmail, verified: true };
  }
  return null;
};

/**
 * Show/hide loading layer
 */
const setLoadingLayer = (show: boolean): void => {
  const loadingLayer = document.getElementById('loading_layer');
  if (loadingLayer) {
    loadingLayer.style.display = show ? 'block' : 'none';
  }
};

/**
 * Save logs (simplified - can be enhanced with proper logging service)
 */
const saveLogs = (logData: { type: string; res: string; msg?: string; [key: string]: any }): void => {
};

/**
 * Main entry point for continue to pay flow
 */
export const continueToPay = (
  plan: PaymentPlan,
  dispatch: AppDispatch,
  getState: () => RootState
): void => {
  setLoadingLayer(true);

  if (sessionStorage.getItem('et_plans_selectedPlan') && sessionStorage.getItem('et_plans_selectedPlan') !== null) {
    updateSessionStorage(plan, 'et_plans_selectedPlan');
  } else {
    sessionStorage.setItem('et_plans_selectedPlan', JSON.stringify(plan));
  }

  plan.direct ? paymentHandlerDirect(plan, dispatch, getState) : paymentHandler(plan, dispatch, getState);
};

/**
 * Payment handler for direct flow
 */
const paymentHandlerDirect = (
  plan: PaymentPlan,
  dispatch: AppDispatch,
  getState: () => RootState
): void => {
  const state = getState();
  const { jssoAuth, config } = state;
  const userInfo = jssoAuth.userInfo;
  const isLoggedIn = jssoAuth.isLogin;

  if (isLoggedIn && userInfo) {
    initiateTransactionDirect(plan, dispatch, getState);
  } else {
    // User not logged in - redirect to login
    setLoadingLayer(false);
    updateSessionStorage({ checkReferer: true }, 'et_plans_selectedPlan');

    const planparams = getPlanParams();
    if (planparams.page === 'plans' || planparams.page === 'plans_direct') {
      sessionStorage.setItem('plans_guest_allow', 'true');
    }

    // Redirect to login page
    if (config.merchantCode === 'TH') {
      window.location.href = 'https://timeshealthplus.com/clogin.cms';
    } else {
      window.location.href = `${config.loginUrl}?ref=${planparams.product || config.merchantCode || 'ET'}`;
    }
  }
};

/**
 * Payment handler for regular flow
 */
const paymentHandler = (
  plan: PaymentPlan,
  dispatch: AppDispatch,
  getState: () => RootState
): void => {
  const state = getState();
  const { jssoAuth, config } = state;
  const userInfo = jssoAuth.userInfo;
  const isLoggedIn = jssoAuth.isLogin;

  if (isLoggedIn && userInfo) {
    setTimeout(() => {
      initiateTransaction(plan, dispatch, getState);
    }, 2000);
  } else {
    // User not logged in - redirect to login
    setLoadingLayer(false);
    updateSessionStorage({ checkReferer: true }, 'et_plans_selectedPlan');

    const planparams = getPlanParams();
    if (planparams.page === 'plans') {
      sessionStorage.setItem('plans_guest_allow', 'true');
    }

    // Redirect to login page
    if (config.merchantCode === 'TH') {
      window.location.href = 'https://timeshealthplus.com/clogin.cms';
    } else {
      window.location.href = `${config.loginUrl}?ref=${planparams.product || config.merchantCode || 'ET'}`;
    }
  }
};

/**
 * Initiate transaction API call
 */
const initiateTransaction = (
  plan: PaymentPlan,
  dispatch: AppDispatch,
  getState: () => RootState
): void => {
  const state = getState();
  const { jssoAuth, config } = state;
  const userInfo = jssoAuth.userInfo;
  const planparams = getPlanParams();
  const geoInfo = getGeoInfo();

  const extension = plan?.isExtend ? '_Extend' : plan?.isRenew ? '_Renew' : '';

  const metaValue =
    planparams.meta === 'not_defined'
      ? plan.abTestKey?.set || 'not_defined'
      : plan.abTestKey
      ? `${plan.abTestKey.set}_${planparams.meta}`
      : planparams.meta || 'not_defined';

  const userSources = updateUserSources();
  let userSourcesString = getUserSourcesString(userSources);

  if (userSourcesString === '' || userSourcesString === '-not_defined') {
    userSourcesString = 'not_defined';
  }

  const data: any = {
    autoRenew: plan.autoRenew ? plan.autoRenew : 0,
    siConsent: plan.siConsent ? plan.siConsent : false,
    pg: 'JUSPAY',
    dealCode: plan.dealCode ? plan.dealCode : '',
    acqSource: (() => {
      if (planparams && planparams.acqSource !== 'not_defined') {
        return planparams.acqSource;
      }
      const acqSourcesData = JSON.parse(sessionStorage.getItem('acqSourcesData') || '{}');
      return acqSourcesData.acqSource || 'not_defined';
    })(),
    acqSubSource: (() => {
      if (planparams && planparams.acqSubSource !== 'not_defined') {
        return planparams.acqSubSource;
      }
      const acqSourcesData = JSON.parse(sessionStorage.getItem('acqSourcesData') || '{}');
      return acqSourcesData.acqSubSource || 'not_defined';
    })(),
    storyId: planparams ? planparams.msid || 'not_defined' : 'not_defined',
    gdpr: geoInfo?.Continent === 'EU' ? true : false,
    ccpa: geoInfo?.CountryCode === 'US' && geoInfo?.region_code === 'CA' ? true : false,
    ...(plan.udf6 ? { udf6: plan.udf6 } : {}),
    ...(plan.udf7 ? { udf7: plan.udf7 } : {}),
    ...(plan.udf8 ? { udf8: plan.udf8 } : {}),
  };

  const merchantCode = (planparams.product || config.merchantCode || 'ET').toUpperCase();

  if (merchantCode === 'TH') {
    const isMobileExist = getVerifiedMobile(userInfo);
    const isEmailExist = getVerifiedEmail(userInfo);

    if (isMobileExist != null && isMobileExist.verified) {
      data.userMobile = isMobileExist.mobileNumber;
    } else if (isEmailExist != null && isEmailExist.verified) {
      data.userEmail = isEmailExist.email;
    } else if (plan.mobileNumber) {
      data.userMobile = plan.mobileNumber;
    } else {
      window.location.href = 'https://buy.indiatimes.com/TH/error?errorType=failure';
      return;
    }

    if (planparams?.subscriberId) {
      data.subscriberId = planparams.subscriberId || '';
    }
  } else {
    if (userInfo && userInfo.primaryEmail && userInfo.primaryEmail != null) {
      data.userEmail = userInfo.primaryEmail;
    } else if (userInfo && userInfo.loginId && userInfo.loginId != null) {
      data.userMobile = userInfo.loginId;
    }
  }

  // Set the meta field based on the merchant code
  if (merchantCode === 'ET') {
    if (userSourcesString && metaValue) {
      data.meta = userSourcesString.substring(0, 150) + '-' + metaValue;
    } else {
      data.meta = userSourcesString.substring(0, 150) || metaValue;
    }
  } else {
    data.meta = metaValue;
  }

  if (plan.dealCode === '') {
    delete data.dealCode;
  }

  saveLogs({
    type: 'plansPage',
        res: `Merchant_${planparams.product || config.merchantCode || 'ET'} Initiate Transaction`,
    'Post Data: ': JSON.stringify(data),
  });

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CLIENT-ID': planparams.CLIENT_ID || config.clientId,
    'X-SITE-APP-CODE': config.appCode,
    'X-Token': getCookie('OTR') || '',
  };

  const domain = config.subsDomain;
  const url = `${domain}/subscription/merchant/ET/product/ETPR/plan/${plan.planCode}/geoRegion/${geoInfo.CountryCode || 'IN'}/initiateTransaction`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
    credentials: 'include',
    signal: controller.signal,
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.resultUrl) {
        saveLogs({
          type: 'plansPage',
          res: 'success',
          msg:
            'Merchant_' +
            (planparams.product || config.merchantCode || 'ET') +
            ' Initiate Transaction Success InitTransactionId: ' +
            json?.initTransactionId +
            ' statusCode: ' +
            json?.statusCode,
        });

        window.location.href = json.resultUrl;
      } else if (json.code == 400) {
        saveLogs({
          type: 'plansPage',
          res: 'error',
          msg: 'Merchant_' + (planparams.product || config.merchantCode || 'ET') + ' Initiate Transaction Failed' + json?.message + 'Error Code: 400',
        });

        if (config.merchantCode === 'TH') {
          window.location.href = '/TH/dashboard';
        } else {
          window.location.href = `/${planparams.product || config.merchantCode || 'ET'}/upgrade${window.location.search}`;
        }
      } else if (json.errorCode == 5006 && json.invalidValue == 'dealCode') {
        saveLogs({
          type: 'plansPage',
          res: 'error',
          msg:
            'Merchant_' +
            (planparams.product || config.merchantCode || 'ET') +
            ' Initiate Transaction Failed' +
            json?.message +
            'Error Code: ' +
            json.errorCode +
            'Invalid Value: ' +
            json.invalidValue,
        });

        window.location.href = `/${planparams.product || config.merchantCode || 'ET'}/error?errorType=invalidDealCode`;
      } else {
        saveLogs({
          type: 'plansPage',
          res: 'error',
          msg:
            'Merchant_' +
            (planparams.product || config.merchantCode || 'ET') +
            ' Initiate Transaction Failed' +
            json?.message +
            'Error Code: ' +
            json?.errorCode,
        });

        window.location.href = `/${planparams.product || config.merchantCode || 'ET'}/error?errorType=failure`;
      }

      clearTimeout(timeoutId);
    })
    .catch((err) => {
      const errorDetails = {
        name: err.name,
        message: err.message,
        stack: err.stack,
        url: url,
        headers: headers,
      };

      saveLogs({
        type: 'plansPage',
        res: 'error',
        msg: 'Merchant_' + (planparams.product || config.merchantCode || 'ET') + ' Initiate Transaction Failed' + JSON.stringify(errorDetails),
      });

      if (err.name === 'AbortError') {
        window.location.href = `/${planparams.product || config.merchantCode || 'ET'}/error?errorType=timeout`;
      } else {
        window.location.href = `/${planparams.product || config.merchantCode || 'ET'}/error?errorType=failure`;
      }

    })
    .finally(() => {
      setLoadingLayer(false);
    });
};

/**
 * Initiate transaction direct API call
 */
const initiateTransactionDirect = (
  plan: PaymentPlan,
  dispatch: AppDispatch,
  getState: () => RootState
): void => {
  const state = getState();
  const { jssoAuth, config } = state;
  const userInfo = jssoAuth.userInfo;
  const planparams = getPlanParams();
  const geoInfo = getGeoInfo();

  const extension = plan?.isExtend ? '_Extend' : plan?.isRenew ? '_Renew' : '';
  const metaValue = planparams.meta ? planparams.meta : '';

  const userSources = updateUserSources();
  let userSourcesString = getUserSourcesString(userSources);

  if (userSourcesString === '' || userSourcesString === '-not_defined') {
    userSourcesString = 'not_defined';
  }

  const data: any = {
    autoRenew: plan.autoRenew ? plan.autoRenew : 0,
    siConsent: false,
    pg: 'JUSPAY',
    dealCode: plan.dealCode,
    acqSource: (() => {
      if (planparams && planparams.acqSource !== 'not_defined') {
        return planparams.acqSource;
      }
      const acqSourcesData = JSON.parse(sessionStorage.getItem('acqSourcesData') || '{}');
      return acqSourcesData.acqSource || 'not_defined';
    })(),
    acqSubSource: (() => {
      if (planparams && planparams.acqSubSource !== 'not_defined') {
        return planparams.acqSubSource;
      }
      const acqSourcesData = JSON.parse(sessionStorage.getItem('acqSourcesData') || '{}');
      return acqSourcesData.acqSubSource || 'not_defined';
    })(),
    meta: userSourcesString + '-' + metaValue,
    storyId: planparams ? planparams.msid || 'not_defined' : 'not_defined',
    ...(plan.udf6 ? { udf6: plan.udf6 } : {}),
    ...(plan.udf7 ? { udf7: plan.udf7 } : {}),
    ...(plan.udf8 ? { udf8: plan.udf8 } : {}),
  };

  if (userInfo && userInfo.primaryEmail && userInfo.primaryEmail != null) {
    data.userEmail = userInfo.primaryEmail;
  } else if (userInfo && userInfo.loginId && userInfo.loginId != null) {
    data.userMobile = userInfo.loginId;
  }

  const merchantCode = (planparams.product || config.merchantCode || 'ET').toUpperCase();

  // Set the meta field based on the merchant code
  if (merchantCode === 'ET') {
    if (userSourcesString && metaValue) {
      data.meta = userSourcesString.substring(0, 150) + '-' + metaValue;
    } else {
      data.meta = userSourcesString.substring(0, 150) || metaValue;
    }
  } else {
    data.meta = metaValue;
  }

  if (plan.dealCode === '') {
    delete data.dealCode;
  }

  if (planparams?.subscriberId) {
    data.subscriberId = planparams.subscriberId || '';
  }

  saveLogs({
    type: 'plansPage',
    res: `Merchant_${planparams.product || config.merchantCode || 'ET'} Initiate Transaction Direct`,
    'Post Data: ': JSON.stringify(data),
  });

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CLIENT-ID': planparams.CLIENT_ID || config.clientId,
    'X-SITE-APP-CODE': planparams.appCode || config.appCode,
    'X-Token': getCookie('OTR') || '',
  };

  const domain = config.subsDomain;
  const url = `${domain}/subscription/merchant/ET/product/ETPR/plan/${plan.planCode}/geoRegion/${geoInfo.CountryCode || 'IN'}/initiateTransaction`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
    credentials: 'include',
    signal: controller.signal,
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.resultUrl) {
        saveLogs({
          type: 'plansPage',
          res: 'success',
          msg: 'Initiate Transaction Direct Plan Page Id: ' + json?.initTransactionId + ' statusCode: ' + json?.statusCode,
        });

        window.location.href = json.resultUrl;
      } else if (json.code == 400) {
        // Handle 400 error
      } else if (json.errorCode == 5006 && json.invalidValue == 'dealCode') {
        saveLogs({ type: 'plansPage', res: 'error', msg: 'Initiate Transaction ' + json?.message });
        window.location.href = `/${planparams.product || config.merchantCode || 'ET'}/error?errorType=invalidDealCode`;
      } else {
        saveLogs({ type: 'plansPage', res: 'error', msg: 'Initiate Transaction ' + json?.message });
        window.location.href = `/${planparams.product || config.merchantCode || 'ET'}/error?errorType=failure`;
      }

      clearTimeout(timeoutId);
    })
    .catch((err) => {
      const errorDetails = {
        name: err.name,
        message: err.message,
        stack: err.stack,
        url: url,
        headers: headers,
      };

      saveLogs({
        type: 'plansPage',
        res: 'error',
        msg: 'Initiate Transaction Direct' + JSON.stringify(errorDetails),
      });

      if (err.name === 'AbortError') {
        window.location.href = `/${planparams.product || config.merchantCode || 'ET'}/error?errorType=timeout`;
      } else {
        window.location.href = `/${planparams.product || config.merchantCode || 'ET'}/error?errorType=failure`;
      }

    })
    .finally(() => {
      setLoadingLayer(false);
    });
};

