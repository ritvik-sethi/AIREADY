/**
 * Type declarations for JSSO Crosswalk SDK
 * This SDK is loaded dynamically from a CDN
 */

declare global {
  interface Window {
    JssoCrosswalk?: typeof JssoCrosswalk;
    planparams?: {
      product?: string;
      CLIENT_ID?: string;
      appCode?: string;
      platform?: string;
      page?: string;
      productCode?: string;
      isWebView?: boolean;
      acqSource?: string;
      acqSubSource?: string;
      msid?: string;
      meta?: string;
      planType?: string;
      appVariant?: string;
      [key: string]: any;
    };
    grx?: (method: string, event?: string, data?: any) => void;
    isGrxLoaded?: boolean;
    isGrxDimensionsLoaded?: boolean;
    isDimensionsLoaded?: boolean;
    isGaLoaded?: boolean;
    isGtmLoaded?: boolean;
    ga?: (...args: any[]) => void;
    dataLayer?: any[];
    customDimension?: Record<string, any>;
    ABEventString?: string;
    geoinfo?: {
      Continent?: string;
      CountryCode?: string;
      region_code?: string;
    };
    getCurrentActiveAB?: () => string;
  }
}

export interface JSSOResponse {
  status: 'SUCCESS' | 'FAILURE' | 'ERROR';
  data?: any;
  error?: string;
  errorMsg?: string;
}

export interface JSSOUserResponse extends JSSOResponse {
  data?: {
    ticketId: string;
    encTicket?: string;
    identifier: string;
    ssoid?: string;
  };
}

export interface JSSOUserDetailsResponse extends JSSOResponse {
  data?: {
    ssoid: string;
    primaryEmail: string;
    emailId: string;
    firstName: string;
    full_name?: string;
    loginId?: string;
    ticketId: string;
    identifier: string;
    emailList?: Record<string, string>;
    mobileList?: Record<string, string>;
    mobileData?: {
      Verified?: {
        mobile?: string;
        code?: string;
      };
    };
  };
}

export class JssoCrosswalk {
  constructor(channelMerchant: string, channelPlatform?: string);

  getValidLoggedInUser(callback: (response: JSSOUserResponse) => void): void;
  getUserDetails(callback: (response: JSSOUserDetailsResponse) => void, forceUpdate?: boolean): void;
  signOutUser(callback: (response: JSSOResponse) => void): void;
  updateProfilePic(file: File, callback: (response: JSSOResponse) => void): void;
  updateUserPermissions(
    locationPermission: number,
    notificationPermission: number,
    timesPoints: number,
    callback: (response: JSSOResponse) => void
  ): void;
  gpOneTapLogin(token: string, callback: (response: JSSOResponse) => void): void;
}

export {};

