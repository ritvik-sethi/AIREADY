import { useState } from 'react';
import {
  Award, Users, Building2, GraduationCap, ChevronRight, CheckCircle,
  Shield, Target, TrendingUp, Briefcase, Globe, Zap, FileCheck,
  Quote, Linkedin, ChevronDown
} from 'lucide-react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutCertification from './components/AboutCertification';
import WhoCanGetCertified from './components/WhoCanGetCertified';
import EarnCertificate from './components/EarnCertificate';
import AICertificationBenefits from './components/AICertificationBenefits';
import SimpleCertificationProcess from './components/SimpleCertificationProcess';
import CertificationDetails from './components/CertificationDetails';
import CertificationCurriculum from './components/CertificationCurriculum';
import FAQs from './components/FAQs';
import Testimonials from './components/Testimonials';
import WhyAIReadiness from './components/WhyAIReadiness';
import Footer from './components/Footer';
import RegistrationForm from './components/RegistrationForm';
import Login from './components/Login';
import PlanSelectionModal from './components/PlanSelectionModal';
import { useIsAuthenticated } from './hooks/useJSSO';
import { useAppSelector } from './store/hooks';

// Home2 Page Component - New Design with Purple/Pink Gradient Theme
export function Home2Page() {
  const [activePathTab, setActivePathTab] = useState<number>(0);
  const [showRegistrationModal, setShowRegistrationModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showPlanSelectionModal, setShowPlanSelectionModal] = useState<boolean>(false);
  const isLoggedIn = useIsAuthenticated();
  const userRole = useAppSelector((state) => state.jssoAuth.userRole);
  const userInfo = useAppSelector((state) => state.jssoAuth.userInfo);
  
  // Check if we just logged out - if so, treat as logged out
  const logoutFlag = typeof window !== 'undefined' ? sessionStorage.getItem('jsso_logout_flag') : null;
  const justLoggedOut = logoutFlag && (Date.now() - parseInt(logoutFlag, 10)) < 2000;
  
  // Check if user is a normal user - ensure we have both login status AND role
  // Also check that userInfo has ssoid to avoid stale state after logout
  // Respect logout flag to prevent stale state
  const isNormalUser = !justLoggedOut && isLoggedIn && userRole === 'user' && !!userInfo?.ssoid;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
    <Header />

      {/* Hero Section - New Design */}
      <HeroSection 
        onOpenRegistration={() => {
          if (isNormalUser) {
            // Logged-in normal user: Open plan selection popup directly
            setShowPlanSelectionModal(true);
          } else {
            // Logged-out user: Show registration modal
            setShowRegistrationModal(true);
          }
        }}
      />

      {/* About the ET AI Ready Certification Section */}
      <AboutCertification />

      {/* Who Can Get AI Certified - Dark Section */}
      <WhoCanGetCertified />
 

      {/* Earn Your ET AI Ready Certificate Section */}
      <EarnCertificate />
      {/* AI Certification Benefits */}
      <AICertificationBenefits />
      {/* Simple Certification Process */}

      {/* Why AI Readiness Matters - Redesigned */}
      {/* Why AI Readiness Matters */}
      <WhyAIReadiness />
      {/* Simple Certification Process */}
      <SimpleCertificationProcess />
      {/* Certification Curriculum Section */}
      {/* Certification Curriculum */}
      <CertificationCurriculum />
      <CertificationDetails />


      {/* FAQs Section */}
      {/* FAQs Section */}
      <FAQs />

      {/* Testimonials Section */}
      {/* Testimonials Section */}
      <Testimonials />

 

      {/* Footer */}
      <Footer />

      {/* Registration Modal */}
      {showRegistrationModal && (
        <RegistrationForm 
          onClose={() => setShowRegistrationModal(false)}
          onOpenLogin={() => {
            setShowRegistrationModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <Login 
          onLogin={() => {
            setShowLoginModal(false);
          }} 
          onClose={() => setShowLoginModal(false)}
          onOpenPlanSelection={() => {
            setShowLoginModal(false);
            setShowPlanSelectionModal(true);
          }}
        />
      )}

      {/* Plan Selection Modal */}
      {showPlanSelectionModal && (
        <PlanSelectionModal 
          onClose={() => setShowPlanSelectionModal(false)}
        />
      )}
    </div>
  );
}
