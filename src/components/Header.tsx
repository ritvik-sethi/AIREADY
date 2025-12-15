import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Login from './Login';
import RegistrationForm from './RegistrationForm';
import PlanSelectionModal from './PlanSelectionModal';
import { User } from '../services/authService';
import { useIsAuthenticated, useUserInfo } from '../hooks/useJSSO';
import { useAppSelector } from '../store/hooks';
import { jssoService } from '../services/jssoService';
import { store } from '../store';
import { clearUserInfo } from '../store/slices/jssoAuthSlice';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = useIsAuthenticated();
  const userRole = useAppSelector((state) => state.jssoAuth.userRole);
  const userInfo = useAppSelector((state) => state.jssoAuth.userInfo);
  const [activeLink, setActiveLink] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showPlanSelectionModal, setShowPlanSelectionModal] = useState<boolean>(false);
  
  // Check if we just logged out - if so, treat as logged out
  const logoutFlag = typeof window !== 'undefined' ? sessionStorage.getItem('jsso_logout_flag') : null;
  const justLoggedOut = logoutFlag && (Date.now() - parseInt(logoutFlag, 10)) < 2000;
  
  // Check if user is a normal user - ensure we have both login status AND role
  // Also check that userInfo has ssoid to avoid stale state after logout
  // Respect logout flag to prevent stale state
  const isNormalUser = !justLoggedOut && isLoggedIn && userRole === 'user' && !!userInfo?.ssoid;

  useEffect(() => {
    // Set initial active link based on hash
    const hash = window.location.hash;
    if (hash) {
      setActiveLink(hash);
    }

    // Handle hash changes
    const handleHashChange = () => {
      setActiveLink(window.location.hash);
    };

    // Handle scroll to detect which section is in view
    const handleScroll = () => {
      const sections = ['why-ai', 'benefits', 'testimonials'];
      const scrollPosition = window.scrollY + 100; // Offset for header height

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveLink(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = (hash: string) => {
    setActiveLink(hash);
    setMobileMenuOpen(false); // Close mobile menu when link is clicked
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogin = (user: User) => {
    // Store user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Close modal
    setShowLoginModal(false);
    setMobileMenuOpen(false);
    // For normal users, plan selection popup will be opened by Login component
    // For admin/institution, navigation will be handled by AuthRedirectHandler
  };

  const handleGetCertified = () => {
    if (isNormalUser) {
      // Logged-in normal user: Open plan selection popup directly
      setShowPlanSelectionModal(true);
    } else {
      // Logged-out user: Show registration modal
      setShowRegisterModal(true);
    }
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  const handleCloseRegister = () => {
    setShowRegisterModal(false);
  };

  const handleLogout = async () => {
    // Clear Redux state
    store.dispatch(clearUserInfo());
    
    try {
      await jssoService.logout(() => {
        // Clear localStorage
        localStorage.removeItem('currentUser');
        // Redirect to home page
        navigate('/', { replace: true });
        // Close mobile menu if open
        setMobileMenuOpen(false);
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear localStorage and redirect even if logout fails
      localStorage.removeItem('currentUser');
      navigate('/', { replace: true });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.navContent}>
         <div className={styles.leftSection}>
          <div className={styles.logoContainer}>
            <img
              src="https://economictimes.indiatimes.com/photo/125608958.cms"
              alt="AI Ready Logo"
              className={styles.logo}
            />
          </div>
          {/* Desktop Anchor Links */}
          <div className={styles.anchorLinks}>
            <a 
              href="#why-ai" 
              className={activeLink === '#why-ai' ? styles.navLinkActive : styles.navLink}
              onClick={() => handleLinkClick('#why-ai')}
            >
              Why AI?
            </a>
            <a 
              href="#benefits" 
              className={activeLink === '#benefits' ? styles.navLinkActive : styles.navLink}
              onClick={() => handleLinkClick('#benefits')}
            >
              Benefits
            </a>
            <a 
              href="#testimonials" 
              className={activeLink === '#testimonials' ? styles.navLinkActive : styles.navLink}
              onClick={() => handleLinkClick('#testimonials')}
            >
              Testimonials
            </a>
          </div>
          </div>
          <div className={styles.navLinks}>
            <button
              onClick={isLoggedIn ? handleLogout : () => setShowLoginModal(true)}
              className={styles.loginButton}
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
            <button
              onClick={handleGetCertified}
              className={styles.ctaButton}
            >
              Get Certified
            </button>
          </div>
          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={styles.mobileMenuIcon} />
            ) : (
              <Menu className={styles.mobileMenuIcon} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <a 
              href="#why-ai" 
              className={activeLink === '#why-ai' ? styles.mobileNavLinkActive : styles.mobileNavLink}
              onClick={() => handleLinkClick('#why-ai')}
            >
              Why AI?
            </a>
            <a 
              href="#benefits" 
              className={activeLink === '#benefits' ? styles.mobileNavLinkActive : styles.mobileNavLink}
              onClick={() => handleLinkClick('#benefits')}
            >
              Benefits
            </a>
            <a 
              href="#testimonials" 
              className={activeLink === '#testimonials' ? styles.mobileNavLinkActive : styles.mobileNavLink}
              onClick={() => handleLinkClick('#testimonials')}
            >
              Testimonials
            </a>
            <div className={styles.mobileMenuButtons}>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    handleLogout();
                  } else {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }
                }}
                className={styles.mobileLoginButton}
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </button>
              <button
                onClick={() => {
                  handleGetCertified();
                  setMobileMenuOpen(false);
                }}
                className={styles.mobileCtaButton}
              >
                Get Certified
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <Login 
          onLogin={handleLogin} 
          onClose={handleCloseLogin}
          onOpenPlanSelection={() => {
            setShowLoginModal(false);
            setShowPlanSelectionModal(true);
          }}
        />
      )}

      {/* Registration Modal */}
      {showRegisterModal && (
        <RegistrationForm 
          onClose={handleCloseRegister}
          onOpenLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {/* Plan Selection Modal */}
      {showPlanSelectionModal && (
        <PlanSelectionModal 
          onClose={() => setShowPlanSelectionModal(false)}
        />
      )}
    </nav>
  );
}

