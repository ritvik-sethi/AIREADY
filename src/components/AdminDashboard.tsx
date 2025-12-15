import { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, Award, TrendingUp, Settings, User as UserIcon, CheckCircle, XCircle, Clock, Search, Plus, Mail, Shield, Trash2, Building2, UserCog } from 'lucide-react';
import { User } from '../services/authService';
import { authService } from '../services/authService';
import { getAllUsers, getAllModules, getAllMockTests, getAllRoles, getAllCertificationTracks, createUser, deleteUser, updateUser, createMockTest, updateMockTest, deleteMockTest } from '../services/database';
import UserDetailsModal from './admin/UserDetailsModal';
import CourseEditor from './admin/CourseEditor';
import TestEditor from './admin/TestEditor';
import CertificationProgramsManager from './admin/CertificationProgramsManager';
import BulkOperations from './admin/BulkOperations';
import SettingsConfiguration from './admin/SettingsConfiguration';
import RoleManagement from './admin/RoleManagement';
import InstitutionsManager from './admin/InstitutionsManager';
import LeadsManager from './admin/LeadsManager';
import DashboardHeader from './dashboard/DashboardHeader';
import UserProfile from './UserProfile';
import styles from './AdminDashboard.module.css';
import { store } from '../store';
import { clearUserInfo } from '../store/slices/jssoAuthSlice';
import { jssoService } from '../services/jssoService';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'programs' | 'institutions' | 'leads' | 'bulk' | 'roles' | 'settings' | 'mockTests'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [showTestEditor, setShowTestEditor] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    adminRole: 'content_manager',
    organization: '',
    designation: '',
    location: '',
    phone: ''
  });
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    certificationTrack: 'ai-technical',
    organization: '',
    designation: '',
    location: '',
    phone: ''
  });

  // Database-loaded data
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [mockTests, setMockTests] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [certificationTracks, setCertificationTracks] = useState<any[]>([]);

  useEffect(() => {
    // Load all data from database
    const loadData = async () => {
      try {
        const [usersData, modulesData, testsData, rolesData, tracksData] = await Promise.all([
          getAllUsers(),
          getAllModules(),
          getAllMockTests(),
          getAllRoles(),
          getAllCertificationTracks()
        ]);

        setAllUsers(usersData.filter((u: any) => u.role === 'user'));
        setModules(modulesData);
        setMockTests(testsData);
        setRoles(rolesData);
        setCertificationTracks(tracksData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
      }
    };

    loadData();
    // Get user permissions on component mount
    setUserPermissions(authService.getUserPermissionsSync(user));
  }, [user]);

  // Helper function to check permissions
  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission);
  };

  // Calculate statistics from database-loaded data
  const totalUsers = allUsers.length;
  const passedUsers = allUsers.filter(u => u.examStatus === 'passed').length;
  const activeUsers = allUsers.filter(u => u.courseProgress?.modules?.length > 0 && (u.courseProgress?.overallProgress || 0) > 0).length;
  const totalModules = modules.length;
  const totalTests = mockTests.length;

  const handleLogout = async () => {
    // Clear Redux state
    store.dispatch(clearUserInfo());
    
    // Call JSSO logout
    try {
      await jssoService.logout(() => {
        // Clear localStorage
        localStorage.removeItem('currentUser');
        // Call parent logout handler
        onLogout();
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear localStorage and call parent logout handler even if logout fails
      localStorage.removeItem('currentUser');
      onLogout();
    }
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleProfileSave = async (updatedUser: User) => {
    try {
      // Update admin user in database
      await updateUser(parseInt(updatedUser.id), {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.profile.phone || null,
        organization: updatedUser.profile.organization || null,
        designation: updatedUser.profile.designation || null,
        location: updatedUser.profile.location || null,
        bio: updatedUser.profile.bio || null,
        photo: updatedUser.profile.photo || null,
        idDocument: updatedUser.profile.idDocument || null,
        verified: updatedUser.profile.verified,
        verifiedBy: updatedUser.profile.verifiedBy || null,
        verifiedDate: updatedUser.profile.verifiedDate || null,
        enrollmentStatus: updatedUser.enrollment.status,
        enrolledDate: updatedUser.enrollment.enrolledDate || null,
        expiryDate: updatedUser.enrollment.expiryDate || null,
        examStatus: updatedUser.examStatus,
        remainingAttempts: updatedUser.remainingAttempts,
        credlyBadgeUrl: updatedUser.credlyBadgeUrl || null,
        certificateNumber: updatedUser.certificateNumber || null,
        certificationTrack: updatedUser.certificationTrack || null
      });

      // Update localStorage with new user data
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      alert('Profile updated successfully!');
      setShowProfile(false);
      
      // Optionally refresh the page or update parent component
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      // Update user in database
      await updateUser(parseInt(updatedUser.id), {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.profile.phone || null,
        organization: updatedUser.profile.organization || null,
        designation: updatedUser.profile.designation || null,
        location: updatedUser.profile.location || null,
        bio: updatedUser.profile.bio || null,
        photo: updatedUser.profile.photo || null,
        idDocument: updatedUser.profile.idDocument || null,
        verified: updatedUser.profile.verified,
        verifiedBy: updatedUser.profile.verifiedBy || null,
        verifiedDate: updatedUser.profile.verifiedDate || null,
        enrollmentStatus: updatedUser.enrollment.status,
        enrolledDate: updatedUser.enrollment.enrolledDate || null,
        expiryDate: updatedUser.enrollment.expiryDate || null,
        examStatus: updatedUser.examStatus,
        remainingAttempts: updatedUser.remainingAttempts,
        credlyBadgeUrl: updatedUser.credlyBadgeUrl || null,
        certificateNumber: updatedUser.certificateNumber || null,
        certificationTrack: updatedUser.certificationTrack || null
      });

      alert('User details updated successfully!');
      setSelectedUser(null);

      // Reload users data to reflect changes
      const usersData = await getAllUsers();
      setAllUsers(usersData.filter((u: any) => u.role === 'user'));
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    }
  };

  const handleSaveCourse = (course: any) => {
    // In production, this would make an API call
    alert('Course module saved successfully!');
    setShowCourseEditor(false);
    setEditingCourse(null);
  };

  const handleSaveTest = async (test: any) => {
    try {
      if (editingTest) {
        // Update existing test
        await updateMockTest(test.id, {
          title: test.title,
          description: test.description,
          duration: test.duration,
          totalQuestions: test.totalQuestions,
          passingScore: test.passingScore,
          questions: test.questions,
        });
        alert('Mock test updated successfully!');
      } else {
        // Create new test
        await createMockTest({
          id: test.id,
          title: test.title,
          description: test.description,
          duration: test.duration,
          totalQuestions: test.totalQuestions,
          passingScore: test.passingScore,
          questions: test.questions,
        });
        alert('Mock test created successfully!');
      }

      // Reload mock tests
      const testsData = await getAllMockTests();
      setMockTests(testsData);

      setShowTestEditor(false);
      setEditingTest(null);
    } catch (error: any) {
      console.error('Error saving mock test:', error);
      alert(`Error saving mock test: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteTest = async (testId: string, testTitle: string) => {
    if (confirm(`Are you sure you want to delete "${testTitle}"?\n\nThis action cannot be undone.`)) {
      try {
        await deleteMockTest(testId);
        alert(`Mock test "${testTitle}" has been deleted successfully.`);

        // Reload mock tests
        const testsData = await getAllMockTests();
        setMockTests(testsData);
      } catch (error: any) {
        console.error('Error deleting mock test:', error);
        alert(`Error deleting mock test: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleSaveAdmin = async () => {
    // Validate form
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert('Please fill in all required fields (Name, Email, Password)');
      return;
    }

    try {
      const selectedRole = roles.find(r => r.id === newAdmin.adminRole);
      const enrollmentDate = new Date().toISOString().split('T')[0];

      // Create admin in database
      await createUser({
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        role: 'admin',
        adminRole: newAdmin.adminRole,
        phone: newAdmin.phone || '+91 00000 00000',
        organization: newAdmin.organization || 'Economic Times',
        designation: newAdmin.designation || 'Administrator',
        location: newAdmin.location || 'India',
        joinedDate: enrollmentDate,
        bio: `Admin user with ${selectedRole?.name} role.`,
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newAdmin.name}`,
        enrollmentStatus: 'admin',
        enrolledDate: enrollmentDate,
        expiryDate: undefined
      });

      alert(`Admin user "${newAdmin.name}" created successfully!\n\nEmail: ${newAdmin.email}\nRole: ${selectedRole?.name}\n\nThey can now log in with their credentials.`);

      // Reset form and close modal
      setNewAdmin({
        name: '',
        email: '',
        password: '',
        adminRole: 'content_manager',
        organization: '',
        designation: '',
        location: '',
        phone: ''
      });
      setShowAddAdmin(false);

      // Reload users data
      const usersData = await getAllUsers();
      setAllUsers(usersData.filter((u: any) => u.role === 'user'));
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error creating admin user. Please try again.');
    }
  };

  const handleCreateUser = async () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields (Name, Email, Password)');
      return;
    }

    try {
      // Get selected track details
      const track = certificationTracks.find(t => t.id === newUser.certificationTrack);
      const enrollmentDate = new Date().toISOString().split('T')[0];
      const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 1 year from now

      // Create user in database
      await createUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: 'user',
        certificationTrack: newUser.certificationTrack,
        phone: newUser.phone || '+91 00000 00000',
        organization: newUser.organization || 'Organization',
        designation: newUser.designation || 'Professional',
        location: newUser.location || 'India',
        joinedDate: enrollmentDate,
        bio: `Enrolled in ${track?.name} certification program.`,
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`,
        enrollmentStatus: 'active',
        enrolledDate: enrollmentDate,
        expiryDate: expiryDate
      });

      alert(`User "${newUser.name}" created successfully!\n\nEmail: ${newUser.email}\nCertification Track: ${track?.name}\nExpiry: ${expiryDate}\n\nThey can now log in with their credentials.`);

      // Reset form and close modal
      setNewUser({
        name: '',
        email: '',
        password: '',
        certificationTrack: 'ai-technical',
        organization: '',
        designation: '',
        location: '',
        phone: ''
      });
      setShowAddUser(false);

      // Reload users data
      const usersData = await getAllUsers();
      setAllUsers(usersData.filter((u: any) => u.role === 'user'));
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to permanently delete user "${userName}"?\n\nThis action cannot be undone.`)) {
      try {
        // Delete user from database
        await deleteUser(parseInt(userId));
        alert(`User "${userName}" has been permanently deleted.`);

        // Reload users data
        const usersData = await getAllUsers();
        setAllUsers(usersData.filter((u: any) => u.role === 'user'));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.profile.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Modals */}
      {showProfile && (
        <UserProfile
          user={user}
          onClose={() => setShowProfile(false)}
          onSave={handleProfileSave}
        />
      )}

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {showCourseEditor && (
        <CourseEditor
          module={editingCourse}
          onClose={() => {
            setShowCourseEditor(false);
            setEditingCourse(null);
          }}
          onSave={handleSaveCourse}
        />
      )}

      {showTestEditor && (
        <TestEditor
          test={editingTest}
          onClose={() => {
            setShowTestEditor(false);
            setEditingTest(null);
          }}
          onSave={handleSaveTest}
        />
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-red-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Add New User</h2>
              <p className="text-white/90 text-sm mt-1">Create a new user account and enroll in certification track</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Enter password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
              </div>

              {/* Certification Track */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Certification Track</h3>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Certification Track <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={newUser.certificationTrack}
                    onChange={(e) => setNewUser({ ...newUser, certificationTrack: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    {certificationTracks.map((track) => (
                      <option key={track.id} value={track.id}>
                        {track.name} - {track.duration} (₹{track.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-slate-600 mt-2">
                    <span className="font-semibold">Description: </span>
                    {certificationTracks.find(t => t.id === newUser.certificationTrack)?.description}
                  </p>
                </div>
              </div>

              {/* Organization Details */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Organization Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={newUser.organization}
                      onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Organization name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={newUser.designation}
                      onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Job title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newUser.location}
                      onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t-2 border-slate-200">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg hover:opacity-90 transition-all font-semibold"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-red-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Add New Admin</h2>
              <p className="text-white/90 text-sm mt-1">Create a new administrator account with assigned role</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="admin@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Enter password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newAdmin.phone}
                      onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Role */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Admin Role & Permissions</h3>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Role <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={newAdmin.adminRole}
                    onChange={(e) => setNewAdmin({ ...newAdmin, adminRole: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-slate-600 mt-2">
                    <span className="font-semibold">Permissions: </span>
                    {roles.find(r => r.id === newAdmin.adminRole)?.permissions.length || 0} assigned
                  </p>
                </div>
              </div>

              {/* Organization Details */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Organization Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={newAdmin.organization}
                      onChange={(e) => setNewAdmin({ ...newAdmin, organization: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Economic Times"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={newAdmin.designation}
                      onChange={(e) => setNewAdmin({ ...newAdmin, designation: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Administrator"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newAdmin.location}
                      onChange={(e) => setNewAdmin({ ...newAdmin, location: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="India"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t-2 border-slate-200">
                <button
                  onClick={() => setShowAddAdmin(false)}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAdmin}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg hover:opacity-90 transition-all font-semibold"
                >
                  Create Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.dashboard}>
        <DashboardHeader
          userName={user.name}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
        />

        <main className={styles.main}>
          {/* Welcome Section */}
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>Welcome, {user.name}!</h1>
            <p className={styles.welcomeSubtitle}>Manage users, courses, and monitor platform performance</p>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <Users className={`${styles.statIcon} ${styles.iconBlue}`} />
                <span className={styles.statValue}>{totalUsers}</span>
              </div>
              <h3 className={styles.statLabel}>Total Users</h3>
              <p className={styles.statSubtext}>{activeUsers} active learners</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <CheckCircle className={`${styles.statIcon} ${styles.iconGreen}`} />
                <span className={styles.statValue}>{passedUsers}</span>
              </div>
              <h3 className={styles.statLabel}>Certified Users</h3>
              <p className={styles.statSubtext}>{totalUsers > 0 ? Math.round((passedUsers/totalUsers)*100) : 0}% success rate</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <BookOpen className={`${styles.statIcon}`} style={{ color: '#667eea' }} />
                <span className={styles.statValue}>{totalModules}</span>
              </div>
              <h3 className={styles.statLabel}>Course Modules</h3>
              <p className={styles.statSubtext}>Active curriculum</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <FileText className={`${styles.statIcon}`} style={{ color: '#f59e0b' }} />
                <span className={styles.statValue}>{totalTests}</span>
              </div>
              <h3 className={styles.statLabel}>Mock Tests</h3>
              <p className={styles.statSubtext}>Available assessments</p>
            </div>
          </div>

        {/* Tabs Navigation */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsNav}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`${styles.tabButton} ${
                activeTab === 'overview'
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive
              }`}
            >
              <TrendingUp className={styles.tabIcon} />
              <span>Overview</span>
            </button>
            {hasPermission('manage_users') && (
              <button
                onClick={() => setActiveTab('users')}
                className={`${styles.tabButton} ${
                  activeTab === 'users'
                    ? styles.tabButtonActive
                    : styles.tabButtonInactive
                }`}
              >
                <Users className={styles.tabIcon} />
                <span>Users</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('programs')}
              className={`${styles.tabButton} ${
                activeTab === 'programs'
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive
              }`}
            >
              <Award className={styles.tabIcon} />
              <span>Certification Programs</span>
            </button>
            <button
              onClick={() => setActiveTab('mockTests')}
              className={`${styles.tabButton} ${
                activeTab === 'mockTests'
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive
              }`}
            >
              <FileText className={styles.tabIcon} />
              <span>Mock Tests</span>
            </button>
            <button
              onClick={() => setActiveTab('institutions')}
              className={`${styles.tabButton} ${
                activeTab === 'institutions'
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive
              }`}
            >
              <Building2 className={styles.tabIcon} />
              <span>Institutions</span>
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`${styles.tabButton} ${
                activeTab === 'leads'
                  ? styles.tabButtonActive
                  : styles.tabButtonInactive
              }`}
            >
              <UserCog className={styles.tabIcon} />
              <span>Leads</span>
            </button>
            {hasPermission('bulk_operations') && (
              <button
                onClick={() => setActiveTab('bulk')}
                className={`${styles.tabButton} ${
                  activeTab === 'bulk'
                    ? styles.tabButtonActive
                    : styles.tabButtonInactive
                }`}
              >
                <Mail className={styles.tabIcon} />
                <span>Bulk Ops</span>
              </button>
            )}
            {hasPermission('manage_roles') && (
              <button
                onClick={() => setActiveTab('roles')}
                className={`${styles.tabButton} ${
                  activeTab === 'roles'
                    ? styles.tabButtonActive
                    : styles.tabButtonInactive
                }`}
              >
                <Shield className={styles.tabIcon} />
                <span>Roles</span>
              </button>
            )}
            {hasPermission('manage_settings') && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`${styles.tabButton} ${
                  activeTab === 'settings'
                    ? styles.tabButtonActive
                    : styles.tabButtonInactive
                }`}
              >
                <Settings className={styles.tabIcon} />
                <span>Settings</span>
              </button>
            )}
          </div>

          <div className={styles.tabContent}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Platform Overview</h2>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-slate-900">Jane Smith completed certification</p>
                          <p className="text-sm text-slate-500">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-slate-900">John Doe started Module 2</p>
                          <p className="text-sm text-slate-500">5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Average Progress</h3>
                    <p className="text-4xl font-bold text-blue-600 mb-2">
                      {Math.round(allUsers.reduce((acc, u) => acc + (u.courseProgress?.overallProgress || 0), 0) / (totalUsers || 1))}%
                    </p>
                    <p className="text-sm text-blue-700">Across all active users</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="text-lg font-bold text-green-900 mb-2">Completion Rate</h3>
                    <p className="text-4xl font-bold text-green-600 mb-2">
                      {Math.round((passedUsers / totalUsers) * 100)}%
                    </p>
                    <p className="text-sm text-green-700">Users who passed the exam</p>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>User Management</h2>
                  <div className={styles.sectionActions}>
                    <div className={styles.searchBar}>
                      <Search className={styles.searchIcon} />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                      />
                    </div>
                    {hasPermission('manage_users') && (
                      <button
                        onClick={() => setShowAddUser(true)}
                        className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
                      >
                        <Plus className={styles.actionButtonIcon} />
                        <span>Add User</span>
                      </button>
                    )}
                    {hasPermission('manage_roles') && (
                      <button
                        onClick={() => setShowAddAdmin(true)}
                        className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                      >
                        <Plus className={styles.actionButtonIcon} />
                        <span>Add Admin</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                      <tr>
                        <th className={styles.tableHeaderCell}>User</th>
                        <th className={styles.tableHeaderCell}>Email</th>
                        <th className={styles.tableHeaderCell}>Organization</th>
                        <th className={styles.tableHeaderCell}>Verified</th>
                        <th className={styles.tableHeaderCell}>Progress</th>
                        <th className={styles.tableHeaderCell}>Exam Status</th>
                        <th className={styles.tableHeaderCell}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className={styles.tableRow}>
                          <td className={styles.tableCell}>
                            <div className={styles.userInfo}>
                              <div className={styles.userAvatar}>
                                {u.profile.photo ? (
                                  <img
                                    src={u.profile.photo}
                                    alt={u.name}
                                    className={styles.userAvatarImg}
                                  />
                                ) : (
                                  <div className={styles.userAvatarPlaceholder}>
                                    {u.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span className={styles.userName}>{u.name}</span>
                            </div>
                          </td>
                          <td className={styles.tableCell}>{u.email}</td>
                          <td className={styles.tableCell}>{u.profile.organization}</td>
                          <td className={styles.tableCell}>
                            {u.profile.verified ? (
                              <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                                <CheckCircle className={styles.badgeIcon} />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className={`${styles.badge} ${styles.badgeWarning}`}>
                                <Clock className={styles.badgeIcon} />
                                <span>Pending</span>
                              </span>
                            )}
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.actionGroup}>
                              <div className={styles.progressBar}>
                                <div
                                  className={styles.progressBarFill}
                                  style={{ width: `${u.courseProgress?.overallProgress || 0}%` }}
                                ></div>
                              </div>
                              <span className={styles.progressValue}>{u.courseProgress?.overallProgress || 0}%</span>
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            {u.examStatus === 'passed' && (
                              <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                                <CheckCircle className={styles.badgeIcon} />
                                <span>Passed</span>
                              </span>
                            )}
                            {u.examStatus === 'failed' && (
                              <span className={`${styles.badge} ${styles.badgeDanger}`}>
                                <XCircle className={styles.badgeIcon} />
                                <span>Failed</span>
                              </span>
                            )}
                            {u.examStatus === 'attempted' && (
                              <span className={`${styles.badge} ${styles.badgeInfo}`}>
                                <Clock className={styles.badgeIcon} />
                                <span>Attempted</span>
                              </span>
                            )}
                            {u.examStatus === 'not_attempted' && (
                              <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                                <Clock className={styles.badgeIcon} />
                                <span>Not Attempted</span>
                              </span>
                            )}
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.actionGroup}>
                              <button
                                onClick={() => setSelectedUser(u)}
                                className={styles.actionLink}
                              >
                                View Details
                              </button>
                              {hasPermission('delete_users') && (
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className={`${styles.actionButtonSmall} ${styles.actionButtonSmallDanger}`}
                                  title="Delete user"
                                >
                                  <Trash2 className={styles.actionIcon} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Certification Programs Tab */}
            {activeTab === 'programs' && <CertificationProgramsManager />}

            {/* Mock Tests Tab */}
            {activeTab === 'mockTests' && (
              <div>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Mock Tests Management</h2>
                  <button
                    onClick={() => {
                      setEditingTest(null);
                      setShowTestEditor(true);
                    }}
                    className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                  >
                    <Plus className={styles.actionButtonIcon} />
                    <span>Add Mock Test</span>
                  </button>
                </div>

                {mockTests.length === 0 ? (
                  <div className={styles.emptyState}>
                    <FileText className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>No Mock Tests Yet</h3>
                    <p className={styles.emptyText}>Create your first mock test to help users practice for their certification exam.</p>
                    <button
                      onClick={() => {
                        setEditingTest(null);
                        setShowTestEditor(true);
                      }}
                      className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                      style={{ marginTop: '1rem' }}
                    >
                      <Plus className={styles.actionButtonIcon} />
                      <span>Create First Mock Test</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {mockTests.map((test) => (
                      <div key={test.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                          <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', flex: 1 }}>
                            <div className={styles.cardIcon}>
                              <FileText style={{ width: '1.5rem', height: '1.5rem' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h3 className={styles.cardTitle}>{test.title}</h3>
                              {test.description && (
                                <p className={styles.cardDescription}>{test.description}</p>
                              )}
                            </div>
                          </div>
                          <div className={styles.cardActions}>
                            <button
                              onClick={() => {
                                setEditingTest(test);
                                setShowTestEditor(true);
                              }}
                              className={`${styles.cardButton} ${styles.cardButtonPrimary}`}
                            >
                              <FileText className={styles.cardButtonIcon} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTest(test.id, test.title)}
                              className={`${styles.cardButton} ${styles.cardButtonDanger}`}
                            >
                              <Trash2 className={styles.cardButtonIcon} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                        <div className={styles.cardMeta}>
                          <div className={styles.cardMetaItem}>
                            <Clock className={styles.cardMetaIcon} />
                            <span>{test.duration || 60} minutes</span>
                          </div>
                          <div className={styles.cardMetaItem}>
                            <FileText className={styles.cardMetaIcon} />
                            <span>{test.totalQuestions || (test.questions?.length || 0)} questions</span>
                          </div>
                          <div className={styles.cardMetaItem}>
                            <Award className={styles.cardMetaIcon} />
                            <span>Pass: {test.passingScore || 70}%</span>
                          </div>
                          {test.createdAt && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Created: {new Date(test.createdAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Institutions Tab */}
            {activeTab === 'institutions' && <InstitutionsManager />}

            {/* Leads Tab */}
            {activeTab === 'leads' && <LeadsManager />}

            {/* Bulk Operations Tab */}
            {activeTab === 'bulk' && hasPermission('bulk_operations') && <BulkOperations />}

            {/* Role Management Tab */}
            {activeTab === 'roles' && hasPermission('manage_roles') && <RoleManagement />}

            {/* Settings Tab */}
            {activeTab === 'settings' && hasPermission('manage_settings') && <SettingsConfiguration />}

            {/* Permission Denied Message */}
            {!hasPermission('view_dashboard') && (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 mx-auto mb-4 text-red-600" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h3>
                <p className="text-slate-600">You don't have permission to access this section.</p>
                <p className="text-sm text-slate-500 mt-2">Contact your administrator to request access.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      </div>
    </>
  );
}
