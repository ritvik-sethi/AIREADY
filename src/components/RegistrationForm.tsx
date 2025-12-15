import { useState, useEffect } from 'react';
import { X, User, Building2, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { leadService, LeadType } from '../services/leadService';
import Login from './Login';

interface RegistrationFormProps {
  onClose: () => void;
  onOpenLogin?: () => void; // Callback to open login modal
}

type RegistrationType = 'individual' | 'university' | 'school' | 'organization';

export default function RegistrationForm({ onClose, onOpenLogin }: RegistrationFormProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [formData, setFormData] = useState({
    certificationType: '' as RegistrationType | '',
    name: '',
    email: '',
    phone: '',
    organization: '',
    address: '',
    additionalInfo: '',
  });

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    // Validate certification type
    if (!formData.certificationType) {
      setValidationError('Please select a certification type');
      return;
    }

    // Validate that at least email or phone is provided
    if (!formData.email && !formData.phone) {
      setValidationError('Either email or phone number is required');
      return;
    }

    // Validate organization for non-individual types
    if (formData.certificationType !== 'individual' && !formData.organization.trim()) {
      setValidationError('Organization name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create lead for all types (including individual)
      const leadType: LeadType = formData.certificationType as LeadType;
      
      // For individual, use name as organization if organization is empty
      const organization = formData.organization.trim() || formData.name;

      await leadService.createLead({
        type: leadType,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organization: organization,
        address: formData.address || null,
        additionalInfo: formData.additionalInfo || null,
        status: 'new',
        assignedTo: null,
        estimatedValue: null,
        followUpDate: null,
      });

      // Close registration modal
      onClose();
      
      // Open login modal
      if (onOpenLogin) {
        onOpenLogin();
      } else {
        setShowLogin(true);
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      setValidationError('There was an error submitting your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenLogin = () => {
    onClose();
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      setShowLogin(true);
    }
  };

  const getTypeLabel = (type: RegistrationType) => {
    switch (type) {
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

  // If showLogin is true, render Login component
  if (showLogin) {
    return (
      <Login
        onLogin={() => {
          setShowLogin(false);
          onClose();
        }}
        onClose={() => {
          setShowLogin(false);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-3 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-900">Registration Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Validation Error Message */}
            {validationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{validationError}</p>
              </div>
            )}

            {/* Certification Type - Mandatory Field - Full Width */}
            <div>
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 mb-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Certification Type <span className="text-red-600">*</span></span>
              </label>
              <select
                name="certificationType"
                value={formData.certificationType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-white"
              >
                <option value="">Select certification type</option>
                <option value="individual">Individual Professional</option>
                <option value="university">University</option>
                <option value="school">School/College</option>
                <option value="organization">AI Service Provider</option>
              </select>
              {formData.certificationType && (
                <p className="text-xs text-slate-500 mt-1">
                  {formData.certificationType === 'individual' 
                    ? 'For professionals seeking personal AI competency certification'
                    : formData.certificationType === 'university'
                    ? 'For higher education institutions implementing AI-ready programs'
                    : formData.certificationType === 'school'
                    ? 'For educational campuses integrating AI literacy programs'
                    : 'For organizations providing AI solutions and services'}
                </p>
              )}
            </div>

            {/* Grid Layout for Name and Email - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 mb-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate">Full Name {formData.certificationType !== 'individual' && '/ Contact'}</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 mb-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Grid Layout for Phone and Organization - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 mb-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Organization Name - Required for non-individual */}
              {formData.certificationType !== 'individual' ? (
                <div>
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 mb-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Organization <span className="text-red-600">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    required={formData.certificationType !== 'individual'}
                    className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter organization name"
                  />
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {/* Address - Full Width */}
            <div>
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 mb-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Address</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="City, State, Country"
              />
            </div>

            {/* Additional Information - Full Width */}
            <div>
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 mb-1.5">
                <span>Additional Information (Optional)</span>
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 text-sm border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                placeholder="Any additional information you'd like to share..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>

            {/* Already a user? Log in CTA */}
            <div className="pt-1 text-center">
              <p className="text-xs text-slate-600">
                Already a user?{' '}
                <button
                  type="button"
                  onClick={handleOpenLogin}
                  className="text-primary-600 hover:text-primary-700 font-semibold underline"
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
