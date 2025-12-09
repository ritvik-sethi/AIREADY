import { useState, useEffect } from 'react';
import { Building2, Users, LogOut, Download, BarChart3, Award, TrendingUp, CheckCircle, Clock, X, Search, Filter } from 'lucide-react';
import { getAllUsers } from '../services/database';

interface InstitutionUser {
  id: string;
  institutionName: string;
  institutionEmail: string;
  institutionType: string;
}

interface InstitutionDashboardProps {
  user: InstitutionUser;
  onLogout: () => void;
}

export default function InstitutionDashboard({ user, onLogout }: InstitutionDashboardProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'in_progress' | 'not_attempted'>('all');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      // In production, this would filter students by institution ID
      const allUsers = await getAllUsers();
      // Mock: get first 20 students as institution students
      setStudents(allUsers.filter((u: any) => u.role === 'user').slice(0, 20));
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === 'all' ||
                         (statusFilter === 'passed' && student.examStatus === 'passed') ||
                         (statusFilter === 'in_progress' && student.examStatus === 'not_attempted' && (student.courseProgress?.overallProgress || 0) > 0) ||
                         (statusFilter === 'not_attempted' && student.examStatus === 'not_attempted' && (student.courseProgress?.overallProgress || 0) === 0);

    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalStudents = students.length;
  const passedStudents = students.filter(s => s.examStatus === 'passed').length;
  const inProgressStudents = students.filter(s => s.examStatus === 'not_attempted' && (s.courseProgress?.overallProgress || 0) > 0).length;
  const averageProgress = Math.round(students.reduce((acc, s) => acc + (s.courseProgress?.overallProgress || 0), 0) / (totalStudents || 1));
  const successRate = Math.round((passedStudents / totalStudents) * 100) || 0;

  const handleExportPDF = () => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const report = `
═══════════════════════════════════════════════════════
  ${user.institutionName.toUpperCase()}
  STUDENT PERFORMANCE REPORT
═══════════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}
Institution Type: ${user.institutionType}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Students: ${totalStudents}
Passed Students: ${passedStudents}
In Progress: ${inProgressStudents}
Success Rate: ${successRate}%
Average Progress: ${averageProgress}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STUDENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${filteredStudents.map((s, i) => `
${i + 1}. ${s.name}
   Email: ${s.email}
   Progress: ${s.courseProgress?.overallProgress || 0}%
   Exam Status: ${s.examStatus.replace('_', ' ').toUpperCase()}
   Enrolled: ${new Date(s.enrollment.enrolledDate).toLocaleDateString()}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROGRESS DISTRIBUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

0-25%: ${students.filter(s => (s.courseProgress?.overallProgress || 0) <= 25).length} students
26-50%: ${students.filter(s => (s.courseProgress?.overallProgress || 0) > 25 && (s.courseProgress?.overallProgress || 0) <= 50).length} students
51-75%: ${students.filter(s => (s.courseProgress?.overallProgress || 0) > 50 && (s.courseProgress?.overallProgress || 0) <= 75).length} students
76-100%: ${students.filter(s => (s.courseProgress?.overallProgress || 0) > 75).length} students

═══════════════════════════════════════════════════════
End of Report
═══════════════════════════════════════════════════════
    `.trim();

    reportWindow.document.write(`
      <html>
        <head>
          <title>${user.institutionName} - Student Report</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 40px;
              background: #f8f9fa;
              max-width: 900px;
              margin: 0 auto;
            }
            pre {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              white-space: pre-wrap;
              word-wrap: break-word;
              line-height: 1.6;
            }
            .actions {
              margin-bottom: 20px;
              text-align: right;
            }
            button {
              background: linear-gradient(to right, #9333ea, #dc2626);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              margin-left: 10px;
            }
            button:hover {
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <div class="actions">
            <button onclick="window.print()">Print Report</button>
            <button onclick="window.close()">Close</button>
          </div>
          <pre>${report}</pre>
        </body>
      </html>
    `);
    reportWindow.document.close();
  };

  const handleExportExcel = () => {
    const csvContent = [
      ['Student Performance Report'],
      ['Institution', user.institutionName],
      ['Generated Date', new Date().toLocaleDateString()],
      [''],
      ['Summary Statistics'],
      ['Metric', 'Value'],
      ['Total Students', totalStudents],
      ['Passed Students', passedStudents],
      ['In Progress', inProgressStudents],
      ['Success Rate', `${successRate}%`],
      ['Average Progress', `${averageProgress}%`],
      [''],
      ['Student Details'],
      ['Name', 'Email', 'Progress', 'Exam Status', 'Certification Track', 'Enrolled Date']
    ];

    filteredStudents.forEach((student: any) => {
      csvContent.push([
        student.name,
        student.email,
        `${student.courseProgress?.overallProgress || 0}%`,
        student.examStatus.replace('_', ' '),
        student.certificationTrack || 'N/A',
        new Date(student.enrollment.enrolledDate).toLocaleDateString()
      ]);
    });

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.institutionName.replace(/\s+/g, '_')}_Student_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="https://economictimes.indiatimes.com/photo/119331595.cms"
                alt="AI Ready Logo"
                className="h-10 object-contain"
              />
              <div>
                <span className="text-xl font-bold text-slate-900">{user.institutionName}</span>
                <p className="text-xs text-slate-600 capitalize">{user.institutionType} Dashboard</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-red-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to {user.institutionName}!</h1>
          <p className="text-white/90">Monitor student progress and performance analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-slate-900">{totalStudents}</span>
            </div>
            <h3 className="text-slate-600 font-semibold">Total Students</h3>
            <p className="text-xs text-slate-500 mt-1">Enrolled in programs</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-slate-900">{passedStudents}</span>
            </div>
            <h3 className="text-slate-600 font-semibold">Passed Students</h3>
            <p className="text-xs text-slate-500 mt-1">{successRate}% success rate</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold text-slate-900">{inProgressStudents}</span>
            </div>
            <h3 className="text-slate-600 font-semibold">In Progress</h3>
            <p className="text-xs text-slate-500 mt-1">Currently learning</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-slate-900">{averageProgress}%</span>
            </div>
            <h3 className="text-slate-600 font-semibold">Average Progress</h3>
            <p className="text-xs text-slate-500 mt-1">Overall completion</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span>Performance Analytics</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Progress Distribution */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-4">Progress Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">0-25%</span>
                    <span className="text-sm font-bold text-slate-900">
                      {students.filter(s => (s.courseProgress?.overallProgress || 0) <= 25).length} students
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full"
                      style={{
                        width: `${totalStudents > 0 ? (students.filter(s => (s.courseProgress?.overallProgress || 0) <= 25).length / totalStudents) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">26-50%</span>
                    <span className="text-sm font-bold text-slate-900">
                      {students.filter(s => (s.courseProgress?.overallProgress || 0) > 25 && (s.courseProgress?.overallProgress || 0) <= 50).length} students
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full"
                      style={{
                        width: `${totalStudents > 0 ? (students.filter(s => (s.courseProgress?.overallProgress || 0) > 25 && (s.courseProgress?.overallProgress || 0) <= 50).length / totalStudents) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">51-75%</span>
                    <span className="text-sm font-bold text-slate-900">
                      {students.filter(s => (s.courseProgress?.overallProgress || 0) > 50 && (s.courseProgress?.overallProgress || 0) <= 75).length} students
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                      style={{
                        width: `${totalStudents > 0 ? (students.filter(s => (s.courseProgress?.overallProgress || 0) > 50 && (s.courseProgress?.overallProgress || 0) <= 75).length / totalStudents) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">76-100%</span>
                    <span className="text-sm font-bold text-slate-900">
                      {students.filter(s => (s.courseProgress?.overallProgress || 0) > 75).length} students
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
                      style={{
                        width: `${totalStudents > 0 ? (students.filter(s => (s.courseProgress?.overallProgress || 0) > 75).length / totalStudents) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Status */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-4">Exam Status Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Passed</span>
                    <span className="text-sm font-bold text-green-600">{passedStudents} students</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
                      style={{ width: `${totalStudents > 0 ? (passedStudents / totalStudents) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">In Progress</span>
                    <span className="text-sm font-bold text-blue-600">{inProgressStudents} students</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                      style={{ width: `${totalStudents > 0 ? (inProgressStudents / totalStudents) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">Not Started</span>
                    <span className="text-sm font-bold text-slate-600">
                      {totalStudents - passedStudents - inProgressStudents} students
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-slate-400 to-slate-500 h-full rounded-full"
                      style={{
                        width: `${totalStudents > 0 ? ((totalStudents - passedStudents - inProgressStudents) / totalStudents) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-600" />
              <span>Student Performance ({filteredStudents.length})</span>
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
              >
                <option value="all">All Students</option>
                <option value="passed">Passed</option>
                <option value="in_progress">In Progress</option>
                <option value="not_attempted">Not Started</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-200">
                  <th className="text-left p-4 font-bold text-slate-700">Student</th>
                  <th className="text-left p-4 font-bold text-slate-700">Email</th>
                  <th className="text-left p-4 font-bold text-slate-700">Progress</th>
                  <th className="text-left p-4 font-bold text-slate-700">Exam Status</th>
                  <th className="text-left p-4 font-bold text-slate-700">Enrolled Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
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
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-red-600 h-full rounded-full"
                            style={{ width: `${student.courseProgress?.overallProgress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-900 min-w-[45px]">
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

          {filteredStudents.length === 0 && (
            <div className="bg-slate-50 rounded-xl p-8 text-center mt-6">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No students found</p>
              <p className="text-sm text-slate-500 mt-2">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No students enrolled yet'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
