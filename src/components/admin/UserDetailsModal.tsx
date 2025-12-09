import { useState } from 'react';
import { X, CheckCircle, XCircle, Mail, Phone, Building, MapPin, Calendar, Shield, FileText, Edit2, Save, AlertCircle, Key, Clock } from 'lucide-react';
import { User } from '../../services/authService';

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export default function UserDetailsModal({ user, onClose, onSave }: UserDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const handleSave = () => {
    onSave(editedUser);
    setIsEditing(false);
  };

  const handleVerify = () => {
    const updatedUser = {
      ...editedUser,
      profile: {
        ...editedUser.profile,
        verified: true,
        verifiedBy: 'admin@etaiready.com',
        verifiedDate: new Date().toISOString().split('T')[0]
      }
    };
    setEditedUser(updatedUser);
    onSave(updatedUser);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, you would upload to a server
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({
          ...editedUser,
          profile: {
            ...editedUser.profile,
            photo: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendPasswordReset = () => {
    // In production, this would send an email
    setShowPasswordReset(true);
    setTimeout(() => setShowPasswordReset(false), 3000);
  };

  const handleEnrollmentChange = (status: 'active' | 'suspended' | 'expired' | 'admin') => {
    setEditedUser({
      ...editedUser,
      enrollment: {
        ...editedUser.enrollment,
        status
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white relative rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
              {editedUser.profile.photo ? (
                <img src={editedUser.profile.photo} alt={editedUser.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">{editedUser.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-3xl font-bold">{editedUser.name}</h2>
                {editedUser.profile.verified ? (
                  <div className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Pending Verification</span>
                  </div>
                )}
              </div>
              <p className="text-white/90 text-lg">{editedUser.profile.designation}</p>
              <p className="text-white/80 text-sm">{editedUser.email}</p>
            </div>
            <div className="flex flex-col space-y-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all font-semibold"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Details</span>
                  </button>
                  {!editedUser.profile.verified && (
                    <button
                      onClick={handleVerify}
                      className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all font-semibold"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Verify User</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all font-semibold"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showPasswordReset && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700 font-semibold">Password reset link sent to {editedUser.email}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-slate-900">{editedUser.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <p className="text-slate-900">{editedUser.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.profile.phone}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          profile: {...editedUser.profile, phone: e.target.value}
                        })}
                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <p className="text-slate-900">{editedUser.profile.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Organization</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.profile.organization}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          profile: {...editedUser.profile, organization: e.target.value}
                        })}
                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-slate-500" />
                        <p className="text-slate-900">{editedUser.profile.organization}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Designation</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.profile.designation}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          profile: {...editedUser.profile, designation: e.target.value}
                        })}
                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                    ) : (
                      <p className="text-slate-900">{editedUser.profile.designation}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.profile.location}
                        onChange={(e) => setEditedUser({
                          ...editedUser,
                          profile: {...editedUser.profile, location: e.target.value}
                        })}
                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <p className="text-slate-900">{editedUser.profile.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Documents</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Profile Photo</label>
                    {editedUser.profile.photo ? (
                      <div className="flex items-center space-x-3">
                        <img
                          src={editedUser.profile.photo}
                          alt="Profile"
                          className="w-20 h-20 rounded-lg object-cover border-2 border-slate-200"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-slate-600">Photo uploaded</p>
                          <a
                            href={editedUser.profile.photo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 text-sm font-semibold block mb-2"
                          >
                            View Photo
                          </a>
                          {isEditing && (
                            <label className="cursor-pointer inline-block">
                              <span className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                                Change Photo
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-500 text-sm mb-2">No photo uploaded</p>
                        {isEditing && (
                          <label className="cursor-pointer">
                            <span className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all font-semibold text-sm">
                              <span>Upload Photo</span>
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">ID Document</label>
                    {editedUser.profile.idDocument ? (
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border-2 border-slate-200">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">ID Document</p>
                            <p className="text-xs text-slate-500">Uploaded and awaiting verification</p>
                          </div>
                        </div>
                        <a
                          href={editedUser.profile.idDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 text-sm font-semibold"
                        >
                          View Document
                        </a>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">No ID document uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Enrollment Status */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Enrollment Status</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Status</label>
                    {isEditing ? (
                      <select
                        value={editedUser.enrollment.status}
                        onChange={(e) => handleEnrollmentChange(e.target.value as any)}
                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="expired">Expired</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                        editedUser.enrollment.status === 'active' ? 'bg-green-100 text-green-700' :
                        editedUser.enrollment.status === 'suspended' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {editedUser.enrollment.status === 'active' ? <CheckCircle className="w-4 h-4" /> :
                         editedUser.enrollment.status === 'suspended' ? <XCircle className="w-4 h-4" /> :
                         <Clock className="w-4 h-4" />}
                        <span className="capitalize">{editedUser.enrollment.status}</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Enrolled Date</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <p className="text-slate-900">
                        {new Date(editedUser.enrollment.enrolledDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {editedUser.enrollment.expiryDate && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">Expiry Date</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <p className="text-slate-900">
                          {new Date(editedUser.enrollment.expiryDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Details */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Verification Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Verification Status</label>
                    {editedUser.profile.verified ? (
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700">Verified</span>
                        </div>
                        {editedUser.profile.verifiedBy && (
                          <p className="text-sm text-green-600">Verified by: {editedUser.profile.verifiedBy}</p>
                        )}
                        {editedUser.profile.verifiedDate && (
                          <p className="text-sm text-green-600">
                            Date: {new Date(editedUser.profile.verifiedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-700">Pending Verification</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Learning Progress */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Learning Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-600">Overall Progress</span>
                      <span className="text-2xl font-bold text-purple-600">{editedUser.courseProgress?.overallProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-red-600 h-full rounded-full transition-all"
                        style={{ width: `${editedUser.courseProgress?.overallProgress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Modules Completed</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {editedUser.courseProgress?.modules?.filter(m => m.status === 'completed').length || 0}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Tests Completed</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {editedUser.mockTests?.filter(t => t.completed).length || 0}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Exam Status</label>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      editedUser.examStatus === 'passed' ? 'bg-green-100 text-green-700' :
                      editedUser.examStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {editedUser.examStatus === 'passed' && <CheckCircle className="w-4 h-4" />}
                      {editedUser.examStatus === 'failed' && <XCircle className="w-4 h-4" />}
                      {editedUser.examStatus === 'not_attempted' && <Clock className="w-4 h-4" />}
                      <span className="capitalize">{editedUser.examStatus.replace('_', ' ')}</span>
                    </span>
                    <p className="text-sm text-slate-500 mt-2">
                      Remaining Attempts: {editedUser.remainingAttempts}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Admin Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleSendPasswordReset}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-200 transition-all font-semibold"
                  >
                    <Key className="w-5 h-5" />
                    <span>Send Password Reset Link</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 bg-orange-100 text-orange-700 px-4 py-3 rounded-lg hover:bg-orange-200 transition-all font-semibold">
                    <Mail className="w-5 h-5" />
                    <span>Send Email Notification</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              User ID: {editedUser.id} | Member since {new Date(editedUser.profile.joinedDate).toLocaleDateString()}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-all font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
