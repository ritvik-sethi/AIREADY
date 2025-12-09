import { useState } from 'react';
import { Upload, Download, Mail, Users, CheckCircle, XCircle, AlertTriangle, FileText, Send } from 'lucide-react';

interface BulkAction {
  id: string;
  type: 'import' | 'export' | 'email' | 'enrollment' | 'verification';
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  count: number;
  timestamp: string;
}

export default function BulkOperations() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [bulkActions] = useState<BulkAction[]>([
    {
      id: '1',
      type: 'import',
      description: 'Imported 45 users from CSV',
      status: 'completed',
      count: 45,
      timestamp: '2025-01-15 10:30 AM'
    },
    {
      id: '2',
      type: 'email',
      description: 'Sent welcome email to all active users',
      status: 'completed',
      count: 248,
      timestamp: '2025-01-14 3:45 PM'
    },
    {
      id: '3',
      type: 'verification',
      description: 'Bulk verified 12 users',
      status: 'completed',
      count: 12,
      timestamp: '2025-01-13 11:20 AM'
    }
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImportUsers = () => {
    if (!selectedFile) {
      alert('Please select a CSV file to import');
      return;
    }
    // In production, this would process the CSV and create users
    alert(`Importing users from ${selectedFile.name}...`);
    setSelectedFile(null);
    setSelectedAction(null);
  };

  const handleExportUsers = () => {
    // In production, this would generate and download a CSV file
    alert('Exporting all users to CSV...');
  };

  const handleSendBulkEmail = () => {
    if (!emailSubject || !emailBody) {
      alert('Please fill in both subject and message');
      return;
    }
    // In production, this would send emails via API
    alert(`Sending email to all active users:\nSubject: ${emailSubject}`);
    setEmailSubject('');
    setEmailBody('');
    setSelectedAction(null);
  };

  const handleBulkEnrollment = (action: string) => {
    // In production, this would update enrollment status
    alert(`${action} enrollment for selected users`);
  };

  const handleBulkVerification = (verify: boolean) => {
    // In production, this would update verification status
    alert(`${verify ? 'Verifying' : 'Unverifying'} selected users`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Bulk Operations</h2>
        <p className="text-slate-600 mt-1">Perform actions on multiple users at once</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => setSelectedAction('import')}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-slate-100 hover:border-blue-200 text-left"
        >
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Import Users</h3>
          <p className="text-sm text-slate-600">Upload CSV to add multiple users</p>
        </button>

        <button
          onClick={handleExportUsers}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-slate-100 hover:border-green-200 text-left"
        >
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Download className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Export Users</h3>
          <p className="text-sm text-slate-600">Download all user data as CSV</p>
        </button>

        <button
          onClick={() => setSelectedAction('email')}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-slate-100 hover:border-purple-200 text-left"
        >
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Send Bulk Email</h3>
          <p className="text-sm text-slate-600">Send message to all users</p>
        </button>

        <button
          onClick={() => setSelectedAction('enrollment')}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-slate-100 hover:border-orange-200 text-left"
        >
          <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Manage Enrollments</h3>
          <p className="text-sm text-slate-600">Bulk enrollment actions</p>
        </button>
      </div>

      {/* Action Panels */}
      {selectedAction === 'import' && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Upload className="w-6 h-6 text-blue-600" />
              <span>Import Users from CSV</span>
            </h3>
            <button
              onClick={() => setSelectedAction(null)}
              className="text-slate-600 hover:text-slate-800"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              {selectedFile && (
                <p className="text-sm text-slate-600 mt-2">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>CSV Format Requirements</span>
              </h4>
              <p className="text-sm text-slate-600 mb-2">Your CSV should include the following columns:</p>
              <code className="text-xs bg-slate-100 p-2 rounded block">
                email, password, name, title, company, department, phone
              </code>
            </div>
            <button
              onClick={handleImportUsers}
              disabled={!selectedFile}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              <span>Import Users</span>
            </button>
          </div>
        </div>
      )}

      {selectedAction === 'email' && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Mail className="w-6 h-6 text-purple-600" />
              <span>Send Bulk Email</span>
            </h3>
            <button
              onClick={() => setSelectedAction(null)}
              className="text-slate-600 hover:text-slate-800"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="e.g., Important Update on AI Certification"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Message
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Enter your message here..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-slate-600">
                This email will be sent to <span className="font-bold">248 active users</span>
              </p>
            </div>
            <button
              onClick={handleSendBulkEmail}
              disabled={!emailSubject || !emailBody}
              className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              <span>Send to All Active Users</span>
            </button>
          </div>
        </div>
      )}

      {selectedAction === 'enrollment' && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-6 h-6 text-orange-600" />
              <span>Bulk Enrollment Actions</span>
            </h3>
            <button
              onClick={() => setSelectedAction(null)}
              className="text-slate-600 hover:text-slate-800"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => handleBulkEnrollment('Activate')}
              className="bg-white rounded-lg p-4 border-2 border-green-200 hover:bg-green-50 transition-all text-left"
            >
              <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-bold text-slate-900 mb-1">Activate Selected</h4>
              <p className="text-sm text-slate-600">Enable enrollment for selected users</p>
            </button>
            <button
              onClick={() => handleBulkEnrollment('Suspend')}
              className="bg-white rounded-lg p-4 border-2 border-red-200 hover:bg-red-50 transition-all text-left"
            >
              <XCircle className="w-8 h-8 text-red-600 mb-2" />
              <h4 className="font-bold text-slate-900 mb-1">Suspend Selected</h4>
              <p className="text-sm text-slate-600">Temporarily suspend user enrollments</p>
            </button>
            <button
              onClick={() => handleBulkVerification(true)}
              className="bg-white rounded-lg p-4 border-2 border-blue-200 hover:bg-blue-50 transition-all text-left"
            >
              <CheckCircle className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-bold text-slate-900 mb-1">Verify Selected</h4>
              <p className="text-sm text-slate-600">Mark selected users as verified</p>
            </button>
            <button
              onClick={() => handleBulkEnrollment('Extend')}
              className="bg-white rounded-lg p-4 border-2 border-purple-200 hover:bg-purple-50 transition-all text-left"
            >
              <AlertTriangle className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="font-bold text-slate-900 mb-1">Extend Expiry</h4>
              <p className="text-sm text-slate-600">Add 1 year to enrollment expiry</p>
            </button>
          </div>
        </div>
      )}

      {/* Recent Bulk Actions History */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Bulk Operations</h3>
        <div className="space-y-3">
          {bulkActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  action.type === 'import' ? 'bg-blue-100' :
                  action.type === 'export' ? 'bg-green-100' :
                  action.type === 'email' ? 'bg-purple-100' :
                  action.type === 'enrollment' ? 'bg-orange-100' :
                  'bg-slate-100'
                }`}>
                  {action.type === 'import' && <Upload className="w-6 h-6 text-blue-600" />}
                  {action.type === 'export' && <Download className="w-6 h-6 text-green-600" />}
                  {action.type === 'email' && <Mail className="w-6 h-6 text-purple-600" />}
                  {action.type === 'enrollment' && <Users className="w-6 h-6 text-orange-600" />}
                  {action.type === 'verification' && <CheckCircle className="w-6 h-6 text-blue-600" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{action.description}</p>
                  <p className="text-sm text-slate-500">{action.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-slate-600">{action.count} users</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  action.status === 'completed' ? 'bg-green-100 text-green-700' :
                  action.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  action.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {action.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <Upload className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-blue-100 text-sm font-semibold mb-1">Total Imports</p>
          <p className="text-4xl font-bold mb-1">248</p>
          <p className="text-blue-100 text-xs">Users imported this month</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <Mail className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-purple-100 text-sm font-semibold mb-1">Emails Sent</p>
          <p className="text-4xl font-bold mb-1">1,245</p>
          <p className="text-purple-100 text-xs">Total emails this month</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-6 text-white shadow-lg">
          <Users className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-orange-100 text-sm font-semibold mb-1">Bulk Actions</p>
          <p className="text-4xl font-bold mb-1">38</p>
          <p className="text-orange-100 text-xs">Operations this month</p>
        </div>
      </div>
    </div>
  );
}
