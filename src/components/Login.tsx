import { useAppSelector } from '../store/hooks';
import { LoginFlow } from './loginFlow/LoginFlow';
import { User as UserType } from '../services/authService';

interface LoginProps {
  onLogin: (user: UserType) => void;
  onClose: () => void;
  initialEmail?: string | null;
  initialPhone?: string | null;
  initialName?: string | null;
  initialStep?: 'password' | 'signup'; // Skip identify step if initial values provided
}

export default function Login({ onLogin, onClose }: LoginProps) {
  const jssoAuth = useAppSelector((state) => state.jssoAuth);

  // Handle successful login from LoginFlow
  const handleLoginSuccess = () => {
    // Get user info from JSSO auth state
    const userInfo = jssoAuth.userInfo;
    
    // Create a User object compatible with the onLogin callback
    if (userInfo.ssoid || userInfo.emailId || userInfo.loginId) {
      // Get verified mobile if available
      const mobileList = userInfo.mobileList || {};
      const verifiedMobile = Object.entries(mobileList).find(
        ([, value]) => value === 'Verified'
      )?.[0] || Object.keys(mobileList)[0] || '';

      const user: UserType = {
        id: userInfo.ssoid || userInfo.identifier || '',
        email: userInfo.emailId || userInfo.primaryEmail || '',
        name: userInfo.firstName || userInfo.full_name || '',
        role: 'user', // Default role - you may want to fetch from API or determine from permissions
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

      // Call the onLogin callback with the user
      onLogin(user);
    } else {
      // If user info is not available, still call onClose
      console.warn('[Login] User info not available from JSSO auth state');
      onClose();
    }
  };

  return (
    <LoginFlow 
      onSuccess={handleLoginSuccess}
      onClose={onClose}
    />
  );
}
