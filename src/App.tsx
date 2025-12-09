import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CheckCircle, Award, Building2, GraduationCap, Users, ChevronRight, Shield, FileCheck, Zap, TrendingUp, Target, Globe, Briefcase, Star, Quote, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, ChevronDown, HelpCircle } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import InstitutionDashboard from './components/InstitutionDashboard';
import MockTestPage from './pages/MockTestPage';
import ErrorBoundary from './components/ErrorBoundary';
import { User } from './services/authService';
import { Home2Page } from './Home2';
import Header from './components/Header';
import { jssoService } from './services/jssoService';
import { store } from './store';
import { useAppSelector } from './store/hooks';
import { clearUserInfo } from './store/slices/jssoAuthSlice';

// Protected Route Component
function ProtectedRoute({ children, user, requiredRole }: { children: React.ReactNode, user: User | null, requiredRole?: string }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Landing Page Component
function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openModule, setOpenModule] = useState<number>(0); // Module 1 open by default
  const [faqCategory, setFaqCategory] = useState<number>(0); // FAQ category state
  const [showCurriculumModal, setShowCurriculumModal] = useState<boolean>(false);
  const [activePathTab, setActivePathTab] = useState<number>(0); // Path to certification tab state
  const [curriculumFormData, setCurriculumFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    experience: '',
    organization: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    mobile: '',
    email: '',
    experience: '',
    organization: ''
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFaqCategory = (category: number) => {
    setFaqCategory(category);
    setOpenFaq(null); // Reset open FAQ when changing category
  };

  const toggleModule = (index: number) => {
    setOpenModule(openModule === index ? -1 : index);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateMobile = (mobile: string) => {
    const re = /^[0-9]{10}$/;
    return re.test(mobile);
  };

  const handleCurriculumFormChange = (field: string, value: string) => {
    setCurriculumFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {
      name: '',
      mobile: '',
      email: '',
      experience: '',
      organization: ''
    };
    let isValid = true;

    if (!curriculumFormData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!curriculumFormData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!validateMobile(curriculumFormData.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }

    if (!curriculumFormData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(curriculumFormData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!curriculumFormData.experience.trim()) {
      errors.experience = 'Experience is required';
      isValid = false;
    }

    if (!curriculumFormData.organization.trim()) {
      errors.organization = 'Organization is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const isFormValid = () => {
    return (
      curriculumFormData.name.trim() !== '' &&
      curriculumFormData.mobile.trim() !== '' &&
      validateMobile(curriculumFormData.mobile) &&
      curriculumFormData.email.trim() !== '' &&
      validateEmail(curriculumFormData.email) &&
      curriculumFormData.experience.trim() !== '' &&
      curriculumFormData.organization.trim() !== ''
    );
  };

  const handleDownloadCurriculum = () => {
    if (validateForm()) {
      // Here you would typically send the data to your backend

      // Simulate PDF download
      alert('Thank you! The curriculum PDF will be downloaded shortly.');

      // Reset form and close modal
      setCurriculumFormData({
        name: '',
        mobile: '',
        email: '',
        experience: '',
        organization: ''
      });
      setShowCurriculumModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pb-16 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm border" style={{backgroundColor: 'rgba(238,0,7,0.1)', color: '#ee0007', borderColor: 'rgba(238,0,7,0.3)'}}>
                <Zap className="w-4 h-4" />
                <span>Certified for the Future</span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                  <span className="text-slate-900">Become </span><span style={{color: '#ee0007'}}>ET AI Ready.</span>
                </h1>
                <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                  <span className="text-slate-900">Stay </span><span style={{color: '#0056ff'}}>Future Ready.</span>
                </h1>
              </div>

              {/* Subheadline */}
              <p className="text-lg lg:text-xl text-slate-700 leading-relaxed font-medium">
                Get recognized by <span className="font-bold" style={{color: '#ee0007'}}>The Economic Times</span> for your readiness to lead in the AI era.
              </p>
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <p className="text-slate-600 text-sm mb-3">Designed for</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1.5">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-slate-900 text-xs">Professionals</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1.5">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-slate-900 text-xs">Institutions</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1.5">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-slate-900 text-xs">Organizations</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => navigate('/register')}
                  className="group text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-base font-semibold"
                  style={{backgroundColor: '#ee0007'}}
                >
                  <span>Start Your Journey</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#process"
                  className="bg-white text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 transition-all border-2 border-slate-200 flex items-center justify-center space-x-2 text-base font-semibold"
                >
                  <span>Learn More</span>
                </a>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-slate-700 font-semibold text-sm">Globally Recognized</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" style={{color: '#0056ff'}} />
                  <span className="text-slate-700 font-semibold text-sm">Backed by Industry Experts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" style={{color: '#ee0007'}} />
                  <span className="text-slate-700 font-semibold text-sm">ET Verified Credential</span>
                </div>
              </div>
            </div>

            {/* Right Side - Certificate Preview */}
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse" style={{background: 'radial-gradient(circle, #ee0007, transparent)'}}></div>
              <div className="absolute -bottom-4 -left-4 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse" style={{background: 'radial-gradient(circle, #0056ff, transparent)', animationDelay: '1s'}}></div>

              <div className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 border-2" style={{borderColor: '#ee0007'}}>
                <div className="bg-white rounded-2xl p-6">
                  <div className="text-center space-y-4">
                    {/* ET Logo placeholder - you can replace with actual logo */}
                    <div className="flex justify-center">
                      <img
                        src="https://economictimes.indiatimes.com/photo/119331595.cms"
                        alt="ET Logo"
                        className="h-12 object-contain"
                      />
                    </div>

                    <Award className="w-20 h-20 mx-auto" style={{color: '#ee0007'}} />

                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">ET AI Ready</h3>
                      <p className="text-base text-slate-600 mb-0.5">Official Certification</p>
                      <p className="text-xs text-slate-500">Powered by The Economic Times</p>
                    </div>

                    <div className="rounded-lg p-3 border" style={{backgroundColor: 'rgba(238,0,7,0.05)', borderColor: 'rgba(238,0,7,0.2)'}}>
                      <p className="text-xs text-slate-700 font-medium">
                        <span className="font-bold" style={{color: '#ee0007'}}>Your pathway to AI excellence</span> starts here. Get certified and unlock new career opportunities.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                        <Award className="w-3.5 h-3.5" />
                        <span>Valid for 3 Years | Globally Recognized</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <p className="text-center text-slate-500 text-sm font-semibold uppercase tracking-wider mb-8">Trusted By Leading Institutions</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            <div className="flex items-center justify-center transition-all opacity-70 hover:opacity-100">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg"
                alt="MIT"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center transition-all opacity-70 hover:opacity-100">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Seal_of_Leland_Stanford_Junior_University.svg"
                alt="Stanford"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center transition-all opacity-70 hover:opacity-100">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet.svg"
                alt="Oxford"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center transition-all opacity-70 hover:opacity-100">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Seal_of_University_of_California%2C_Berkeley.svg"
                alt="Berkeley"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center transition-all opacity-70 hover:opacity-100">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg"
                alt="Cambridge"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center transition-all opacity-70 hover:opacity-100">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/70/Harvard_University_logo.svg"
                alt="Harvard"
                className="h-14 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why AI Readiness Section */}
      <section id="why-ai" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why AI Readiness Matters</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              In today's rapidly evolving technological landscape, AI competency is no longer optional—it's essential
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Unprecedented Market Growth</h3>
                    <p className="text-slate-600">
                      The global AI market is projected to reach $1.8 trillion by 2030. Organizations need verified AI-ready professionals to capitalize on this growth.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Competitive Advantage</h3>
                    <p className="text-slate-600">
                      Stand out in the job market or demonstrate your institution's commitment to cutting-edge education and innovation.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-cyan-100 rounded-lg p-3 flex-shrink-0">
                    <Globe className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Global Recognition</h3>
                    <p className="text-slate-600">
                      Our certification is recognized worldwide, opening doors to international opportunities and collaborations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-6">The AI Skills Gap</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Organizations seeking AI talent</span>
                    <span className="text-2xl font-bold">87%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{width: '87%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Professionals with verified AI skills</span>
                    <span className="text-2xl font-bold">23%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{width: '23%'}}></div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 mt-6">
                  <p className="text-sm">
                    Bridge the gap with AI Ready certification and position yourself or your organization at the forefront of the AI revolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Certification Benefits</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Unlock a world of opportunities with AI Ready certification
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-l-4 border-red-600">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-red-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Career Advancement</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Demonstrate your AI expertise to employers and unlock higher-paying positions. Certified professionals see an average 30% salary increase.
                  </p>
                </div>
              </div>
            </div>
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-600">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-red-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Credibility & Trust</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Build trust with clients and stakeholders through third-party validated credentials. Stand out in competitive markets.
                  </p>
                </div>
              </div>
            </div>
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-l-4 border-red-600">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-red-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Global Network</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Join an exclusive community of AI-ready professionals and organizations. Access networking events and collaboration opportunities.
                  </p>
                </div>
              </div>
            </div>
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-600">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-red-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Digital Badges</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Share your achievement on LinkedIn, resumes, and websites with verifiable digital credentials from Credly.
                  </p>
                </div>
              </div>
            </div>
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-l-4 border-red-600">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-red-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Skill Validation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Prove your competency in AI fundamentals, machine learning, ethics, and practical applications through rigorous assessment.
                  </p>
                </div>
              </div>
            </div>
            <div className="group bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-600">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-red-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Future-Proof Career</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Stay relevant in an AI-driven economy. Continuous learning resources keep you updated with the latest developments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple Certification Process</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get certified in three straightforward steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-green-200"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Register</h3>
              <p className="text-slate-600 text-center leading-relaxed mb-4">
                Complete the registration form with your details and select your certification category.
              </p>
              <div className="flex justify-center">
                <FileCheck className="w-12 h-12 text-primary-500 opacity-20" />
              </div>
            </div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Take the Exam</h3>
              <p className="text-slate-600 text-center leading-relaxed mb-4">
                Complete your AI competency assessment securely through Talview's proctored platform.
              </p>
              <div className="flex justify-center">
                <Shield className="w-12 h-12 text-red-600 opacity-20" />
              </div>
            </div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">Get Certified</h3>
              <p className="text-slate-600 text-center leading-relaxed mb-4">
                Receive your official AI Ready certificate via Credly's digital credentialing platform.
              </p>
              <div className="flex justify-center">
                <Award className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Certificate Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Earn Your <span style={{color: '#ee0007'}}>ET AI Ready Certificate</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Stand out with an official certification from The Economic Times
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-red-50 rounded-lg p-3 flex-shrink-0">
                  <Award className="w-8 h-8" style={{color: '#ee0007'}} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Official ET Certification</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Receive an official certificate from The Economic Times, India's leading business publication, validating your AI readiness and expertise.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-50 rounded-lg p-3 flex-shrink-0">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Proctored Assessment</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Take your certification exam through Talview's secure, AI-powered proctoring platform ensuring integrity and credibility.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 rounded-lg p-3 flex-shrink-0">
                  <FileCheck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Digital Badges via Credly</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Share your verified digital badge on LinkedIn, email signatures, and professional profiles with Credly's trusted credentialing platform.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Sample Certificate */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 shadow-2xl border-2" style={{borderColor: '#ee0007'}}>
                <div className="bg-white rounded-lg p-5 shadow-lg">
                  {/* Certificate Header */}
                  <div className="text-center mb-3">
                    <img
                      src="https://economictimes.indiatimes.com/photo/119331595.cms"
                      alt="ET Logo"
                      className="h-10 object-contain mx-auto mb-1"
                    />
                    <div className="text-xs text-slate-500">S. No.: 2025 / 1001</div>
                    <h4 className="text-sm font-bold" style={{color: '#ee0007'}}>The Economic Times</h4>
                  </div>

                  {/* Certificate Body */}
                  <div className="text-center space-y-1.5 mb-3">
                    <p className="text-xs text-slate-600">This is to certify that</p>
                    <h3 className="text-lg font-bold" style={{color: '#0056ff'}}>«Student_Name»</h3>
                    <p className="text-xs text-slate-600">has completed</p>
                    <h2 className="text-base font-bold" style={{color: '#ee0007'}}>
                      ET AI Ready Certification
                    </h2>
                    <div className="pt-1 space-y-0.5">
                      <p className="text-xs text-slate-600">on «Date»</p>
                      <p className="text-xs text-slate-600">with specialization in «Track»</p>
                    </div>
                  </div>

                  {/* Certificate Footer */}
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Award className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-xs font-semibold text-slate-900">Signature</div>
                        <div className="text-xs text-slate-600">Director</div>
                      </div>
                      <div>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-xs font-semibold text-slate-900">Signature</div>
                        <div className="text-xs text-slate-600">Registrar</div>
                      </div>
                      <div>
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                          <Award className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="text-xs font-semibold text-slate-900">Signature</div>
                        <div className="text-xs text-slate-600">Dean</div>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Address */}
                  <div className="mt-3 text-center">
                    <p className="text-xs text-slate-500">
                      economictimes.com
                    </p>
                  </div>
                </div>

                {/* Decorative seal */}
                <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-br from-red-600 to-purple-600 rounded-full opacity-20 blur-2xl"></div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -left-3 bg-white rounded-full p-2 shadow-lg border-2" style={{borderColor: '#ee0007'}}>
                <CheckCircle className="w-6 h-6" style={{color: '#ee0007'}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Certification Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 mb-3">
              About the ET AI Ready Certification
            </h2>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full"></div>
            </div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              A globally recognized credential backed by The Economic Times, designed to validate your AI expertise and prepare you for leadership in the AI-driven future. Perfect for professionals, students, and organizations seeking to demonstrate AI competency.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Certification Highlights */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2" style={{borderColor: '#ee0007'}}>
              <h4 className="font-bold text-slate-900 mb-5 text-lg flex items-center">
                <Award className="w-6 h-6 mr-2" style={{color: '#ee0007'}} />
                Certification Highlights
              </h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-red-50 rounded-lg p-2 mr-3">
                    <GraduationCap className="w-5 h-5" style={{color: '#ee0007'}} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Program Type</h5>
                    <p className="text-slate-600 text-sm">Professional AI certification program with comprehensive curriculum</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-50 rounded-lg p-2 mr-3">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Learning Approach</h5>
                    <p className="text-slate-600 text-sm">Self-paced online learning with flexible study schedule</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-50 rounded-lg p-2 mr-3">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Certificate Validity</h5>
                    <p className="text-slate-600 text-sm">3 years from certification date with renewal options</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-50 rounded-lg p-2 mr-3">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Prerequisites</h5>
                    <p className="text-slate-600 text-sm">High school diploma (10+2) - No prior AI experience required</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-50 rounded-lg p-2 mr-3">
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Backed By</h5>
                    <p className="text-slate-600 text-sm">The Economic Times - India's leading business publication</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-5 text-lg flex items-center">
                <Target className="w-6 h-6 mr-2" style={{color: '#ee0007'}} />
                What You'll Master
              </h4>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                  <span>AI fundamentals, machine learning & generative AI</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                  <span>AI ethics, governance & responsible implementation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                  <span>Practical AI tools & business applications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
                  <span>Strategic AI implementation in organizations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Who Should Get Certified */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Who Should Get Certified?</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Professionals</h4>
                <p className="text-slate-600 text-sm">IT professionals, consultants, project managers, and anyone looking to advance their AI career</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-500 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Business Leaders</h4>
                <p className="text-slate-600 text-sm">Executives, entrepreneurs, and decision-makers driving AI transformation in their organizations</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Students</h4>
                <p className="text-slate-600 text-sm">College students, graduates, and job seekers preparing for AI-focused careers and opportunities</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-red-500 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Organizations</h4>
                <p className="text-slate-600 text-sm">Companies, educational institutions, and training centers validating team AI capabilities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Path to Certification Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 mb-3">
              Path to ET AI Ready Certification
            </h2>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-slate-200">
            <div className="flex overflow-x-auto">
              {/* Tab 1 */}
              <button
                onClick={() => setActivePathTab(0)}
                className={`flex-1 min-w-0 px-4 py-3 border-b-4 transition-colors ${
                  activePathTab === 0
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                    activePathTab === 0 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    1
                  </div>
                  <span className={`font-semibold text-sm text-center break-words ${activePathTab === 0 ? 'text-slate-900' : 'text-slate-600'}`}>
                    Eligibility
                  </span>
                </div>
              </button>

              {/* Tab 2 */}
              <button
                onClick={() => setActivePathTab(1)}
                className={`flex-1 min-w-0 px-4 py-3 border-b-4 transition-colors ${
                  activePathTab === 1
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                    activePathTab === 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    2
                  </div>
                  <span className={`font-semibold text-sm text-center break-words ${activePathTab === 1 ? 'text-slate-900' : 'text-slate-600'}`}>
                    Registration
                  </span>
                </div>
              </button>

              {/* Tab 3 */}
              <button
                onClick={() => setActivePathTab(2)}
                className={`flex-1 min-w-0 px-4 py-3 border-b-4 transition-colors ${
                  activePathTab === 2
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                    activePathTab === 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    3
                  </div>
                  <span className={`font-semibold text-sm text-center break-words ${activePathTab === 2 ? 'text-slate-900' : 'text-slate-600'}`}>
                    Payment
                  </span>
                </div>
              </button>

              {/* Tab 4 */}
              <button
                onClick={() => setActivePathTab(3)}
                className={`flex-1 min-w-0 px-4 py-3 border-b-4 transition-colors ${
                  activePathTab === 3
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                    activePathTab === 3 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    4
                  </div>
                  <span className={`font-semibold text-sm text-center break-words ${activePathTab === 3 ? 'text-slate-900' : 'text-slate-600'}`}>
                    Study
                  </span>
                </div>
              </button>

              {/* Tab 5 */}
              <button
                onClick={() => setActivePathTab(4)}
                className={`flex-1 min-w-0 px-4 py-3 border-b-4 transition-colors ${
                  activePathTab === 4
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                    activePathTab === 4 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    5
                  </div>
                  <span className={`font-semibold text-sm text-center break-words ${activePathTab === 4 ? 'text-slate-900' : 'text-slate-600'}`}>
                    Exam
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="pt-4 pb-0">
            {/* Tab 1 Content - Check Eligibility & Prepare */}
            {activePathTab === 0 && (
              <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Eligibility Requirements</h4>

              <div className="bg-red-50 border-l-4 p-4 mb-6" style={{borderColor: '#ee0007'}}>
                <div className="flex items-center mb-2">
                  <GraduationCap className="w-5 h-5 mr-2" style={{color: '#ee0007'}} />
                  <p className="text-slate-900 font-bold">Minimum Qualification</p>
                </div>
                <p className="text-slate-700">High school or secondary school diploma (10+2 or equivalent)</p>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                The ET AI Ready certification is designed for everyone - from beginners to experienced professionals.
                No prior AI knowledge or technical background required. Perfect for those looking to validate their AI readiness
                and stay ahead in the AI-driven world.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center mb-3">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    <h5 className="font-bold text-slate-900 text-sm">Professionals</h5>
                  </div>
                  <ul className="space-y-2 text-slate-600 text-xs">
                    <li>• Working professionals</li>
                    <li>• Career switchers</li>
                    <li>• Business leaders</li>
                    <li>• Entrepreneurs</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center mb-3">
                    <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                    <h5 className="font-bold text-slate-900 text-sm">Students</h5>
                  </div>
                  <ul className="space-y-2 text-slate-600 text-xs">
                    <li>• College students</li>
                    <li>• Fresh graduates</li>
                    <li>• Job seekers</li>
                    <li>• Interns</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center mb-3">
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    <h5 className="font-bold text-slate-900 text-sm">Organizations</h5>
                  </div>
                  <ul className="space-y-2 text-slate-600 text-xs">
                    <li>• Educational institutions</li>
                    <li>• Corporate teams</li>
                    <li>• Training centers</li>
                    <li>• Government bodies</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-5 text-white">
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="mb-2">📚 Comprehensive study materials</p>
                    <p className="mb-2">📝 Practice questions & mock tests</p>
                    <p>💼 Real-world case studies</p>
                  </div>
                  <div>
                    <p className="mb-2">📊 Progress tracking dashboard</p>
                    <p className="mb-2">👥 Community forum access</p>
                    <p>✅ Digital certificate & badge</p>
                  </div>
                </div>
              </div>
            </div>
              </div>
            )}

            {/* Tab 2 Content - Registration */}
            {activePathTab === 1 && (
              <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Simple Registration Process</h4>

              <p className="text-slate-600 mb-6">
                Quick and easy registration! Just provide basic information to get started. You can update additional details like profile picture and government-issued ID later through your dashboard.
              </p>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
                  <div className="flex items-center mb-3">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h5 className="font-bold text-slate-900">Basic Information</h5>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Just the essentials to create your account
                  </p>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Full name</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Email address</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Phone number</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span>Create password</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
                  <div className="flex items-center mb-3">
                    <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h5 className="font-bold text-slate-900">Complete Payment</h5>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Secure payment to finalize registration
                  </p>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                      <span>One-time fee: ₹15,000</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                      <span>Multiple payment options</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                      <span>Instant confirmation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
                      <span>Immediate access to dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 p-5 mb-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-3 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h5 className="font-bold text-slate-900 mb-3">Update Profile Later</h5>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      After registration and payment, you'll get access to your personal dashboard where you can update additional details like your profile picture, government-issued ID, professional experience, and educational background at your convenience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-5">
                <h5 className="font-bold text-slate-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Registration Steps
                </h5>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-3">1</div>
                    <p className="font-semibold text-slate-900 mb-1">Create Account</p>
                    <p className="text-xs">Enter basic details and create password</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-3">2</div>
                    <p className="font-semibold text-slate-900 mb-1">Make Payment</p>
                    <p className="text-xs">Complete secure payment of ₹15,000</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-3">3</div>
                    <p className="font-semibold text-slate-900 mb-1">Access Dashboard</p>
                    <p className="text-xs">Start learning and update profile</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center italic">
                  ⏱️ Registration takes less than 5 minutes!
                </p>
              </div>
            </div>
              </div>
            )}

            {/* Tab 3 Content - Pay & Schedule the Exam */}
            {activePathTab === 2 && (
              <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Payment & Exam Scheduling</h4>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 p-5 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-green-900 mb-2">Application Accepted - What's Next?</h5>
                    <p className="text-green-800 text-sm leading-relaxed">
                      Congratulations on being accepted! You're one step closer to becoming ET AI Ready certified.
                      Complete your payment to unlock study materials and schedule your exam at your convenience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                  <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h5 className="font-bold text-slate-900">Certification Fee</h5>
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-purple-600 mb-1">₹15,000</div>
                    <p className="text-slate-600 text-sm">One-time payment</p>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span>Exam access</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span>Official certificate</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span>Digital badge (Credly)</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span>Study materials</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span>Three exam attempts</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                  <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h5 className="font-bold text-slate-900">Flexible Scheduling</h5>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">Online Exam</p>
                        <p className="text-xs">Take from home via AI proctoring</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">24/7 Availability</p>
                        <p className="text-xs">Schedule any day, any time</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">Instant Confirmation</p>
                        <p className="text-xs">Get exam slot confirmation immediately</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">Reschedule Option</p>
                        <p className="text-xs">Change date up to 24 hours before</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-5 text-white mb-6">
                <h5 className="font-bold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Accepted Payment Methods
                </h5>
                <div className="grid md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white/10 rounded p-2 text-center">Credit Card</div>
                  <div className="bg-white/10 rounded p-2 text-center">Debit Card</div>
                  <div className="bg-white/10 rounded p-2 text-center">Net Banking</div>
                  <div className="bg-white/10 rounded p-2 text-center">UPI</div>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-600 p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-slate-700">
                    <p className="font-semibold mb-1">Additional Attempt Fee</p>
                    <p>Your fee includes 3 exam attempts. If you need more than 3 attempts, additional attempts are available for purchase at ₹5,000 each. Most candidates pass within the first three attempts with proper preparation.</p>
                  </div>
                </div>
              </div>
            </div>
              </div>
            )}

            {/* Tab 4 Content - Study for the Exam */}
            {activePathTab === 3 && (
              <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Prepare for Success</h4>

              <p className="text-slate-600 mb-6 leading-relaxed">
                Comprehensive study resources designed to help you master AI fundamentals and pass your certification
                exam with confidence. Start your preparation journey today!
              </p>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-5 border-2 border-green-200">
                  <div className="flex items-center mb-4">
                    <GraduationCap className="w-6 h-6 mr-2 text-green-600" />
                    <h5 className="font-bold text-slate-900">Study Resources</h5>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">PDF Study Guides</p>
                        <p className="text-xs">Comprehensive coverage of all 9 modules</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Practice Tests</p>
                        <p className="text-xs">Mock exams with detailed explanations</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Case Studies</p>
                        <p className="text-xs">Real-world AI implementation scenarios</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Quick Reference</p>
                        <p className="text-xs">Cheat sheets for last-minute revision</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Progress Tracking</p>
                        <p className="text-xs">Monitor your learning journey with analytics</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                  <div className="flex items-center mb-4">
                    <Target className="w-6 h-6 mr-2 text-blue-600" />
                    <h5 className="font-bold text-slate-900">Preparation Tips</h5>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Start Early</p>
                        <p className="text-xs">Allow 4-6 weeks for thorough preparation</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Follow Schedule</p>
                        <p className="text-xs">Create and stick to a study plan</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Practice Regularly</p>
                        <p className="text-xs">Take mock tests to assess progress</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Understand Concepts</p>
                        <p className="text-xs">Focus on comprehension over memorization</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Join Community</p>
                        <p className="text-xs">Connect with fellow learners</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border-2 border-slate-200 hover:border-green-400 transition-all hover:shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <FileCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <h6 className="font-bold text-slate-900 mb-2">Self-Paced Learning</h6>
                  <p className="text-slate-600 text-sm mb-2">Study at your own speed with comprehensive materials</p>
                  <span className="text-green-600 font-semibold text-xs">Recommended approach</span>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-slate-200 hover:border-purple-400 transition-all hover:shadow-md">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h6 className="font-bold text-slate-900 mb-2">Practice Mode</h6>
                  <p className="text-slate-600 text-sm mb-2">Test your knowledge with mock exams</p>
                  <span className="text-purple-600 font-semibold text-xs">Essential prep</span>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-slate-200 hover:border-blue-400 transition-all hover:shadow-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h6 className="font-bold text-slate-900 mb-2">Case Studies</h6>
                  <p className="text-slate-600 text-sm mb-2">Learn from real-world AI scenarios</p>
                  <span className="text-blue-600 font-semibold text-xs">Practical insights</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 mb-6">
                <p className="text-slate-700 text-sm mb-2">
                  <span className="font-bold text-slate-900">Looking for additional learning resources?</span>
                </p>
                <p className="text-slate-600 text-xs mb-3">
                  While the certification program includes all necessary study materials, you can explore our optional masterclass for deeper AI knowledge:
                </p>
                <a
                  href="https://economictimes.indiatimes.com/masterclass/ai-for-business-professionals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 underline"
                >
                  Economic Times Masterclass: AI for Business Professionals
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
                <p className="text-xs text-slate-500 mt-2 italic">
                  Note: This is an external course and is NOT included in the ET AI Ready certification program or fee.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <h5 className="font-bold text-xl mb-2 flex items-center">
                      <FileCheck className="w-6 h-6 mr-2" />
                      Download Full Curriculum
                    </h5>
                    <p className="text-green-50 text-sm">
                      Get instant access to comprehensive study materials covering all 9 modules with detailed objectives
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCurriculumModal(true)}
                    className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors whitespace-nowrap shadow-lg hover:shadow-xl"
                  >
                    Download Now
                  </button>
                </div>
              </div>
            </div>
              </div>
            )}

            {/* Tab 5 Content - Take the Exam */}
            {activePathTab === 4 && (
              <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Exam Day Information</h4>

              <p className="text-slate-600 mb-6 leading-relaxed">
                You're ready for the final step! Our secure, AI-proctored online exam ensures integrity while providing
                a convenient testing experience from anywhere.
              </p>

              <div className="bg-slate-50 rounded-lg p-6 mb-6 border border-slate-200">
                <h5 className="text-slate-900 font-semibold mb-4 text-base">Exam At a Glance</h5>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-1">60</div>
                    <div className="text-slate-600 text-sm">Minutes</div>
                    <div className="text-slate-500 text-xs mt-1">(1 hour)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-1">100</div>
                    <div className="text-slate-600 text-sm">Questions</div>
                    <div className="text-slate-500 text-xs mt-1">(all scored)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-1">70%</div>
                    <div className="text-slate-600 text-sm">Passing Score</div>
                    <div className="text-slate-500 text-xs mt-1">(minimum)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-1">EN</div>
                    <div className="text-slate-600 text-sm">Language</div>
                    <div className="text-slate-500 text-xs mt-1">(English only)</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-600 p-5 mb-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-3 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h5 className="font-bold text-slate-900 mb-3">Before You Begin</h5>
                    <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-600">
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Stable internet (minimum 2 Mbps)</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Working webcam & microphone</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Government-issued photo ID</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Quiet, well-lit room</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Close unnecessary applications</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Test system 30 mins before</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border-2 border-green-200">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                    <h6 className="font-bold text-green-900">Allowed</h6>
                  </div>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                      <span>Blank paper for notes</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                      <span>Water in clear container</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                      <span>Prescription eyewear</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                      <span>Basic calculator (if needed)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border-2 border-red-200">
                  <div className="flex items-center mb-3">
                    <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <h6 className="font-bold text-red-900">Not Allowed</h6>
                  </div>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                      <span>Mobile phones</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                      <span>Reference materials</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                      <span>Other people in room</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                      <span>Headphones/earbuds</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-2 border-blue-200">
                  <div className="flex items-center mb-3">
                    <Shield className="w-6 h-6 text-blue-600 mr-2" />
                    <h6 className="font-bold text-blue-900">Security</h6>
                  </div>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      <span>AI-powered proctoring</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      <span>Face visible at all times</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      <span>Room scan required</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      <span>ID verification</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600 p-5 mb-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-3 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h5 className="font-bold text-slate-900 mb-3">Important Exam Policies</h5>
                    <div className="space-y-3 text-sm text-slate-700">
                      <div className="flex items-start">
                        <span className="font-semibold mr-2">⏱️ No Scheduled Breaks:</span>
                        <span>The exam runs continuously for 60 minutes without scheduled breaks. Plan accordingly before starting the exam.</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-semibold mr-2">🌐 Internet Disconnection:</span>
                        <span>If your internet disconnects during the exam, you can continue from where you left off. However, you will need to complete the full verification process again (ID check, room scan, face verification) to prevent cheating and maintain exam integrity.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white mb-6">
                <h5 className="font-bold text-xl mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-2" />
                  After the Exam
                </h5>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <h6 className="font-semibold mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Results in 2-3 Working Days
                    </h6>
                    <p className="text-purple-50 text-sm">
                      Our experts verify fair conduct and evaluate your exam. Results published after thorough review to ensure integrity.
                    </p>
                  </div>
                  <div>
                    <h6 className="font-semibold mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Certificate Delivery
                    </h6>
                    <p className="text-purple-50 text-sm">
                      Official certificate and Credly digital badge sent to your email within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5">
                <div className="flex items-start">
                  <svg className="w-6 h-6 mr-3 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <h5 className="font-bold text-slate-900 mb-2">24/7 Technical Support</h5>
                    <p className="text-slate-700 text-sm">
                      Experiencing technical issues during your exam? Our support team is available round-the-clock via
                      live chat and phone to ensure your exam experience is smooth and successful.
                    </p>
                  </div>
                </div>
              </div>
            </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-bold shadow-sm border mb-4" style={{color: '#ee0007', borderColor: 'rgba(238,0,7,0.3)'}}>
              <GraduationCap className="w-4 h-4" />
              <span>Comprehensive Learning Path</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Certification Curriculum</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A professionally designed 9-module program covering AI foundations to advanced implementation
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                num: '01',
                title: 'Foundations of Intelligence & AI Evolution',
                desc: 'Build a solid conceptual base in what intelligence is — and how AI simulates it.',
                professional: 'Understanding natural vs artificial intelligence, AI history from symbolic systems to generative AI, core functional differences between AI/ML/DL, the four pillars of AI systems, and real-world applications.',
                advanced: 'Cognitive science foundations, AI as cognitive amplifier, representation concepts in LLMs, neuro-symbolic AI and hybrid cognition models.'
              },
              {
                num: '02',
                title: 'Data, Information & Intelligence',
                desc: 'Understand data as the fuel and structural foundation of AI systems.',
                professional: 'Data types and sources, lifecycle management from collection to learning, quality control and bias prevention, cloud infrastructure, and privacy frameworks including India\'s DPDP Act.',
                advanced: 'Information theory and Shannon entropy, embeddings and vector space logic, bias detection methodologies, and global data governance frameworks like GDPR and EU AI Act.'
              },
              {
                num: '03',
                title: 'Machine Learning & Intelligent Learning Theory',
                desc: 'Explore how machines learn, adapt, and make predictions.',
                professional: 'Three learning paradigms (supervised, unsupervised, reinforcement), training and prediction processes, accuracy and generalization concepts, evaluation metrics, and real-world ML applications.',
                advanced: 'Gradient descent and loss minimization, transfer learning and fine-tuning strategies, RLHF (Reinforcement Learning with Human Feedback), and self-supervised learning mechanisms.'
              },
              {
                num: '04',
                title: 'Deep Learning & Neural Networks',
                desc: 'Simplify how neural systems power modern AI and dig deeper into their structure.',
                professional: 'Neural network architectures, layer types and functions, CNNs for vision, RNNs for sequences, Transformers for language, attention mechanisms, and deep learning challenges.',
                advanced: 'Activation functions and gradient flow, attention heads and positional encoding, explainable AI techniques (LIME, SHAP, Grad-CAM), and optimization methods.'
              },
              {
                num: '05',
                title: 'Generative AI – Theory, Architectures & Creativity',
                desc: 'Decode the generative mechanisms that let AI create new content.',
                professional: 'Generative AI fundamentals, core architectures (GANs, VAEs, Diffusion, LLMs), tokenization and context windows, creativity control parameters, and real-world generative tools.',
                advanced: 'Probability sampling and latent space exploration, model fine-tuning ethics, prompt compression techniques, and understanding creativity boundaries in AI systems.'
              },
              {
                num: '06',
                title: 'Multimodal AI Systems & Tool Integration',
                desc: 'Learn how GenAI combines text, visuals, audio, and video.',
                professional: 'Cross-modal generation (text-to-image, text-to-audio, text-to-video), integration tools and platforms, API workflows, and end-to-end content creation pipelines.',
                advanced: 'Multimodal model architectures, RAG (Retrieval-Augmented Generation) systems, performance optimization and latency management, API security and fairness considerations.'
              },
              {
                num: '07',
                title: 'AI Strategy, Business Innovation & Transformation',
                desc: 'Learn how organizations deploy, measure, and scale AI responsibly.',
                professional: 'AI applications across industries, ROI measurement and KPIs, human-AI collaboration workflows, building AI-ready teams, and managing organizational change.',
                advanced: 'AI maturity frameworks, governance boards and ethical decision processes, economic impact analysis, and AI in Industry 5.0 human-centered automation.'
              },
              {
                num: '08',
                title: 'Ethics, Risks, and Global Governance',
                desc: 'Develop deep ethical awareness and governance thinking.',
                professional: 'Core AI ethics (bias, fairness, transparency, privacy), deepfakes and disinformation challenges, intellectual property considerations, and responsible AI principles.',
                advanced: 'Global regulatory frameworks (EU AI Act, DPDP, US AI Bill of Rights), algorithmic accountability and AI audits, environmental impact, and the alignment problem.'
              },
              {
                num: '09',
                title: 'Human–AI Collaboration and Future Leadership',
                desc: 'Prepare for the coming era of augmented intelligence.',
                professional: 'Human-in-the-loop systems, AI for creativity and decision-making, AI literacy for different roles, and reskilling frameworks for the AI economy.',
                advanced: 'Affective computing and emotional AI, synthetic labor and digital twins, philosophy of human-AI coexistence, and leadership ethics in algorithmic governance.'
              },
            ].map((module, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4" style={{borderLeftColor: index % 2 === 0 ? '#ee0007' : '#0056ff'}}>
                {/* Module Header - Always Visible */}
                <button
                  onClick={() => toggleModule(index)}
                  className="w-full p-6 flex items-start space-x-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-base font-medium border-2" style={{color: index % 2 === 0 ? '#ee0007' : '#0056ff', borderColor: index % 2 === 0 ? 'rgba(238,0,7,0.2)' : 'rgba(0,86,255,0.2)', backgroundColor: index % 2 === 0 ? 'rgba(238,0,7,0.05)' : 'rgba(0,86,255,0.05)'}}>
                      {module.num}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{module.title}</h3>
                    <p className="text-slate-600 font-medium">{module.desc}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronDown
                      className={`w-6 h-6 text-slate-600 transition-transform duration-300 ${
                        openModule === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Module Content - Expandable */}
                {openModule === index && (
                  <div className="px-6 pb-6">
                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#ee0007'}}></div>
                          <h4 className="font-bold text-slate-800">60% Professional Concepts</h4>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{module.professional}</p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#0056ff'}}></div>
                          <h4 className="font-bold text-slate-800">40% Advanced Integration</h4>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{module.advanced}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Download CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowCurriculumModal(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
            >
              <FileCheck className="w-6 h-6" />
              <span>Download Full Curriculum</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Certification Details Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Certification Details</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to know about AI Ready certification
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 mb-2">₹15,000</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Certification Fee</h3>
              <p className="text-slate-600 text-sm">One-time payment includes exam, certificate, and digital badge</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 mb-2">3 Years</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Certificate Validity</h3>
              <p className="text-slate-600 text-sm">Valid for three years from the date of certification</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 mb-2">2 Hours</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Exam Duration</h3>
              <p className="text-slate-600 text-sm">Comprehensive assessment with proctoring via Talview</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 mb-2">24/7</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Online Access</h3>
              <p className="text-slate-600 text-sm">Take the exam anytime, anywhere at your convenience</p>
            </div>
          </div>
          <div className="mt-12 bg-gradient-to-r from-red-600 to-purple-600 rounded-xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-3">What's Included</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive AI competency exam</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Official digital certificate</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Credly verified digital badge</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Exam Format</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Multiple choice questions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Scenario-based assessments</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>AI-powered proctoring</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>24/7 technical support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Study materials provided</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Three exam attempts included</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What Our Certified Professionals Say</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Hear from individuals and organizations who transformed their careers with AI Ready certification
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-red-50 rounded-2xl p-8 border border-primary-100 hover:shadow-xl transition-all">
              <div className="flex items-center space-x-1 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <Quote className="w-10 h-10 text-primary-300 mb-4" />
              <p className="text-slate-700 leading-relaxed mb-6">
                "The AI Ready certification transformed my career. Within three months of certification, I landed a senior ML engineer role with a 40% salary increase. The credibility it provided was invaluable."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Sarah Mitchell"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-slate-900">Sarah Mitchell</p>
                    <p className="text-sm text-slate-600">Senior ML Engineer, TechCorp</p>
                  </div>
                </div>
                <a
                  href="https://www.linkedin.com/in/sarahmitchell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all">
              <div className="flex items-center space-x-1 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <Quote className="w-10 h-10 text-green-300 mb-4" />
              <p className="text-slate-700 leading-relaxed mb-6">
                "As a university, getting AI Ready certified elevated our computer science program. We saw a 65% increase in enrollment and attracted top-tier faculty. It's a game-changer for academic institutions."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Dr. James Kumar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-slate-900">Dr. James Kumar</p>
                    <p className="text-sm text-slate-600">Dean, State University</p>
                  </div>
                </div>
                <a
                  href="https://www.linkedin.com/in/jameskumar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100 hover:shadow-xl transition-all">
              <div className="flex items-center space-x-1 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <Quote className="w-10 h-10 text-orange-300 mb-4" />
              <p className="text-slate-700 leading-relaxed mb-6">
                "Our AI service company gained instant credibility with enterprise clients after certification. It validated our expertise and opened doors to Fortune 500 partnerships we couldn't access before."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="Elena Chen"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-slate-900">Elena Chen</p>
                    <p className="text-sm text-slate-600">CEO, AI Solutions Inc.</p>
                  </div>
                </div>
                <a
                  href="https://www.linkedin.com/in/elenachen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Certified Professionals</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Certified Institutions</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <div className="text-blue-100">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2">
              <span className="text-slate-900">ET AI Ready Certification </span>
              <span style={{color: '#ee0007'}}>FAQs</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Categories */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-8">
                <button
                  onClick={() => handleFaqCategory(0)}
                  className={`w-full text-left px-6 py-4 border-l-4 transition-colors ${
                    faqCategory === 0
                      ? 'border-red-600 bg-red-50 text-red-600 font-semibold'
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Certification Overview
                </button>
                <button
                  onClick={() => handleFaqCategory(1)}
                  className={`w-full text-left px-6 py-4 border-l-4 transition-colors ${
                    faqCategory === 1
                      ? 'border-red-600 bg-red-50 text-red-600 font-semibold'
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Eligibility & Requirements
                </button>
                <button
                  onClick={() => handleFaqCategory(2)}
                  className={`w-full text-left px-6 py-4 border-l-4 transition-colors ${
                    faqCategory === 2
                      ? 'border-red-600 bg-red-50 text-red-600 font-semibold'
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Exam & Assessment
                </button>
                <button
                  onClick={() => handleFaqCategory(3)}
                  className={`w-full text-left px-6 py-4 border-l-4 transition-colors ${
                    faqCategory === 3
                      ? 'border-red-600 bg-red-50 text-red-600 font-semibold'
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Pricing & Support
                </button>
              </div>
            </div>

            {/* Right Content - FAQ Items */}
            <div className="lg:col-span-8 space-y-3">
              {/* Certification Overview FAQs */}
              {faqCategory === 0 && (
                <>
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(0)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">What is ET AI Ready certification?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 0 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 0 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 0 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        ET AI Ready is an official certification program by The Economic Times that validates your understanding of artificial intelligence concepts, applications, ethics, and strategic implementation. It's designed to demonstrate your AI readiness in today's technology-driven business landscape.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(1)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">Who is this certification designed for?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 1 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 1 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 1 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        This certification is designed for professionals, students, educational institutions, and AI service providers looking to validate their AI knowledge. Whether you're advancing your career, establishing organizational credentials, or demonstrating expertise to clients, this program serves your needs.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(2)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">What topics does the certification cover?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 2 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 2 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 2 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        The curriculum covers 9 comprehensive modules including AI fundamentals, machine learning, deep learning, generative AI, multimodal systems, AI strategy, ethics and governance, and human-AI collaboration. Each module combines professional concepts with advanced integration.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(3)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">Is the certification globally recognized?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 3 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 3 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 3 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        Yes, ET AI Ready certification is recognized by organizations and institutions worldwide. Your credentials are verified through Credly's trusted platform, making them portable and shareable across professional networks globally.
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Eligibility & Requirements FAQs */}
              {faqCategory === 1 && (
                <>
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(10)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">Are there any prerequisites for this certification?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 10 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 10 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 10 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        No specific prerequisites are required. The certification is open to anyone interested in AI, from beginners to experienced professionals. A basic understanding of technology concepts is helpful but not mandatory.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(11)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">Do I need coding or programming skills?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 11 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 11 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 11 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        No, coding is not required. The ET AI Ready certification focuses on AI concepts, applications, ethics, and strategic implementation rather than programming. It's designed for both technical and non-technical professionals.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(12)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">Can students apply for this certification?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 12 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 12 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 12 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        Absolutely! Students from any discipline can apply. This certification is valuable for college and university students looking to enhance their resumes and demonstrate AI competency to future employers.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(13)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">Can organizations get certified?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 13 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 13 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 13 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        Yes, educational institutions, universities, schools, and AI service provider organizations can apply for certification. This demonstrates your organization's commitment to AI excellence and can enhance your credibility in the market.
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Exam & Assessment FAQs */}
              {faqCategory === 2 && (
                <>
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(20)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">What is the exam format?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 20 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 20 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 20 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        The exam consists of multiple-choice questions and scenario-based assessments that test your practical understanding of AI concepts, applications, and decision-making in real-world situations.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(21)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">How long is the exam?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 21 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 21 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 21 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        The exam is 2 hours long, giving you adequate time to carefully consider each question and demonstrate your comprehensive understanding of AI concepts.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(22)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">Is the exam proctored?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 22 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 22 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 22 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        Yes, the exam is conducted through Talview's secure, AI-powered proctoring platform. This ensures the integrity and credibility of the certification while allowing you to take the exam from anywhere.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(23)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">Can I take the exam online?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 23 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 23 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 23 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        Yes, the exam is fully online and available 24/7. You can take it from the comfort of your home or office at a time that suits your schedule.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(24)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">What happens if I don't pass?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 24 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 24 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 24 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        Your certification fee includes three exam attempts. If you need more than three attempts, you can purchase additional attempts for ₹5,000 each. You'll also receive detailed feedback after each attempt to help you improve.
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Pricing & Support FAQs */}
              {faqCategory === 3 && (
                <>
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(30)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">How much does the certification cost?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 30 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 30 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 30 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        The certification fee is ₹15,000 (one-time payment). This includes three exam attempts, official certificate, Credly digital badge, and comprehensive study materials.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(31)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">How long is the certification valid?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 31 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 31 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 31 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        Your ET AI Ready certification is valid for 3 years from the date of issuance. You can renew it by taking the updated exam to ensure your knowledge stays current with AI developments.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(32)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">Are study materials provided?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 32 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 32 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 32 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        Yes! After registration, you'll receive comprehensive study materials including video tutorials, practice questions, case studies, and reading resources covering all 9 modules of the certification curriculum.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(33)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">How do I receive my certificate?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 33 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 33 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 33 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        Upon passing the exam, you'll receive your digital certificate and Credly badge within 3-5 business days via email. The badge can be shared on LinkedIn, email signatures, and professional profiles. You'll also have a downloadable PDF certificate.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(34)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base font-semibold text-slate-900 pr-4">Is technical support available?</span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === 34 ? 'transform rotate-180' : ''
                        }`}
                        style={{color: openFaq === 34 ? '#ee0007' : '#64748b'}}
                      />
                    </button>
                    {openFaq === 34 && (
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                        Yes, 24/7 technical support is available throughout your certification journey. Our support team can assist with registration, exam-related queries, technical issues, and certificate delivery.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Certified?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of professionals and organizations already certified in AI readiness
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-red-600 px-8 py-4 rounded-xl hover:bg-slate-50 transition-all transform hover:scale-105 shadow-lg text-lg font-semibold inline-flex items-center space-x-2"
          >
            <span>Start Registration</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Logo and About */}
            <div className="lg:col-span-1">
              <img
                src="https://economictimes.indiatimes.com/photo/119331595.cms"
                alt="AI Ready Logo"
                className="h-10 object-contain mb-4 brightness-0 invert"
              />
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Official AI competency certification for individuals and organizations. Building the future of AI-ready professionals worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#why-ai" className="block text-slate-400 hover:text-white transition-colors text-sm">Why AI Readiness</a>
                <a href="#categories" className="block text-slate-400 hover:text-white transition-colors text-sm">Who Can Get Certified</a>
                <a href="#benefits" className="block text-slate-400 hover:text-white transition-colors text-sm">Benefits</a>
                <a href="#testimonials" className="block text-slate-400 hover:text-white transition-colors text-sm">Testimonials</a>
                <a href="#process" className="block text-slate-400 hover:text-white transition-colors text-sm">Certification Process</a>
                <a href="#about" className="block text-slate-400 hover:text-white transition-colors text-sm">About Us</a>
              </div>
            </div>

            {/* Partners */}
            <div>
              <h3 className="text-lg font-bold mb-4">Our Partners</h3>
              <div className="space-y-3">
                <a href="https://talview.com" target="_blank" rel="noopener noreferrer" className="block text-slate-400 hover:text-white transition-colors text-sm">
                  Talview
                </a>
                <a href="https://credly.com" target="_blank" rel="noopener noreferrer" className="block text-slate-400 hover:text-white transition-colors text-sm">
                  Credly
                </a>
              </div>
              <h3 className="text-lg font-bold mb-4 mt-6">Resources</h3>
              <div className="space-y-3">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Study Materials</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">FAQs</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-400 text-sm">support@aiready.com</p>
                    <p className="text-slate-400 text-sm">info@aiready.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-400 text-sm">+1 (555) 123-4567</p>
                    <p className="text-slate-400 text-sm">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-400 text-sm">
                    123 AI Street<br />
                    Tech City, TC 12345<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-slate-400 text-sm">&copy; 2025 AI Ready Certification. All rights reserved.</p>
              <div className="flex items-center space-x-6 text-sm">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Curriculum Download Modal */}
      {showCurriculumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Download Curriculum</h3>
                <button
                  onClick={() => {
                    setShowCurriculumModal(false);
                    setCurriculumFormData({
                      name: '',
                      mobile: '',
                      email: '',
                      experience: '',
                      organization: ''
                    });
                    setFormErrors({
                      name: '',
                      mobile: '',
                      email: '',
                      experience: '',
                      organization: ''
                    });
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-slate-600 mt-2">Please provide your details to download the full curriculum PDF</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={curriculumFormData.name}
                  onChange={(e) => handleCurriculumFormChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Mobile Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={curriculumFormData.mobile}
                  onChange={(e) => handleCurriculumFormChange('mobile', e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.mobile
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {formErrors.mobile && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.mobile}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={curriculumFormData.email}
                  onChange={(e) => handleCurriculumFormChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Experience Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Years of Experience <span className="text-red-600">*</span>
                </label>
                <select
                  value={curriculumFormData.experience}
                  onChange={(e) => handleCurriculumFormChange('experience', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.experience
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                  <option value="student">Student</option>
                </select>
                {formErrors.experience && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.experience}</p>
                )}
              </div>

              {/* Organization Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Organization/Institution <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={curriculumFormData.organization}
                  onChange={(e) => handleCurriculumFormChange('organization', e.target.value)}
                  placeholder="Enter your organization or institution"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.organization
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {formErrors.organization && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.organization}</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 rounded-b-2xl">
              <button
                onClick={handleDownloadCurriculum}
                disabled={!isFormValid()}
                className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                  isFormValid()
                    ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white hover:opacity-90 cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <FileCheck className="w-5 h-5" />
                <span>Download Curriculum PDF</span>
              </button>
              <p className="text-xs text-slate-500 text-center mt-3">
                All fields marked with <span className="text-red-600">*</span> are required
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Login Page Component
function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = React.useContext(AuthContext);

  const handleLogin = (user: User) => {
    // Set user in context and localStorage
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Always redirect to dashboard after successful login
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return <Login onLogin={handleLogin} onClose={() => navigate('/')} />;
}

// Register Page Component
function RegisterPage() {
  const navigate = useNavigate();
  return <RegistrationForm onClose={() => navigate('/')} />;
}

// Shared Auth Context
const AuthContext = React.createContext<{
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}>({ currentUser: null, setCurrentUser: () => {} });

// Dashboard Page Wrapper
function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = React.useContext(AuthContext);
  const isLoggedIn = useAppSelector((state) => state.jssoAuth.isLogin);
  const jssoUserInfo = useAppSelector((state) => state.jssoAuth.userInfo);
  const isLoggingOut = useRef(false);

  const handleLogout = async () => {
    // Set flag to prevent redirect to login during logout
    isLoggingOut.current = true;
    
    // Clear Redux state
    store.dispatch(clearUserInfo());
    
    // Call JSSO logout
    try {
      await jssoService.logout();
    } catch (error) {
      console.error('Error during JSSO logout:', error);
    }
    
    // Navigate to home page first
    navigate('/', { replace: true });
    // Clear user from context and localStorage after navigation
    // Use setTimeout to ensure navigation completes before state update
    setTimeout(() => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      isLoggingOut.current = false;
    }, 0);
  };

  // Create a user object from JSSO userInfo if logged in but no currentUser
  useEffect(() => {
    if (isLoggedIn && !currentUser && jssoUserInfo?.ssoid) {
      // Create a user object from JSSO userInfo
      const jssoUser: User = {
        id: jssoUserInfo.ssoid || '',
        email: jssoUserInfo.emailId || jssoUserInfo.primaryEmail || '',
        name: jssoUserInfo.firstName || jssoUserInfo.full_name || 'User',
        role: 'user', // Default role, can be updated based on permissions
        certificationTrack: null,
        profile: {
          phone: '',
          organization: '',
          designation: '',
          location: '',
          joinedDate: new Date().toISOString(),
          bio: '',
          photo: null,
          idDocument: null,
          verified: false,
          verifiedBy: null,
          verifiedDate: null
        },
        courseProgress: {
          modules: [],
          overallProgress: 0
        },
        enrollment: {
          status: 'active',
          enrolledDate: new Date().toISOString(),
          expiryDate: null
        },
        examStatus: 'not_attempted',
        remainingAttempts: 3,
        addonAttempts: 0,
        mockTests: [],
        credlyBadgeUrl: null,
        certificateNumber: null
      };
      setCurrentUser(jssoUser);
      localStorage.setItem('currentUser', JSON.stringify(jssoUser));
    }
  }, [isLoggedIn, currentUser, jssoUserInfo, setCurrentUser]);

  // Don't redirect if we're in the process of logging out
  // Check both currentUser and JSSO login state
  if (!isLoggedIn && !currentUser && !isLoggingOut.current) {
    return <Navigate to="/" replace />;
  }

  // If not logged in and no user, show loading or redirect
  if (!isLoggedIn && !currentUser) {
    return null; // Component will unmount during navigation
  }

  // Use currentUser if available, otherwise create a temporary user from JSSO
  const userToDisplay: User | null = currentUser || (isLoggedIn && jssoUserInfo?.ssoid ? {
    id: jssoUserInfo.ssoid || '',
    email: jssoUserInfo.emailId || jssoUserInfo.primaryEmail || '',
    name: jssoUserInfo.firstName || jssoUserInfo.full_name || 'User',
    role: 'user' as const,
    certificationTrack: null,
    profile: {
      phone: '',
      organization: '',
      designation: '',
      location: '',
      joinedDate: new Date().toISOString(),
      bio: '',
      photo: null,
      idDocument: null,
      verified: false,
      verifiedBy: null,
      verifiedDate: null
    },
    courseProgress: {
      modules: [],
      overallProgress: 0
    },
    enrollment: {
      status: 'active' as const,
      enrolledDate: new Date().toISOString(),
      expiryDate: null
    },
    examStatus: 'not_attempted' as const,
    remainingAttempts: 3,
    addonAttempts: 0,
    mockTests: [],
    credlyBadgeUrl: null,
    certificateNumber: null
  } : null);

  if (!userToDisplay) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Dashboard user={userToDisplay} onLogout={handleLogout} />
    </ErrorBoundary>
  );
}

// Admin Dashboard Page Wrapper
function AdminPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = React.useContext(AuthContext);
  const isLoggingOut = useRef(false);

  const handleLogout = async () => {
    // Set flag to prevent redirect to login during logout
    isLoggingOut.current = true;
    
    // Clear Redux state
    store.dispatch(clearUserInfo());
    
    // Call JSSO logout
    try {
      await jssoService.logout();
    } catch (error) {
      console.error('Error during JSSO logout:', error);
    }
    
    // Navigate to home page first
    navigate('/', { replace: true });
    // Clear user from context and localStorage after navigation
    // Use setTimeout to ensure navigation completes before state update
    setTimeout(() => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      isLoggingOut.current = false;
    }, 0);
  };

  // Don't redirect if we're in the process of logging out
  // If no user, redirect to home page (login route is disabled)
  if (!currentUser && !isLoggingOut.current) {
    return <Navigate to="/" replace />;
  }

  // If no user and not logging out, return null (component will unmount during navigation)
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ErrorBoundary>
      <AdminDashboard user={currentUser} onLogout={handleLogout} />
    </ErrorBoundary>
  );
}

// Institution Dashboard Page Wrapper
function InstitutionPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser} = React.useContext(AuthContext);
  const isLoggingOut = useRef(false);

  const handleLogout = async () => {
    // Set flag to prevent redirect to login during logout
    isLoggingOut.current = true;
    
    // Clear Redux state
    store.dispatch(clearUserInfo());
    
    // Call JSSO logout
    try {
      await jssoService.logout();
    } catch (error) {
      console.error('Error during JSSO logout:', error);
    }
    
    // Navigate to home page first
    navigate('/', { replace: true });
    // Clear user from context and localStorage after navigation
    // Use setTimeout to ensure navigation completes before state update
    setTimeout(() => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      isLoggingOut.current = false;
    }, 0);
  };

  // Don't redirect if we're in the process of logging out
  // If no user, redirect to home page (login route is disabled)
  if (!currentUser && !isLoggingOut.current) {
    return <Navigate to="/" replace />;
  }

  // If no user and not logging out, return null (component will unmount during navigation)
  if (!currentUser) {
    return null;
  }

  if (currentUser.role !== 'institution' && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Transform user object to institution user format
  const institutionUser = {
    id: currentUser.id,
    institutionName: currentUser.profile?.organization || 'Institution',
    institutionEmail: currentUser.email,
    institutionType: currentUser.profile?.designation || 'university'
  };

  return (
    <ErrorBoundary>
      <InstitutionDashboard user={institutionUser} onLogout={handleLogout} />
    </ErrorBoundary>
  );
}

// Component to handle automatic redirect when user logs in
function AuthRedirectHandler() {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.jssoAuth.isLogin);
  const location = window.location.pathname;

  useEffect(() => {
    // Only redirect if user is logged in and not already on dashboard/admin/institution pages
    if (isLoggedIn && !location.startsWith('/dashboard') && !location.startsWith('/admin') && !location.startsWith('/institution')) {
      console.log('[AuthRedirectHandler] ✅ User logged in, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate, location]);

  return null;
}

// Main App Component with Routes
function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const user = JSON.parse(stored);
        // Validate that the user object has required fields
        if (user && user.id && user.email && user.role) {
          return user;
        }
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('currentUser');
    }
    return null;
  });

  // Initialize JSSO SDK on app mount
  useEffect(() => {
    console.log('[App] 🚀 Initializing JSSO SDK...');
    jssoService.init().then(() => {
      console.log('[App] ✅ JSSO SDK initialized successfully');
    }).catch((error) => {
      console.error('[App] ❌ Error initializing JSSO SDK:', error);
    });
  }, []);

  return (
    <Provider store={store}>
      <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
        <BrowserRouter>
          <AuthRedirectHandler />
          <Routes>
            <Route path="/" element={<Home2Page />} />
            <Route path="/page-1" element={<LandingPage />} />
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/institution" element={<InstitutionPage />} />
            <Route path="/mock-test" element={<MockTestPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </Provider>
  );
}

export default App;
