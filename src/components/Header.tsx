import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Login from './Login';
import RegistrationForm from './RegistrationForm';
import { User } from '../services/authService';
import { useIsAuthenticated } from '../hooks/useJSSO';
import { jssoService } from '../services/jssoService';
import { store } from '../store';
import { clearUserInfo } from '../store/slices/jssoAuthSlice';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = useIsAuthenticated();
  const [activeLink, setActiveLink] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

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
    // Always redirect to dashboard after successful login
    if (user.role.toLowerCase() === 'admin') {
      navigate('/admin', { replace: true });
    } else if (user.role.toLowerCase() === 'institution') {
      navigate('/institution', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
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
            {!isLoggedIn && (
              <button
                onClick={() => setShowRegisterModal(true)}
                className={styles.ctaButton}
              >
                Get Certified
              </button>
            )}
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
              {!isLoggedIn && (
                <button
                  onClick={() => {
                    setShowRegisterModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className={styles.mobileCtaButton}
                >
                  Get Certified
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <Login 
          onLogin={handleLogin} 
          onClose={handleCloseLogin} 
        />
      )}

      {/* Registration Modal */}
      {showRegisterModal && (
        <RegistrationForm 
          onClose={handleCloseRegister} 
        />
      )}
    </nav>
  );
}

