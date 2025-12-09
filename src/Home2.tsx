import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Home2 Page Component - New Design with Purple/Pink Gradient Theme
export function Home2Page() {
  const navigate = useNavigate();
  const [activePathTab, setActivePathTab] = useState<number>(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
    <Header />

      {/* Hero Section - New Design */}
      <HeroSection navigate={navigate} />

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
    </div>
  );
}
