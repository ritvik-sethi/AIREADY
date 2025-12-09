import { useState } from 'react';
import { Settings, Save, Mail, Shield, CreditCard, Bell, Globe, Database } from 'lucide-react';

interface PlatformSettings {
  name: string;
  tagline: string;
  logo: string;
  contactEmail: string;
  supportPhone: string;
  address: string;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  fromEmail: string;
  fromName: string;
}

interface CertificationSettings {
  defaultPassingScore: number;
  defaultDuration: number;
  certificateValidityYears: number;
  allowRetakes: boolean;
  retakeCooldownDays: number;
}

interface NotificationSettings {
  enrollmentEmails: boolean;
  completionEmails: boolean;
  reminderEmails: boolean;
  marketingEmails: boolean;
  adminNotifications: boolean;
}

export default function SettingsConfiguration() {
  const [activeTab, setActiveTab] = useState<'platform' | 'email' | 'certification' | 'notifications' | 'security'>('platform');

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    name: 'ET AI Ready',
    tagline: 'Leading AI Certification Platform',
    logo: '/logo.png',
    contactEmail: 'support@etaiready.com',
    supportPhone: '+91-9876543210',
    address: 'Mumbai, Maharashtra, India'
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@etaiready.com',
    fromEmail: 'noreply@etaiready.com',
    fromName: 'ET AI Ready Team'
  });

  const [certificationSettings, setCertificationSettings] = useState<CertificationSettings>({
    defaultPassingScore: 70,
    defaultDuration: 90,
    certificateValidityYears: 2,
    allowRetakes: true,
    retakeCooldownDays: 7
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enrollmentEmails: true,
    completionEmails: true,
    reminderEmails: true,
    marketingEmails: false,
    adminNotifications: true
  });

  const handleSavePlatformSettings = () => {
    // In production, this would save to backend
    alert('Platform settings saved successfully!');
  };

  const handleSaveEmailSettings = () => {
    // In production, this would save to backend
    alert('Email settings saved successfully!');
  };

  const handleSaveCertificationSettings = () => {
    // In production, this would save to backend
    alert('Certification settings saved successfully!');
  };

  const handleSaveNotificationSettings = () => {
    // In production, this would save to backend
    alert('Notification settings saved successfully!');
  };

  const tabs = [
    { id: 'platform', label: 'Platform', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'certification', label: 'Certification', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings & Configuration</h2>
        <p className="text-slate-600 mt-1">Manage platform-wide settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-4 border-purple-600 text-purple-600 bg-purple-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Platform Settings */}
          {activeTab === 'platform' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Platform Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Platform Name *
                    </label>
                    <input
                      type="text"
                      value={platformSettings.name}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={platformSettings.tagline}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, tagline: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={platformSettings.contactEmail}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, contactEmail: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Support Phone
                    </label>
                    <input
                      type="tel"
                      value={platformSettings.supportPhone}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, supportPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={platformSettings.address}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSavePlatformSettings}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>Save Platform Settings</span>
              </button>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Email Configuration</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      SMTP Host *
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      SMTP Port *
                    </label>
                    <input
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtpUser}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      From Email *
                    </label>
                    <input
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      From Name
                    </label>
                    <input
                      type="text"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-3">Email Templates</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-slate-50 transition-all border border-slate-200">
                    <p className="font-semibold text-slate-900">Welcome Email</p>
                    <p className="text-sm text-slate-600">Sent when a user first registers</p>
                  </button>
                  <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-slate-50 transition-all border border-slate-200">
                    <p className="font-semibold text-slate-900">Enrollment Confirmation</p>
                    <p className="text-sm text-slate-600">Sent when enrollment is approved</p>
                  </button>
                  <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-slate-50 transition-all border border-slate-200">
                    <p className="font-semibold text-slate-900">Certificate Issued</p>
                    <p className="text-sm text-slate-600">Sent when certification is completed</p>
                  </button>
                  <button className="w-full text-left p-3 bg-white rounded-lg hover:bg-slate-50 transition-all border border-slate-200">
                    <p className="font-semibold text-slate-900">Password Reset</p>
                    <p className="text-sm text-slate-600">Sent when user requests password reset</p>
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveEmailSettings}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>Save Email Settings</span>
              </button>
            </div>
          )}

          {/* Certification Settings */}
          {activeTab === 'certification' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Certification Defaults</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Default Passing Score (%)
                    </label>
                    <input
                      type="number"
                      value={certificationSettings.defaultPassingScore}
                      onChange={(e) => setCertificationSettings({ ...certificationSettings, defaultPassingScore: parseInt(e.target.value) })}
                      min="1"
                      max="100"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Default Duration (days)
                    </label>
                    <input
                      type="number"
                      value={certificationSettings.defaultDuration}
                      onChange={(e) => setCertificationSettings({ ...certificationSettings, defaultDuration: parseInt(e.target.value) })}
                      min="1"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Certificate Validity (years)
                    </label>
                    <input
                      type="number"
                      value={certificationSettings.certificateValidityYears}
                      onChange={(e) => setCertificationSettings({ ...certificationSettings, certificateValidityYears: parseInt(e.target.value) })}
                      min="1"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Retake Cooldown (days)
                    </label>
                    <input
                      type="number"
                      value={certificationSettings.retakeCooldownDays}
                      onChange={(e) => setCertificationSettings({ ...certificationSettings, retakeCooldownDays: parseInt(e.target.value) })}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-4">Exam Policies</h4>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={certificationSettings.allowRetakes}
                      onChange={(e) => setCertificationSettings({ ...certificationSettings, allowRetakes: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">Allow Exam Retakes</p>
                      <p className="text-sm text-slate-600">Users can retake failed exams after cooldown period</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSaveCertificationSettings}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>Save Certification Settings</span>
              </button>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">Enrollment Notifications</p>
                      <p className="text-sm text-slate-600">Send emails when users enroll</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.enrollmentEmails}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, enrollmentEmails: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">Completion Notifications</p>
                      <p className="text-sm text-slate-600">Send emails when users complete courses</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.completionEmails}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, completionEmails: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">Reminder Emails</p>
                      <p className="text-sm text-slate-600">Send reminders for pending tasks</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.reminderEmails}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, reminderEmails: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">Marketing Emails</p>
                      <p className="text-sm text-slate-600">Send promotional and marketing content</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketingEmails}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, marketingEmails: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">Admin Notifications</p>
                      <p className="text-sm text-slate-600">Notify admins of important events</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.adminNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, adminNotifications: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                  </label>
                </div>
              </div>
              <button
                onClick={handleSaveNotificationSettings}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>Save Notification Settings</span>
              </button>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Security & Privacy</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <Shield className="w-10 h-10 text-green-600 mb-3" />
                    <h4 className="font-bold text-slate-900 mb-2">Password Policy</h4>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>✓ Minimum 8 characters</li>
                      <li>✓ Require uppercase & lowercase</li>
                      <li>✓ Require numbers</li>
                      <li>✓ Require special characters</li>
                    </ul>
                    <button className="mt-4 text-sm text-green-700 hover:text-green-800 font-semibold">
                      Edit Policy →
                    </button>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <Database className="w-10 h-10 text-blue-600 mb-3" />
                    <h4 className="font-bold text-slate-900 mb-2">Data Backup</h4>
                    <p className="text-sm text-slate-700 mb-3">Last backup: 2 hours ago</p>
                    <p className="text-sm text-slate-600 mb-3">Automatic daily backups enabled</p>
                    <button className="mt-2 text-sm text-blue-700 hover:text-blue-800 font-semibold">
                      Backup Now →
                    </button>
                  </div>
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                    <CreditCard className="w-10 h-10 text-orange-600 mb-3" />
                    <h4 className="font-bold text-slate-900 mb-2">Payment Security</h4>
                    <p className="text-sm text-slate-700 mb-1">SSL Certificate: Active</p>
                    <p className="text-sm text-slate-700 mb-1">PCI Compliance: Enabled</p>
                    <p className="text-sm text-slate-700">Gateway: Razorpay</p>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                    <Bell className="w-10 h-10 text-purple-600 mb-3" />
                    <h4 className="font-bold text-slate-900 mb-2">Activity Logging</h4>
                    <p className="text-sm text-slate-700 mb-3">All admin actions are logged</p>
                    <button className="text-sm text-purple-700 hover:text-purple-800 font-semibold">
                      View Logs →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
