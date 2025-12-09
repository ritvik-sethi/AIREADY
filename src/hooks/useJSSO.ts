import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { jssoService } from '../services/jssoService';
import {
  setUserInfo,
  clearUserInfo,
  setPermissions,
  setUserType,
} from '../store/slices/jssoAuthSlice';

/**
 * React hook for JSSO authentication
 * Provides access to JSSO state and methods
 */
export function useJSSO() {
  const dispatch = useAppDispatch();
  const jssoAuth = useAppSelector((state) => state.jssoAuth);
  const config = useAppSelector((state) => state.config);

  // Initialize JSSO on mount
  useEffect(() => {
    console.log('[useJSSO Hook] 🚀 useJSSO hook mounted, initializing JSSO...');
    jssoService.init().then(() => {
      console.log('[useJSSO Hook] ✅ JSSO initialization completed successfully');
    }).catch((error) => {
      console.error('[useJSSO Hook] ❌ Error initializing JSSO:', error);
    });
  }, []);

  return {
    // State
    userInfo: jssoAuth.userInfo,
    isLogin: jssoAuth.isLogin,
    isGuestLogin: jssoAuth.isGuestLogin,
    guestEmail: jssoAuth.guestEmail,
    guestMobile: jssoAuth.guestMobile,
    permissionsArr: jssoAuth.permissionsArr,
    accessibleFeatures: jssoAuth.accessibleFeatures,
    userType: jssoAuth.userType,
    isGroupUser: jssoAuth.isGroupUser,
    subscriptionDetails: jssoAuth.subscriptionDetails,
    isLoading: jssoAuth.isLoading,
    isCheckingLogin: jssoAuth.isCheckingLogin,
    isGettingPermissions: jssoAuth.isGettingPermissions,
    error: jssoAuth.error,

    // Methods
    init: () => jssoService.init(),
    getUserDetails: () => jssoService.getUserDetailOpt(),
    getPermissions: () => jssoService.getPermissionsOpt(),
    verifyLogin: () => jssoService.verifyLogin(),
    logout: (cb?: () => void) => jssoService.logout(cb),
    afterLoginCall: (cb: () => void) => jssoService.afterLoginCall(cb),
    getVerifiedMobile: () => jssoService.getVerifiedMobile(),
    checkPermissions: (permissionsArr: string[]) => jssoService.checkPermissions(permissionsArr),
    getUserType: (permissionsArr: string[]) => jssoService.getUserType(permissionsArr),

    // Config
    config,
  };
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const isLogin = useAppSelector((state) => state.jssoAuth.isLogin);
  return isLogin;
}

/**
 * Hook to get current user info
 */
export function useUserInfo() {
  const userInfo = useAppSelector((state) => state.jssoAuth.userInfo);
  return userInfo;
}

/**
 * Hook to get user permissions
 */
export function usePermissions() {
  const permissionsArr = useAppSelector((state) => state.jssoAuth.permissionsArr);
  const accessibleFeatures = useAppSelector((state) => state.jssoAuth.accessibleFeatures);
  const userType = useAppSelector((state) => state.jssoAuth.userType);
  const isGroupUser = useAppSelector((state) => state.jssoAuth.isGroupUser);

  return {
    permissionsArr,
    accessibleFeatures,
    userType,
    isGroupUser,
  };
}

