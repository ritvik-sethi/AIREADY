import { useState, useEffect } from 'react';
import { Building2, Users, Plus, Edit2, Trash2, Search, Mail, Phone, MapPin, UserPlus, X, Save, Download, Award, CheckCircle, Clock, BarChart3, TrendingUp, FileText, ArrowLeft } from 'lucide-react';
import { getAllUsers } from '../../services/database';

interface Institution {
  id: string;
  name: string;
  type: 'university' | 'college' | 'school' | 'organization';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  adminEmail: string;
  adminPassword: string;
  logo?: string;
  website?: string;
  enrolledStudents: number;
  activePrograms: string[];
  status: 'active' | 'inactive';
  createdDate: string;
}

export default function InstitutionsManager() {
  const [institutions, setInstitutions] = useState<Institution[]>([
    {
      id: '1',
      name: 'IIT Delhi',
      type: 'university',
      email: 'contact@iitd.ac.in',
      phone: '+91 11 2659 1000',
      address: 'Hauz Khas',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      contactPerson: 'Dr. Rajesh Kumar',
      contactEmail: 'rajesh.kumar@iitd.ac.in',
      contactPhone: '+91 98765 43210',
      adminEmail: 'admin@iitd.ac.in',
      adminPassword: 'iitd@123',
      website: 'https://www.iitd.ac.in',
      enrolledStudents: 45,
      activePrograms: ['ai-technical', 'ai-business'],
      status: 'active',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'St. Xavier\'s College',
      type: 'college',
      email: 'info@xaviers.edu',
      phone: '+91 22 2269 8662',
      address: 'Mahapalika Marg',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      contactPerson: 'Prof. Maria D\'Souza',
      contactEmail: 'maria.dsouza@xaviers.edu',
      contactPhone: '+91 98765 43211',
      adminEmail: 'admin@xaviers.edu',
      adminPassword: 'xavier@123',
      website: 'https://www.xaviers.edu',
      enrolledStudents: 32,
      activePrograms: ['ai-marketing'],
      status: 'active',
      createdDate: '2024-02-20'
    }
  ]);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showInstituteAnalytics, setShowInstituteAnalytics] = useState(false);
  const [analyticsSearchTerm, setAnalyticsSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<Institution>>({
    name: '',
    type: 'university',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    adminEmail: '',
    adminPassword: '',
    website: '',
    status: 'active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const users = await getAllUsers();
      setAllUsers(users.filter((u: any) => u.role === 'user'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      type: 'university',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      adminEmail: '',
      adminPassword: '',
      website: '',
      status: 'active'
    });
    setShowAddModal(true);
  };

  const handleEdit = (institution: Institution) => {
    setFormData(institution);
    setSelectedInstitution(institution);
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.adminEmail || !formData.adminPassword) {
      alert('Please fill in all required fields');
      return;
    }

    if (showEditModal && selectedInstitution) {
      // Update existing institution
      setInstitutions(institutions.map(inst =>
        inst.id === selectedInstitution.id
          ? { ...inst, ...formData } as Institution
          : inst
      ));
      alert(`Institution "${formData.name}" updated successfully!`);
    } else {
      // Add new institution
      const newInstitution: Institution = {
        id: Date.now().toString(),
        ...formData,
        enrolledStudents: 0,
        activePrograms: [],
        createdDate: new Date().toISOString().split('T')[0]
      } as Institution;

      setInstitutions([...institutions, newInstitution]);
      alert(`Institution "${formData.name}" created successfully!\n\nAdmin Credentials:\nEmail: ${formData.adminEmail}\nPassword: ${formData.adminPassword}\n\nThey can now log in to the institution dashboard.`);
    }

    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedInstitution(null);
  };

  const handleDelete = (institution: Institution) => {
    if (confirm(`Are you sure you want to delete "${institution.name}"?\n\nThis will remove all associations with students. This action cannot be undone.`)) {
      setInstitutions(institutions.filter(inst => inst.id !== institution.id));
      alert(`Institution "${institution.name}" deleted successfully.`);
    }
  };

  const handleViewStudents = (institution: Institution) => {
    setSelectedInstitution(institution);
    setShowStudentsModal(true);
  };

  const handleExportInstitutions = () => {
    const csvContent = [
      ['Institution Name', 'Type', 'Email', 'Phone', 'City', 'State', 'Contact Person', 'Enrolled Students', 'Status'],
      ...institutions.map(inst => [
        inst.name,
        inst.type,
        inst.email,
        inst.phone,
        inst.city,
        inst.state,
        inst.contactPerson,
        inst.enrolledStudents.toString(),
        inst.status
      ])
    ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Institutions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportAnalytics = () => {
    const totalInstitutions = institutions.length;
    const activeInstitutions = institutions.filter(i => i.status === 'active').length;
    const totalStudents = institutions.reduce((acc, inst) => acc + inst.enrolledStudents, 0);
    const avgStudentsPerInstitution = Math.round(totalStudents / (totalInstitutions || 1));

    const typeBreakdown = {
      university: institutions.filter(i => i.type === 'university').length,
      college: institutions.filter(i => i.type === 'college').length,
      school: institutions.filter(i => i.type === 'school').length,
      organization: institutions.filter(i => i.type === 'organization').length,
    };

    const csvContent = [
      ['INSTITUTION ANALYTICS REPORT'],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['OVERVIEW STATISTICS'],
      ['Total Institutions', totalInstitutions.toString()],
      ['Active Institutions', activeInstitutions.toString()],
      ['Inactive Institutions', (totalInstitutions - activeInstitutions).toString()],
      ['Total Students Enrolled', totalStudents.toString()],
      ['Average Students per Institution', avgStudentsPerInstitution.toString()],
      [''],
      ['INSTITUTION TYPE BREAKDOWN'],
      ['Universities', typeBreakdown.university.toString()],
      ['Colleges', typeBreakdown.college.toString()],
      ['Schools', typeBreakdown.school.toString()],
      ['Organizations', typeBreakdown.organization.toString()],
      [''],
      ['TOP PERFORMING INSTITUTIONS BY ENROLLMENT'],
      ['Institution Name', 'Type', 'Enrolled Students', 'City', 'Status'],
      ...institutions
        .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
        .slice(0, 10)
        .map(inst => [
          inst.name,
          inst.type,
          inst.enrolledStudents.toString(),
          inst.city,
          inst.status
        ]),
      [''],
      ['ALL INSTITUTIONS DETAILED DATA'],
      ['Institution Name', 'Type', 'Email', 'Phone', 'City', 'State', 'Enrolled Students', 'Active Programs', 'Status', 'Created Date'],
      ...institutions.map(inst => [
        inst.name,
        inst.type,
        inst.email,
        inst.phone,
        inst.city,
        inst.state,
        inst.enrolledStudents.toString(),
        inst.activePrograms.length.toString(),
        inst.status,
        inst.createdDate
      ])
    ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Institution_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportAnalyticsPDF = () => {
    const totalInstitutions = institutions.length;
    const activeInstitutions = institutions.filter(i => i.status === 'active').length;
    const totalStudents = institutions.reduce((acc, inst) => acc + inst.enrolledStudents, 0);
    const avgStudentsPerInstitution = Math.round(totalStudents / (totalInstitutions || 1));

    const typeBreakdown = {
      university: institutions.filter(i => i.type === 'university').length,
      college: institutions.filter(i => i.type === 'college').length,
      school: institutions.filter(i => i.type === 'school').length,
      organization: institutions.filter(i => i.type === 'organization').length,
    };

    const topInstitutions = institutions
      .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
      .slice(0, 10);

    const report = `
═══════════════════════════════════════════════════════════════════
                    INSTITUTION ANALYTICS REPORT
═══════════════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}

───────────────────────────────────────────────────────────────────
OVERVIEW STATISTICS
───────────────────────────────────────────────────────────────────

Total Institutions:              ${totalInstitutions}
Active Institutions:             ${activeInstitutions}
Inactive Institutions:           ${totalInstitutions - activeInstitutions}
Total Students Enrolled:         ${totalStudents}
Average Students/Institution:    ${avgStudentsPerInstitution}

───────────────────────────────────────────────────────────────────
INSTITUTION TYPE BREAKDOWN
───────────────────────────────────────────────────────────────────

Universities:                    ${typeBreakdown.university} (${Math.round((typeBreakdown.university / totalInstitutions) * 100)}%)
Colleges:                        ${typeBreakdown.college} (${Math.round((typeBreakdown.college / totalInstitutions) * 100)}%)
Schools:                         ${typeBreakdown.school} (${Math.round((typeBreakdown.school / totalInstitutions) * 100)}%)
Organizations:                   ${typeBreakdown.organization} (${Math.round((typeBreakdown.organization / totalInstitutions) * 100)}%)

───────────────────────────────────────────────────────────────────
TOP PERFORMING INSTITUTIONS BY ENROLLMENT
───────────────────────────────────────────────────────────────────

${topInstitutions.map((inst, idx) => `
${idx + 1}. ${inst.name}
   Type: ${inst.type.charAt(0).toUpperCase() + inst.type.slice(1)}
   Enrolled Students: ${inst.enrolledStudents}
   Location: ${inst.city}, ${inst.state}
   Status: ${inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
   Active Programs: ${inst.activePrograms.length}
`).join('\n')}

───────────────────────────────────────────────────────────────────
ALL INSTITUTIONS SUMMARY
───────────────────────────────────────────────────────────────────

${institutions.map((inst, idx) => `
${idx + 1}. ${inst.name}
   Type: ${inst.type.charAt(0).toUpperCase() + inst.type.slice(1)}
   Email: ${inst.email}
   Phone: ${inst.phone}
   Location: ${inst.city}, ${inst.state}, ${inst.country}
   Contact: ${inst.contactPerson} (${inst.contactEmail})
   Enrolled Students: ${inst.enrolledStudents}
   Active Programs: ${inst.activePrograms.length}
   Status: ${inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
   Created: ${inst.createdDate}
   Admin Email: ${inst.adminEmail}
`).join('\n')}

═══════════════════════════════════════════════════════════════════
                         END OF REPORT
═══════════════════════════════════════════════════════════════════
    `;

    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Institution Analytics Report - ${new Date().toLocaleDateString()}</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                padding: 40px;
                background: #f5f5f5;
              }
              .container {
                background: white;
                padding: 40px;
                max-width: 1200px;
                margin: 0 auto;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                font-size: 12px;
                line-height: 1.6;
              }
              .actions {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: flex;
                gap: 10px;
              }
              button {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
              }
              .print-btn {
                background: linear-gradient(to right, #9333ea, #dc2626);
                color: white;
              }
              .close-btn {
                background: #e5e7eb;
                color: #374151;
              }
              button:hover {
                opacity: 0.9;
              }
              @media print {
                .actions {
                  display: none;
                }
                body {
                  background: white;
                }
              }
            </style>
          </head>
          <body>
            <div class="actions">
              <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
              <button class="close-btn" onclick="window.close()">Close</button>
            </div>
            <div class="container">
              <pre>${report}</pre>
            </div>
          </body>
        </html>
      `);
      reportWindow.document.close();
    }
  };

  const filteredInstitutions = institutions.filter(inst =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAnalyticsInstitutions = institutions.filter(inst =>
    inst.name.toLowerCase().includes(analyticsSearchTerm.toLowerCase()) ||
    inst.email.toLowerCase().includes(analyticsSearchTerm.toLowerCase()) ||
    inst.city.toLowerCase().includes(analyticsSearchTerm.toLowerCase()) ||
    inst.type.toLowerCase().includes(analyticsSearchTerm.toLowerCase())
  );

  // Get students for selected institution (mock data for now)
  const institutionStudents = selectedInstitution
    ? allUsers.slice(0, selectedInstitution.enrolledStudents)
    : [];

  // Calculate detailed analytics for an institution
  const getInstitutionAnalytics = (institution: Institution) => {
    const students = allUsers.slice(0, institution.enrolledStudents);
    const totalEnrolled = students.length;
    const attempted = students.filter(s => s.examStatus !== 'not_attempted').length;
    const passed = students.filter(s => s.examStatus === 'passed').length;
    const failed = attempted - passed;
    const notAttempted = totalEnrolled - attempted;
    const inProgress = students.filter(s =>
      s.examStatus === 'not_attempted' && (s.courseProgress?.overallProgress || 0) > 0
    ).length;
    const avgProgress = totalEnrolled > 0
      ? Math.round(students.reduce((acc, s) => acc + (s.courseProgress?.overallProgress || 0), 0) / totalEnrolled)
      : 0;
    const successRate = attempted > 0 ? Math.round((passed / attempted) * 100) : 0;
    const completionRate = totalEnrolled > 0 ? Math.round((attempted / totalEnrolled) * 100) : 0;

    return {
      totalEnrolled,
      attempted,
      passed,
      failed,
      notAttempted,
      inProgress,
      avgProgress,
      successRate,
      completionRate,
      students
    };
  };

  // Calculate global analytics
  const getGlobalAnalytics = () => {
    const totalEnrolled = institutions.reduce((acc, inst) => acc + inst.enrolledStudents, 0);
    let totalAttempted = 0;
    let totalPassed = 0;
    let totalInProgress = 0;
    let totalProgressSum = 0;

    institutions.forEach(inst => {
      const analytics = getInstitutionAnalytics(inst);
      totalAttempted += analytics.attempted;
      totalPassed += analytics.passed;
      totalInProgress += analytics.inProgress;
      totalProgressSum += analytics.avgProgress * analytics.totalEnrolled;
    });

    const totalFailed = totalAttempted - totalPassed;
    const totalNotAttempted = totalEnrolled - totalAttempted;
    const avgProgress = totalEnrolled > 0 ? Math.round(totalProgressSum / totalEnrolled) : 0;
    const globalSuccessRate = totalAttempted > 0 ? Math.round((totalPassed / totalAttempted) * 100) : 0;
    const globalCompletionRate = totalEnrolled > 0 ? Math.round((totalAttempted / totalEnrolled) * 100) : 0;

    return {
      totalEnrolled,
      totalAttempted,
      totalPassed,
      totalFailed,
      totalNotAttempted,
      totalInProgress,
      avgProgress,
      globalSuccessRate,
      globalCompletionRate
    };
  };

  const handleViewInstituteAnalytics = (institution: Institution) => {
    setSelectedInstitution(institution);
    setShowInstituteAnalytics(true);
  };

  const handleBackToAllAnalytics = () => {
    setShowInstituteAnalytics(false);
    setSelectedInstitution(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading institutions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add/Edit Institution Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {showEditModal ? 'Edit Institution' : 'Add New Institution'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedInstitution(null);
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Institution Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., IIT Delhi, St. Xavier's College"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Institution Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.type || 'university'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    >
                      <option value="university">University</option>
                      <option value="college">College</option>
                      <option value="school">School</option>
                      <option value="organization">Organization</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="contact@institution.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="+91 00000 00000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="https://www.institution.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Address Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Enter street address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={formData.state || ''}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country || 'India'}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Person Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson || ''}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail || ''}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="contact@institution.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone || ''}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Credentials */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Institution Dashboard Admin Credentials
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  These credentials will be used by the institution to log in to their dashboard.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Admin Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.adminEmail || ''}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="admin@institution.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Admin Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.adminPassword || ''}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Enter password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedInstitution(null);
                }}
                className="px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>{showEditModal ? 'Update Institution' : 'Create Institution'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Students Modal */}
      {showStudentsModal && selectedInstitution && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedInstitution.name}</h2>
                  <p className="text-white/90 text-sm mt-1">Enrolled Students ({selectedInstitution.enrolledStudents})</p>
                </div>
                <button
                  onClick={() => {
                    setShowStudentsModal(false);
                    setSelectedInstitution(null);
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {institutionStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-100 border-b-2 border-slate-200">
                        <th className="text-left p-4 font-bold text-slate-700">Student Name</th>
                        <th className="text-left p-4 font-bold text-slate-700">Email</th>
                        <th className="text-left p-4 font-bold text-slate-700">Progress</th>
                        <th className="text-left p-4 font-bold text-slate-700">Exam Status</th>
                        <th className="text-left p-4 font-bold text-slate-700">Enrolled Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {institutionStudents.map((student: any) => (
                        <tr key={student.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-slate-200">
                                {student.profile.photo ? (
                                  <img src={student.profile.photo} alt={student.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-r from-purple-600 to-red-600 flex items-center justify-center text-white font-bold">
                                    {student.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span className="font-semibold text-slate-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600">{student.email}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-600 to-red-600 h-full rounded-full"
                                  style={{ width: `${student.courseProgress?.overallProgress || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-slate-900">
                                {student.courseProgress?.overallProgress || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            {student.examStatus === 'passed' && (
                              <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                <span>Passed</span>
                              </span>
                            )}
                            {student.examStatus === 'not_attempted' && (
                              <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                                <Clock className="w-4 h-4" />
                                <span>Not Attempted</span>
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-600 text-sm">
                            {new Date(student.enrollment.enrolledDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-8 text-center">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No students enrolled yet</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Students will appear here once they are assigned to this institution
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  setShowStudentsModal(false);
                  setSelectedInstitution(null);
                }}
                className="bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {showAnalytics ? 'Institution Analytics Report' : 'Institutions Management'}
            </h2>
            <p className="text-slate-600 mt-1">
              {showAnalytics
                ? 'Comprehensive analytics and insights across all institutions'
                : 'Manage universities, colleges, schools, and organizations'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {showAnalytics ? (
              <>
                <button
                  onClick={handleExportAnalyticsPDF}
                  className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all font-semibold"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={handleExportAnalytics}
                  className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all font-semibold"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to List</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAnalytics(true)}
                  className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all font-semibold"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Analytics</span>
                </button>
                <button
                  onClick={handleExportInstitutions}
                  className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all font-semibold"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={handleAdd}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Institution</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Analytics View */}
        {showAnalytics ? (
          <>
            {showInstituteAnalytics && selectedInstitution ? (
              // Individual Institute Analytics
              (() => {
                const analytics = getInstitutionAnalytics(selectedInstitution);
                return (
                  <>
                    {/* Back Button */}
                    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                      <button
                        onClick={handleBackToAllAnalytics}
                        className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-semibold"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to All Institutions Analytics</span>
                      </button>
                    </div>

                    {/* Institution Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-red-600 rounded-xl p-6 text-white shadow-lg mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                            {selectedInstitution.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{selectedInstitution.name}</h3>
                            <p className="text-white/90 capitalize">{selectedInstitution.type} • {selectedInstitution.city}, {selectedInstitution.state}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/80">Since</p>
                          <p className="font-bold">{new Date(selectedInstitution.createdDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Statistics */}
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                        <Users className="w-6 h-6 text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-blue-600">{analytics.totalEnrolled}</p>
                        <p className="text-sm text-blue-700">Total Enrolled</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                        <Clock className="w-6 h-6 text-purple-600 mb-2" />
                        <p className="text-2xl font-bold text-purple-600">{analytics.inProgress}</p>
                        <p className="text-sm text-purple-700">In Progress</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                        <FileText className="w-6 h-6 text-orange-600 mb-2" />
                        <p className="text-2xl font-bold text-orange-600">{analytics.attempted}</p>
                        <p className="text-sm text-orange-700">Attempted Exam</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                        <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                        <p className="text-2xl font-bold text-green-600">{analytics.passed}</p>
                        <p className="text-sm text-green-700">Passed</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
                        <X className="w-6 h-6 text-red-600 mb-2" />
                        <p className="text-2xl font-bold text-red-600">{analytics.failed}</p>
                        <p className="text-sm text-red-700">Failed</p>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-900">Success Rate</h4>
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-4xl font-bold text-green-600">{analytics.successRate}%</p>
                        <p className="text-sm text-slate-600 mt-2">{analytics.passed} out of {analytics.attempted} passed</p>
                        <div className="mt-4 w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                            style={{ width: `${analytics.successRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-900">Completion Rate</h4>
                          <BarChart3 className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-4xl font-bold text-purple-600">{analytics.completionRate}%</p>
                        <p className="text-sm text-slate-600 mt-2">{analytics.attempted} out of {analytics.totalEnrolled} attempted</p>
                        <div className="mt-4 w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full"
                            style={{ width: `${analytics.completionRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-900">Avg Progress</h4>
                          <Award className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-4xl font-bold text-orange-600">{analytics.avgProgress}%</p>
                        <p className="text-sm text-slate-600 mt-2">Average course completion</p>
                        <div className="mt-4 w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full"
                            style={{ width: `${analytics.avgProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Students List */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Student Details</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-100 border-b-2 border-slate-200">
                              <th className="text-left p-4 font-bold text-slate-700">Student Name</th>
                              <th className="text-left p-4 font-bold text-slate-700">Email</th>
                              <th className="text-left p-4 font-bold text-slate-700">Progress</th>
                              <th className="text-left p-4 font-bold text-slate-700">Exam Status</th>
                              <th className="text-left p-4 font-bold text-slate-700">Enrolled Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analytics.students.map((student: any) => (
                              <tr key={student.id} className="border-b border-slate-200 hover:bg-slate-50">
                                <td className="p-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-slate-200">
                                      {student.profile.photo ? (
                                        <img src={student.profile.photo} alt={student.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-purple-600 to-red-600 flex items-center justify-center text-white font-bold">
                                          {student.name.charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                    <span className="font-semibold text-slate-900">{student.name}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-slate-600">{student.email}</td>
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-24 bg-slate-200 rounded-full h-2">
                                      <div
                                        className="bg-gradient-to-r from-purple-600 to-red-600 h-full rounded-full"
                                        style={{ width: `${student.courseProgress?.overallProgress || 0}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900">
                                      {student.courseProgress?.overallProgress || 0}%
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  {student.examStatus === 'passed' && (
                                    <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                      <CheckCircle className="w-4 h-4" />
                                      <span>Passed</span>
                                    </span>
                                  )}
                                  {student.examStatus === 'not_attempted' && (
                                    <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                                      <Clock className="w-4 h-4" />
                                      <span>Not Attempted</span>
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 text-slate-600 text-sm">
                                  {new Date(student.enrollment.enrolledDate).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })()
            ) : (
              // All Institutions Analytics
              (() => {
                const globalAnalytics = getGlobalAnalytics();
                return (
                  <>
                    {/* Global Overview Statistics */}
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                        <Building2 className="w-6 h-6 text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-blue-600">{institutions.length}</p>
                        <p className="text-sm text-blue-700">Total Institutions</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                        <Users className="w-6 h-6 text-purple-600 mb-2" />
                        <p className="text-2xl font-bold text-purple-600">{globalAnalytics.totalEnrolled}</p>
                        <p className="text-sm text-purple-700">Total Enrolled</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                        <FileText className="w-6 h-6 text-orange-600 mb-2" />
                        <p className="text-2xl font-bold text-orange-600">{globalAnalytics.totalAttempted}</p>
                        <p className="text-sm text-orange-700">Attempted Exam</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                        <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                        <p className="text-2xl font-bold text-green-600">{globalAnalytics.totalPassed}</p>
                        <p className="text-sm text-green-700">Total Passed</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
                        <X className="w-6 h-6 text-red-600 mb-2" />
                        <p className="text-2xl font-bold text-red-600">{globalAnalytics.totalFailed}</p>
                        <p className="text-sm text-red-700">Total Failed</p>
                      </div>
                    </div>

                    {/* Global Performance Metrics */}
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-slate-900">Success Rate</h4>
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-green-600">{globalAnalytics.globalSuccessRate}%</p>
                        <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                            style={{ width: `${globalAnalytics.globalSuccessRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-slate-900">Completion Rate</h4>
                          <BarChart3 className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-3xl font-bold text-purple-600">{globalAnalytics.globalCompletionRate}%</p>
                        <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full"
                            style={{ width: `${globalAnalytics.globalCompletionRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-slate-900">In Progress</h4>
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{globalAnalytics.totalInProgress}</p>
                        <p className="text-sm text-slate-600 mt-2">Students learning</p>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-md border-2 border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-slate-900">Avg Progress</h4>
                          <Award className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-3xl font-bold text-orange-600">{globalAnalytics.avgProgress}%</p>
                        <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full"
                            style={{ width: `${globalAnalytics.avgProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

            {/* Institution Type Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Institution Type Distribution
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-700">Universities</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {institutions.filter(i => i.type === 'university').length}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{
                        width: `${(institutions.filter(i => i.type === 'university').length / institutions.length) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    {Math.round((institutions.filter(i => i.type === 'university').length / institutions.length) * 100)}% of total
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-700">Colleges</span>
                    <span className="text-2xl font-bold text-green-600">
                      {institutions.filter(i => i.type === 'college').length}
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-full rounded-full"
                      style={{
                        width: `${(institutions.filter(i => i.type === 'college').length / institutions.length) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {Math.round((institutions.filter(i => i.type === 'college').length / institutions.length) * 100)}% of total
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-700">Schools</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {institutions.filter(i => i.type === 'school').length}
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{
                        width: `${(institutions.filter(i => i.type === 'school').length / institutions.length) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    {Math.round((institutions.filter(i => i.type === 'school').length / institutions.length) * 100)}% of total
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-orange-700">Organizations</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {institutions.filter(i => i.type === 'organization').length}
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-full rounded-full"
                      style={{
                        width: `${(institutions.filter(i => i.type === 'organization').length / institutions.length) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">
                    {Math.round((institutions.filter(i => i.type === 'organization').length / institutions.length) * 100)}% of total
                  </p>
                </div>
              </div>
            </div>

            {/* Top Performing Institutions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Top Performing Institutions by Enrollment
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-200">
                      <th className="text-left p-4 font-bold text-slate-700">Rank</th>
                      <th className="text-left p-4 font-bold text-slate-700">Institution</th>
                      <th className="text-left p-4 font-bold text-slate-700">Type</th>
                      <th className="text-left p-4 font-bold text-slate-700">Location</th>
                      <th className="text-left p-4 font-bold text-slate-700">Students</th>
                      <th className="text-left p-4 font-bold text-slate-700">Programs</th>
                      <th className="text-left p-4 font-bold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutions
                      .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
                      .slice(0, 10)
                      .map((inst, index) => (
                        <tr key={inst.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="p-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-red-600 text-white font-bold">
                              {index + 1}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {inst.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{inst.name}</p>
                                <p className="text-sm text-slate-600">{inst.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                              {inst.type}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 text-sm">
                            {inst.city}, {inst.state}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span className="font-bold text-purple-600">{inst.enrolledStudents}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Award className="w-4 h-4 text-orange-600" />
                              <span className="font-semibold text-orange-600">{inst.activePrograms.length}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {inst.status === 'active' ? (
                              <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                                <Clock className="w-4 h-4" />
                                <span>Inactive</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

                    {/* Search Institutions */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search institutions by name, type, city, or email..."
                          value={analyticsSearchTerm}
                          onChange={(e) => setAnalyticsSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Institution-wise Analytics Table */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Institution-wise Performance Analytics</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-100 border-b-2 border-slate-200">
                              <th className="text-left p-4 font-bold text-slate-700">Institution</th>
                              <th className="text-left p-4 font-bold text-slate-700">Enrolled</th>
                              <th className="text-left p-4 font-bold text-slate-700">Attempted</th>
                              <th className="text-left p-4 font-bold text-slate-700">Passed</th>
                              <th className="text-left p-4 font-bold text-slate-700">Failed</th>
                              <th className="text-left p-4 font-bold text-slate-700">Success Rate</th>
                              <th className="text-left p-4 font-bold text-slate-700">Avg Progress</th>
                              <th className="text-left p-4 font-bold text-slate-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAnalyticsInstitutions.map((inst) => {
                              const analytics = getInstitutionAnalytics(inst);
                              return (
                                <tr key={inst.id} className="border-b border-slate-200 hover:bg-slate-50">
                                  <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {inst.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-900">{inst.name}</p>
                                        <p className="text-xs text-slate-600 capitalize">{inst.type} • {inst.city}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                      <Users className="w-4 h-4 text-blue-600" />
                                      <span className="font-bold text-blue-600">{analytics.totalEnrolled}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                      <FileText className="w-4 h-4 text-orange-600" />
                                      <span className="font-semibold text-orange-600">{analytics.attempted}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="font-semibold text-green-600">{analytics.passed}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                      <X className="w-4 h-4 text-red-600" />
                                      <span className="font-semibold text-red-600">{analytics.failed}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-16 bg-slate-200 rounded-full h-2">
                                        <div
                                          className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                                          style={{ width: `${analytics.successRate}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm font-bold text-green-600">{analytics.successRate}%</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-16 bg-slate-200 rounded-full h-2">
                                        <div
                                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full"
                                          style={{ width: `${analytics.avgProgress}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm font-bold text-purple-600">{analytics.avgProgress}%</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <button
                                      onClick={() => handleViewInstituteAnalytics(inst)}
                                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-3 py-2 rounded-lg hover:opacity-90 transition-all font-semibold text-sm"
                                    >
                                      <BarChart3 className="w-4 h-4" />
                                      <span>View Details</span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {filteredAnalyticsInstitutions.length === 0 && (
                        <div className="bg-slate-50 rounded-xl p-8 text-center mt-4">
                          <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600">No institutions found</p>
                          <p className="text-sm text-slate-500 mt-2">
                            Try adjusting your search criteria
                          </p>
                        </div>
                      )}
                    </div>

            {/* Enrollment Statistics by Location */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                Enrollment by State/Region
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from(new Set(institutions.map(i => i.state))).map(state => {
                  const stateInstitutions = institutions.filter(i => i.state === state);
                  const totalStudents = stateInstitutions.reduce((acc, inst) => acc + inst.enrolledStudents, 0);
                  return (
                    <div key={state} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border-2 border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900">{state}</span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                          {stateInstitutions.length} institutions
                        </span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-purple-600">{totalStudents}</span>
                        <span className="text-sm text-slate-600">students</span>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        Avg: {Math.round(totalStudents / stateInstitutions.length)} students/institution
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Institutions Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">All Institutions Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-200">
                      <th className="text-left p-4 font-bold text-slate-700">Institution</th>
                      <th className="text-left p-4 font-bold text-slate-700">Type</th>
                      <th className="text-left p-4 font-bold text-slate-700">Location</th>
                      <th className="text-left p-4 font-bold text-slate-700">Contact</th>
                      <th className="text-left p-4 font-bold text-slate-700">Students</th>
                      <th className="text-left p-4 font-bold text-slate-700">Programs</th>
                      <th className="text-left p-4 font-bold text-slate-700">Created</th>
                      <th className="text-left p-4 font-bold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutions
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((inst) => (
                        <tr key={inst.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {inst.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{inst.name}</p>
                                <p className="text-sm text-slate-600">{inst.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                              {inst.type}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{inst.city}, {inst.state}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{inst.contactPerson}</p>
                              <p className="text-xs text-slate-600">{inst.contactEmail}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span className="font-bold text-purple-600">{inst.enrolledStudents}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-orange-600">{inst.activePrograms.length}</span>
                          </td>
                          <td className="p-4 text-slate-600 text-sm">
                            {new Date(inst.createdDate).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            {inst.status === 'active' ? (
                              <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                                <Clock className="w-4 h-4" />
                                <span>Inactive</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
                );
              })()
            )}
          </>
        ) : (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                <Building2 className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-blue-600">{institutions.length}</p>
                <p className="text-sm text-blue-700">Total Institutions</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {institutions.filter(i => i.status === 'active').length}
                </p>
                <p className="text-sm text-green-700">Active Institutions</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                <Users className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {institutions.reduce((acc, inst) => acc + inst.enrolledStudents, 0)}
                </p>
                <p className="text-sm text-purple-700">Total Students</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                <Award className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-2xl font-bold text-orange-600">
                  {institutions.filter(i => i.type === 'university').length}
                </p>
                <p className="text-sm text-orange-700">Universities</p>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search institutions by name, email, city, or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Institutions Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-200">
                      <th className="text-left p-4 font-bold text-slate-700">Institution</th>
                      <th className="text-left p-4 font-bold text-slate-700">Type</th>
                      <th className="text-left p-4 font-bold text-slate-700">Location</th>
                      <th className="text-left p-4 font-bold text-slate-700">Contact Person</th>
                      <th className="text-left p-4 font-bold text-slate-700">Students</th>
                      <th className="text-left p-4 font-bold text-slate-700">Status</th>
                      <th className="text-left p-4 font-bold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInstitutions.map((institution) => (
                      <tr key={institution.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-red-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {institution.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{institution.name}</p>
                              <p className="text-sm text-slate-600">{institution.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                            {institution.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{institution.city}, {institution.state}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-slate-900">{institution.contactPerson}</p>
                            <p className="text-sm text-slate-600">{institution.contactEmail}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleViewStudents(institution)}
                            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-semibold"
                          >
                            <Users className="w-4 h-4" />
                            <span>{institution.enrolledStudents}</span>
                          </button>
                        </td>
                        <td className="p-4">
                          {institution.status === 'active' ? (
                            <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                              <CheckCircle className="w-4 h-4" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                              <Clock className="w-4 h-4" />
                              <span>Inactive</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(institution)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Edit institution"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(institution)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete institution"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredInstitutions.length === 0 && (
                <div className="bg-slate-50 p-8 text-center">
                  <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No institutions found</p>
                  <p className="text-sm text-slate-500 mt-2">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Add your first institution to get started'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
