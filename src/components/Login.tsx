import { useAppSelector } from '../store/hooks';
import { LoginFlow } from './loginFlow/LoginFlow';
import { User as UserType } from '../services/authService';
import { useEffect, useState } from 'react';

interface LoginProps {
  onLogin: (user: UserType) => void;
  onClose: () => void;
  onOpenPlanSelection?: () => void; // Callback to open plan selection popup
  initialEmail?: string | null;
  initialPhone?: string | null;
  initialName?: string | null;
  initialStep?: 'password' | 'signup'; // Skip identify step if initial values provided
}

export default function Login({ onLogin, onClose, onOpenPlanSelection }: LoginProps) {
  const jssoAuth = useAppSelector((state) => state.jssoAuth);
  const [waitingForSync, setWaitingForSync] = useState(false);

  // Handle successful login from LoginFlow
  const handleLoginSuccess = () => {
    // Get user info from JSSO auth state
    const userInfo = jssoAuth.userInfo;
    
    // Wait for sync-user API to complete and get role
    if (userInfo.ssoid || userInfo.emailId || userInfo.loginId) {
      setWaitingForSync(true);
    } else {
      console.warn('[Login] User info not available from JSSO auth state');
      onClose();
    }
  };

  // Wait for sync to complete and role to be available
  useEffect(() => {
    if (waitingForSync && jssoAuth.isLogin && !jssoAuth.isSyncingUser && jssoAuth.userRole) {
      const userInfo = jssoAuth.userInfo;
      
      // Get verified mobile if available
      const mobileList = userInfo.mobileList || {};
      const verifiedMobile = Object.entries(mobileList).find(
        ([, value]) => value === 'Verified'
      )?.[0] || Object.keys(mobileList)[0] || '';

      // Use role from sync-user API response
      const userRole = jssoAuth.userRole;

      const user: UserType = {
        id: userInfo.ssoid || userInfo.identifier || '',
        email: userInfo.emailId || userInfo.primaryEmail || '',
        name: userInfo.firstName || userInfo.full_name || '',
        role: userRole as 'user' | 'admin' | 'institution',
        profile: {
          phone: verifiedMobile,
          organization: '',
          designation: '',
          location: '',
          joinedDate: new Date().toISOString(),
          bio: '',
          photo: null,
          idDocument: null,
          verified: false,
          verifiedBy: null,
          verifiedDate: null,
        },
        enrollment: {
          status: 'active',
          enrolledDate: new Date().toISOString(),
          expiryDate: null,
        },
        examStatus: 'not_attempted',
        remainingAttempts: 3,
        courseProgress: {
          modules: [],
          overallProgress: 0,
        },
        mockTests: [],
      };

      // IMPORTANT: For normal users, open plan selection popup instead of redirecting
      // Admin and institution users follow their existing flow
      setWaitingForSync(false);
      
      if (userRole === 'user' && onOpenPlanSelection) {
        // Normal user: Close login modal and open plan selection popup
        onClose();
        onOpenPlanSelection();
      } else {
        // Admin/institution: Call onLogin callback (navigation handled by AuthRedirectHandler)
        onLogin(user);
      }
    }
  }, [waitingForSync, jssoAuth.isLogin, jssoAuth.isSyncingUser, jssoAuth.userRole, jssoAuth.userInfo, onLogin]);

  // Show loader while waiting for sync
  if (waitingForSync && jssoAuth.isSyncingUser) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Syncing user data...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <LoginFlow 
      onSuccess={handleLoginSuccess}
      onClose={onClose}
    />
  );
}
