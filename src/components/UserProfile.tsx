import { useState } from 'react';
import { User as UserIcon, Mail, Phone, Building, MapPin, Calendar, Edit2, X, Save, Camera } from 'lucide-react';
import { User } from '../services/authService';

interface UserProfileProps {
  user: User;
  onClose: () => void;
  onSave?: (updatedUser: User) => void;
}

export default function UserProfile({ user, onClose, onSave }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleSave = () => {
    if (onSave) {
      onSave(editedUser);
    }
    setIsEditing(false);
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-purple-600 p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
                {editedUser.profile.photo ? (
                  <img src={editedUser.profile.photo} alt={editedUser.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 text-white" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{editedUser.name}</h2>
              <p className="text-white/90">{editedUser.profile.designation}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8 space-y-6">
          {/* Bio */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">About</h3>
            {isEditing ? (
              <textarea
                value={editedUser.profile.bio}
                onChange={(e) => setEditedUser({
                  ...editedUser,
                  profile: { ...editedUser.profile, bio: e.target.value }
                })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none min-h-[100px]"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">{editedUser.profile.bio}</p>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Email</p>
                  <p className="text-slate-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="w-5 h-5 text-slate-500" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 font-semibold">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.profile.phone}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        profile: { ...editedUser.profile, phone: e.target.value }
                      })}
                      className="w-full mt-1 px-2 py-1 border border-slate-300 rounded focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-slate-900">{editedUser.profile.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Information</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Building className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Organization</p>
                  <p className="text-slate-900">{user.profile.organization}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Location</p>
                  <p className="text-slate-900">{user.profile.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg md:col-span-2">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Member Since</p>
                  <p className="text-slate-900">
                    {new Date(user.profile.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Stats */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Learning Progress</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                <p className="text-sm text-blue-700 font-semibold mb-1">Overall Progress</p>
                <p className="text-3xl font-bold text-blue-600">{user.courseProgress.overallProgress}%</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
                <p className="text-sm text-green-700 font-semibold mb-1">Modules Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {user.courseProgress.modules.filter(m => m.status === 'completed').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200">
                <p className="text-sm text-purple-700 font-semibold mb-1">Tests Completed</p>
                <p className="text-3xl font-bold text-purple-600">
                  {user.mockTests.filter(t => t.completed).length}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold"
            >
              Close
            </button>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setEditedUser(user);
                    setIsEditing(false);
                  }}
                  className="px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
