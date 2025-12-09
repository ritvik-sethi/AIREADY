import { useState, useEffect } from 'react';
import { X, User, Building2, Mail, Phone, MapPin, CheckCircle, CreditCard, AlertCircle } from 'lucide-react';
import { leadService, LeadType } from '../services/leadService';
import { authService, User as UserType } from '../services/authService';
import Login from './Login';
import { useIsAuthenticated, useUserInfo } from '../hooks/useJSSO';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setAvailablePlans } from '../store/slices/loginFlowSlice';
import { PaymentPlan, continueToPay } from '../utils/paymentUtils';
import { PlanSelectionScreen } from './loginFlow/PlanSelectionScreen';
import { store } from '../store';

interface CertificationFlowModalProps {
  onClose: () => void;
}

type RegistrationType = 'individual' | 'university' | 'school' | 'organization';

export default function CertificationFlowModal({ onClose }: CertificationFlowModalProps) {
  const isAuthenticated = useIsAuthenticated();
  const userInfo = useUserInfo();
  const dispatch = useAppDispatch();
  const availablePlans = useAppSelector((state) => state.loginFlow.availablePlans);
  const [step, setStep] = useState<'type' | 'form' | 'auth' | 'plan' | 'success'>('type');
  const [registrationType, setRegistrationType] = useState<RegistrationType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [userExists, setUserExists] = useState<boolean>(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    address: '',
    additionalInfo: '',
  });

  // Populate form data from userInfo when authenticated
  useEffect(() => {
    if (isAuthenticated && userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.firstName || userInfo.full_name || prev.name,
        email: userInfo.primaryEmail || userInfo.emailId || prev.email,
        phone: userInfo.loginId || prev.phone,
      }));
    }
  }, [isAuthenticated, userInfo]);

  // Initialize default plans if not already set
  useEffect(() => {
    if (availablePlans.length === 0) {
      const defaultPlans: PaymentPlan[] = [
        {
          planCode: 'ET_AI_READY_BASIC',
          planName: 'ET AI Ready Basic',
          flatDiscount: '20%',
          recurring: 'true',
          planPeriod: '1',
          planPeriodUnit: 'month',
          finalPlanPrice: 1999,
          currency: 'INR',
          abTestKey: { set: 'default' },
          checkReferer: false,
        },
        {
          planCode: 'ET_AI_READY_PREMIUM',
          planName: 'ET AI Ready Premium',
          flatDiscount: '25%',
          recurring: 'true',
          planPeriod: '3',
          planPeriodUnit: 'month',
          finalPlanPrice: 4999,
          currency: 'INR',
          abTestKey: { set: 'default' },
          checkReferer: false,
        },
      ];
      dispatch(setAvailablePlans(defaultPlans));
    }
  }, [dispatch, availablePlans.length]);


  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleTypeSelect = (type: RegistrationType) => {
    setRegistrationType(type);
    
    // If user is logged in and selects individual, go directly to plan selection
    if (isAuthenticated && type === 'individual') {
      setStep('plan');
    } else {
      // Otherwise, show form
      setStep('form');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setIsSubmitting(true);

    try {
      if (!formData.email && !formData.phone) {
        setValidationError('Either email or phone number is required');
        setIsSubmitting(false);
        return;
      }

      const emailToCheck = formData.email.trim() || null;
      const phoneToCheck = formData.phone.trim() || null;

      const userCheckResult = await authService.checkUserExists(emailToCheck, phoneToCheck);
      
      if (userCheckResult.exists) {
        const primaryIdentifier = userCheckResult.primaryIdentifier;
        
        if (primaryIdentifier) {
          if (primaryIdentifier === 'email' && !emailToCheck) {
            setValidationError('This account is registered with email. Please use your email address to login.');
            setIsSubmitting(false);
            return;
          }
          if (primaryIdentifier === 'phone' && !phoneToCheck) {
            setValidationError('This account is registered with phone number. Please use your phone number to login.');
            setIsSubmitting(false);
            return;
          }
          
          if (primaryIdentifier === 'email') {
            setVerifiedEmail(userCheckResult.email || emailToCheck);
            setVerifiedPhone(null);
          } else {
            setVerifiedPhone(userCheckResult.phone || phoneToCheck);
            setVerifiedEmail(null);
          }
        } else {
          setVerifiedEmail(userCheckResult.email || emailToCheck);
          setVerifiedPhone(userCheckResult.phone || phoneToCheck);
        }
        
        setUserExists(true);
        
        if (registrationType === 'individual') {
          setStep('auth');
        } else {
          setValidationError('An account with this email or phone number already exists. Please login to continue.');
          setIsSubmitting(false);
          return;
        }
        setIsSubmitting(false);
        return;
      }

      if (registrationType === 'individual') {
        setUserExists(false);
        setVerifiedEmail(emailToCheck);
        setVerifiedPhone(phoneToCheck);
        setStep('auth');
        setIsSubmitting(false);
        return;
      } else {
        const leadType: LeadType = registrationType as LeadType;

        await leadService.createLead({
          type: leadType,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          address: formData.address,
          additionalInfo: formData.additionalInfo,
          status: 'new',
          assignedTo: null,
          estimatedValue: null,
          followUpDate: null,
        });

        setStep('success');
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      setValidationError('There was an error submitting your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelection = (plan: PaymentPlan) => {
    setIsSubmitting(true);
    
    try {
      // Use continueToPay from paymentUtils which handles the payment flow
      continueToPay(plan, dispatch, store.getState);
      
      // Note: continueToPay will handle redirecting to payment gateway
      // The modal will be closed when user is redirected
      // If payment is successful, they'll be redirected back and we can handle success
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('There was an error processing your payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = () => {
    switch (registrationType) {
      case 'individual':
        return 'Individual Professional';
      case 'university':
        return 'University';
      case 'school':
        return 'School/College';
      case 'organization':
        return 'AI Service Provider';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-slate-900">
            {step === 'type' && 'Select Certification Type'}
            {step === 'form' && 'Registration Details'}
            {step === 'plan' && 'Select Your Plan'}
            {step === 'success' && (registrationType === 'individual' && paymentCompleted ? 'Payment Successful!' : 'Registration Received!')}
            {step === 'auth' && (userExists ? 'Login to Continue' : 'Create Account')}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 'type' && (
            <div className="space-y-4">
              <p className="text-slate-600 mb-6">
                Choose the certification category that best describes you or your organization.
              </p>
              <button
                onClick={() => handleTypeSelect('individual')}
                className="w-full bg-gradient-to-br from-primary-50 to-red-50 border-2 border-primary-200 rounded-xl p-6 hover:border-primary-400 transition-all text-left group"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-500 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Individual Professional</h3>
                    <p className="text-slate-600 text-sm">
                      For professionals seeking personal AI competency certification
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleTypeSelect('university')}
                className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:border-green-400 transition-all text-left group"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">University</h3>
                    <p className="text-slate-600 text-sm">
                      For higher education institutions implementing AI-ready programs
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleTypeSelect('school')}
                className="w-full bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 hover:border-orange-400 transition-all text-left group"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">School or College</h3>
                    <p className="text-slate-600 text-sm">
                      For educational campuses integrating AI literacy programs
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleTypeSelect('organization')}
                className="w-full bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-xl p-6 hover:border-violet-400 transition-all text-left group"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-violet-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">AI Service Provider</h3>
                    <p className="text-slate-600 text-sm">
                      For organizations providing AI solutions and services
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600">
                  Selected: <span className="font-semibold text-slate-900">{getTypeLabel()}</span>
                  <button
                    type="button"
                    onClick={() => setStep('type')}
                    className="ml-2 text-primary-500 hover:text-primary-600 text-sm font-medium"
                  >
                    Change
                  </button>
                </p>
              </div>

              {validationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{validationError}</p>
                </div>
              )}

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                  <User className="w-4 h-4" />
                  <span>Full Name {registrationType !== 'individual' && '/ Contact Person'}</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {registrationType !== 'individual' && (
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>Organization Name</span>
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    required={registrationType === 'university' || registrationType === 'school' || registrationType === 'organization'}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter organization name"
                  />
                </div>
              )}

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="City, State, Country"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                  <span>Additional Information (Optional)</span>
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('type')}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          )}

          {step === 'auth' && (
            <div className="space-y-6">
              {userExists ? (
                <div>
                  <p className="text-slate-600 mb-6">
                    {verifiedEmail && !verifiedPhone 
                      ? `An account with email ${verifiedEmail} already exists. Please login to continue.`
                      : verifiedPhone && !verifiedEmail
                      ? `An account with phone ${verifiedPhone} already exists. Please login to continue.`
                      : `An account already exists. Please login to continue.`
                    }
                  </p>
                  <Login
                    initialEmail={verifiedEmail}
                    initialPhone={verifiedPhone}
                    initialStep="password"
                    onLogin={() => {
                      setStep('plan');
                    }}
                    onClose={() => {
                      setStep('form');
                    }}
                  />
                </div>
              ) : (
                <div>
                  <p className="text-slate-600 mb-6">
                    Create an account to proceed with course selection. You'll need to set a password and complete your profile.
                  </p>
                  <Login
                    initialEmail={verifiedEmail}
                    initialPhone={verifiedPhone}
                    initialName={formData.name}
                    initialStep="signup"
                    onLogin={() => {
                      setStep('plan');
                    }}
                    onClose={() => {
                      setStep('form');
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {step === 'plan' && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600">
                  Registering as: <span className="font-semibold text-slate-900">{formData.name || 'Individual Professional'}</span>
                  {formData.name && !isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      className="ml-2 text-primary-500 hover:text-primary-600 text-sm font-medium"
                    >
                      Edit Details
                    </button>
                  )}
                </p>
              </div>

              <PlanSelectionScreen
                plans={availablePlans}
                onPlanSelect={handlePlanSelection}
                isLoading={isSubmitting}
              />

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => isAuthenticated ? setStep('type') : setStep('form')}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              {registrationType === 'individual' && paymentCompleted ? (
                <>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Payment Successful!</h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Your payment has been processed successfully. Welcome to AI Ready certification program!
                  </p>
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-slate-900 mb-2">Next Steps:</h4>
                    <ol className="text-left text-slate-600 space-y-2 text-sm">
                      <li>1. Check your email for account activation link</li>
                      <li>2. Login to your dashboard and start learning</li>
                      <li>3. Complete course modules and practice tests</li>
                      <li>4. Schedule your certification exam on Talview</li>
                      <li>5. Receive your certificate via Credly upon passing</li>
                    </ol>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-purple-600 to-red-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-all font-semibold"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Registration Received!</h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Thank you for your interest in AI Ready certification for your {getTypeLabel().toLowerCase()}. Our team will contact you shortly to discuss the program details and pricing.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-slate-900 mb-2">What happens next?</h4>
                    <ol className="text-left text-slate-600 space-y-2 text-sm">
                      <li>1. Our sales team will reach out within 24-48 hours</li>
                      <li>2. We'll schedule a consultation to understand your needs</li>
                      <li>3. You'll receive a customized proposal with pricing</li>
                      <li>4. Once approved, we'll onboard your institution</li>
                    </ol>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">
                    You can also reach us at <a href="mailto:sales@etaiready.com" className="text-primary-600 font-semibold hover:underline">sales@etaiready.com</a>
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

