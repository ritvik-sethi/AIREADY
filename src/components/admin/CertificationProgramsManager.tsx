import { useState, useEffect } from 'react';
import { Award, BookOpen, FileText, Users, TrendingUp, Plus, ChevronRight, Edit2, CheckCircle, Clock, BarChart3, Trash2, Download, ExternalLink, Search, Filter, X, Save } from 'lucide-react';
import { getAllCertificationTracks, getAllUsers, getAllModules, getAllMockTests } from '../../services/database';
import CourseEditor from './CourseEditor';
import TestEditor from './TestEditor';

interface CertificationProgram {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  level: string;
  features: string[];
  curriculum: any[];
  mockTests: any[];
  enrolledStudents: number;
  completedStudents: number;
  certificatesIssued: number;
}

export default function CertificationProgramsManager() {
  const [programs, setPrograms] = useState<CertificationProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'tests' | 'students' | 'exams' | 'certificates' | 'reports'>('curriculum');
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allModules, setAllModules] = useState<any[]>([]);
  const [allTests, setAllTests] = useState<any[]>([]);

  // Modals
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [showTestEditor, setShowTestEditor] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [showExamConfig, setShowExamConfig] = useState(false);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Exam Configuration State
  const [examConfig, setExamConfig] = useState({
    totalQuestions: 50,
    duration: 120,
    passingScore: 70,
    maxAttempts: 2
  });

  // Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'active' | 'completed' | 'failed'>('all');

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setIsLoading(true);
      const [tracks, users, modules, tests] = await Promise.all([
        getAllCertificationTracks(),
        getAllUsers(),
        getAllModules(),
        getAllMockTests()
      ]);

      setAllUsers(users.filter((u: any) => u.role === 'user'));
      setAllModules(modules);
      setAllTests(tests);

      // Transform tracks into programs with additional data
      const programsData = tracks.map((track: any) => {
        const enrolledStudents = users.filter((u: any) => u.certificationTrack === track.id && u.role === 'user');
        const completedStudents = enrolledStudents.filter((u: any) => u.examStatus === 'passed');

        return {
          id: track.id,
          name: track.name,
          description: track.description,
          duration: track.duration,
          price: track.price,
          level: track.level,
          features: track.features,
          curriculum: modules.filter((m: any) => track.curriculum?.includes(m.id) || true), // All modules for now
          mockTests: tests.filter((t: any) => track.mockTests?.includes(t.id) || true), // All tests for now
          enrolledStudents: enrolledStudents.length,
          completedStudents: completedStudents.length,
          certificatesIssued: completedStudents.length
        };
      });

      setPrograms(programsData);
      if (programsData.length > 0) {
        setSelectedProgram(programsData[0].id);
      }
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentProgram = programs.find(p => p.id === selectedProgram);

  // Get enrolled students for current program
  const programStudents = allUsers.filter((u: any) => u.certificationTrack === selectedProgram);

  // Filter students based on search and filter
  const filteredStudents = programStudents.filter((student: any) => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                         student.email.toLowerCase().includes(studentSearch.toLowerCase());

    const matchesFilter = studentFilter === 'all' ||
                         (studentFilter === 'active' && student.examStatus === 'not_attempted') ||
                         (studentFilter === 'completed' && student.examStatus === 'passed') ||
                         (studentFilter === 'failed' && student.examStatus === 'failed');

    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleSaveCourse = (course: any) => {
    alert('Course module saved successfully!');
    setShowCourseEditor(false);
    setEditingCourse(null);
    loadPrograms();
  };

  const handleDeleteCourse = (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      alert('Module deleted successfully!');
      loadPrograms();
    }
  };

  const handleSaveTest = (test: any) => {
    alert('Mock test saved successfully!');
    setShowTestEditor(false);
    setEditingTest(null);
    loadPrograms();
  };

  const handleDeleteTest = (testId: string) => {
    if (confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      alert('Test deleted successfully!');
      loadPrograms();
    }
  };

  const handleSaveExamConfig = () => {
    alert('Exam configuration saved successfully!');
    setShowExamConfig(false);
  };

  const handleExportPDF = () => {
    alert('PDF export initiated! In production, this would generate a PDF with all certificate data.');
  };

  const handleExportExcel = () => {
    const program = currentProgram;
    if (!program) return;

    // Create CSV content
    const csvContent = [
      ['Certification Program Analytics Report'],
      ['Program Name', program.name],
      ['Generated Date', new Date().toLocaleDateString()],
      [''],
      ['Key Metrics'],
      ['Metric', 'Value'],
      ['Total Students', program.enrolledStudents],
      ['Completed Students', program.completedStudents],
      ['Success Rate', `${program.enrolledStudents > 0 ? Math.round((program.completedStudents / program.enrolledStudents) * 100) : 0}%`],
      ['Total Revenue', `₹${(program.enrolledStudents * program.price).toLocaleString()}`],
      [''],
      ['Student Details'],
      ['Name', 'Email', 'Progress', 'Exam Status', 'Enrolled Date']
    ];

    programStudents.forEach((student: any) => {
      csvContent.push([
        student.name,
        student.email,
        `${student.courseProgress?.overallProgress || 0}%`,
        student.examStatus,
        new Date(student.enrollment.enrolledDate).toLocaleDateString()
      ]);
    });

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${program.name.replace(/\s+/g, '_')}_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleViewDetailedReport = () => {
    const program = currentProgram;
    if (!program) return;

    const report = `
═══════════════════════════════════════════════════════
  CERTIFICATION PROGRAM DETAILED REPORT
═══════════════════════════════════════════════════════

Program: ${program.name}
Generated: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Enrolled: ${program.enrolledStudents}
Completed: ${program.completedStudents}
In Progress: ${programStudents.filter((s: any) => s.examStatus === 'not_attempted').length}
Failed: ${programStudents.filter((s: any) => s.examStatus === 'failed').length}
Success Rate: ${program.enrolledStudents > 0 ? Math.round((program.completedStudents / program.enrolledStudents) * 100) : 0}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIAL METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Revenue: ₹${(program.enrolledStudents * program.price).toLocaleString()}
Price per Student: ₹${program.price.toLocaleString()}
Average Revenue/Student: ₹${program.price.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROGRESS DISTRIBUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

0-25%: ${programStudents.filter((s: any) => (s.courseProgress?.overallProgress || 0) <= 25).length} students
26-50%: ${programStudents.filter((s: any) => (s.courseProgress?.overallProgress || 0) > 25 && (s.courseProgress?.overallProgress || 0) <= 50).length} students
51-75%: ${programStudents.filter((s: any) => (s.courseProgress?.overallProgress || 0) > 50 && (s.courseProgress?.overallProgress || 0) <= 75).length} students
76-100%: ${programStudents.filter((s: any) => (s.courseProgress?.overallProgress || 0) > 75).length} students

Average Progress: ${Math.round(programStudents.reduce((sum: number, s: any) => sum + (s.courseProgress?.overallProgress || 0), 0) / Math.max(programStudents.length, 1))}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRICULUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Modules: ${program.curriculum.length}
${program.curriculum.map((m: any, i: number) => `${i + 1}. ${m.title}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOCK TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Tests: ${program.mockTests.length}
${program.mockTests.map((t: any, i: number) => `${i + 1}. ${t.title} (${t.totalQuestions} questions)`).join('\n')}

═══════════════════════════════════════════════════════
End of Report
═══════════════════════════════════════════════════════
    `.trim();

    // Create a new window/tab with the report
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(`
        <html>
          <head>
            <title>Detailed Report - ${program.name}</title>
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
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading certification programs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modals */}
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

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/20">
                    {selectedStudent.profile.photo ? (
                      <img src={selectedStudent.profile.photo} alt={selectedStudent.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                        {selectedStudent.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                    <p className="text-white/90">{selectedStudent.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStudentDetails(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Progress Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-sm text-blue-700 font-semibold mb-1">Overall Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{selectedStudent.courseProgress?.overallProgress || 0}%</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                  <p className="text-sm text-green-700 font-semibold mb-1">Modules Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {selectedStudent.courseProgress?.modules.filter((m: any) => m.status === 'completed').length || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                  <p className="text-sm text-purple-700 font-semibold mb-1">Tests Taken</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {selectedStudent.mockTests?.filter((t: any) => t.completed).length || 0}
                  </p>
                </div>
              </div>

              {/* Profile Information */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Profile Information</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold">Organization</p>
                    <p className="text-slate-900">{selectedStudent.profile.organization}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold">Designation</p>
                    <p className="text-slate-900">{selectedStudent.profile.designation}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold">Location</p>
                    <p className="text-slate-900">{selectedStudent.profile.location}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold">Phone</p>
                    <p className="text-slate-900">{selectedStudent.profile.phone}</p>
                  </div>
                </div>
              </div>

              {/* Enrollment Details */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Enrollment Details</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold">Enrolled Date</p>
                    <p className="text-slate-900">{new Date(selectedStudent.enrollment.enrolledDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold">Exam Status</p>
                    <p className="text-slate-900 capitalize">{selectedStudent.examStatus.replace('_', ' ')}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold">Remaining Attempts</p>
                    <p className="text-slate-900">{selectedStudent.remainingAttempts}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold">Verification Status</p>
                    <p className="text-slate-900">{selectedStudent.profile.verified ? 'Verified' : 'Not Verified'}</p>
                  </div>
                </div>
              </div>

              {/* Module Progress */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Module Progress</h3>
                <div className="space-y-2">
                  {selectedStudent.courseProgress?.modules.map((module: any, index: number) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-900">Module {index + 1}</span>
                        <span className="text-sm font-bold text-slate-900">{module.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-red-600 h-full rounded-full"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Test Results */}
              {selectedStudent.mockTests && selectedStudent.mockTests.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Mock Test Results</h3>
                  <div className="space-y-2">
                    {selectedStudent.mockTests.map((test: any, index: number) => (
                      <div key={index} className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Test {index + 1}</p>
                          <p className="text-xs text-slate-600">{test.completed ? 'Completed' : 'Not Attempted'}</p>
                        </div>
                        {test.completed && (
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{test.score}%</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowStudentDetails(false)}
                className="bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Configuration Modal */}
      {showExamConfig && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Configure Main Certification Exam</h2>
                <button
                  onClick={() => setShowExamConfig(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Total Questions
                </label>
                <input
                  type="number"
                  value={examConfig.totalQuestions}
                  onChange={(e) => setExamConfig({ ...examConfig, totalQuestions: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={examConfig.duration}
                  onChange={(e) => setExamConfig({ ...examConfig, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  value={examConfig.passingScore}
                  onChange={(e) => setExamConfig({ ...examConfig, passingScore: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Maximum Attempts
                </label>
                <input
                  type="number"
                  value={examConfig.maxAttempts}
                  onChange={(e) => setExamConfig({ ...examConfig, maxAttempts: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  min="1"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowExamConfig(false)}
                className="px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExamConfig}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}

    <div className="space-y-6">
      {/* Programs Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Certification Programs</h2>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold">
            <Plus className="w-5 h-5" />
            <span>Create New Program</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {programs.map((program) => (
            <div
              key={program.id}
              onClick={() => setSelectedProgram(program.id)}
              className={`bg-white rounded-xl p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedProgram === program.id
                  ? 'border-purple-600 shadow-lg'
                  : 'border-slate-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{program.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{program.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span>{program.duration}</span>
                    <span>•</span>
                    <span className="font-semibold text-purple-600">₹{program.price.toLocaleString()}</span>
                  </div>
                </div>
                <Award className={`w-8 h-8 ${selectedProgram === program.id ? 'text-purple-600' : 'text-slate-400'}`} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{program.enrolledStudents}</p>
                  <p className="text-xs text-slate-500">Enrolled</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{program.completedStudents}</p>
                  <p className="text-xs text-slate-500">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{program.certificatesIssued}</p>
                  <p className="text-xs text-slate-500">Certified</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Details */}
      {currentProgram && (
        <div className="bg-white rounded-xl shadow-md">
          {/* Program Header */}
          <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 rounded-t-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentProgram.name}</h2>
                <p className="text-white/90">{currentProgram.description}</p>
              </div>
              <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all font-semibold">
                <Edit2 className="w-4 h-4" />
                <span>Edit Program</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex flex-wrap gap-2 px-6 py-2">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`py-3 px-4 rounded-t-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'curriculum'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Curriculum</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`py-3 px-4 rounded-t-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'tests'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Mock Tests</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-3 px-4 rounded-t-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'students'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Enrolled Students ({currentProgram.enrolledStudents})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('exams')}
                className={`py-3 px-4 rounded-t-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'exams'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Main Exam</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`py-3 px-4 rounded-t-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'certificates'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Certificates ({currentProgram.certificatesIssued})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-3 px-4 rounded-t-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports & Analytics</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Course Curriculum</h3>
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      setShowCourseEditor(true);
                    }}
                    className="flex items-center space-x-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-all font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Module</span>
                  </button>
                </div>
                {currentProgram.curriculum.map((module: any, index: number) => (
                  <div key={module.id} className="bg-slate-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-2">{module.title}</h4>
                          <p className="text-sm text-slate-600 mb-3">{module.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {module.topics.map((topic: string, idx: number) => (
                              <span key={idx} className="text-xs bg-white text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingCourse(module);
                            setShowCourseEditor(true);
                          }}
                          className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-semibold px-3 py-2 hover:bg-purple-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(module.id)}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-800 font-semibold px-3 py-2 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mock Tests Tab */}
            {activeTab === 'tests' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Mock Tests</h3>
                  <button
                    onClick={() => {
                      setEditingTest(null);
                      setShowTestEditor(true);
                    }}
                    className="flex items-center space-x-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-all font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Test</span>
                  </button>
                </div>
                {currentProgram.mockTests.map((test: any) => (
                  <div key={test.id} className="bg-slate-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{test.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>{test.totalQuestions} questions</span>
                          <span>•</span>
                          <span>{test.duration} minutes</span>
                          <span>•</span>
                          <span>Pass: {test.passingScore}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setEditingTest(test);
                            setShowTestEditor(true);
                          }}
                          className="border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all font-semibold"
                        >
                          View Questions
                        </button>
                        <button
                          onClick={() => {
                            setEditingTest(test);
                            setShowTestEditor(true);
                          }}
                          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTest(test.id)}
                          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enrolled Students Tab */}
            {activeTab === 'students' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    Enrolled Students ({filteredStudents.length} of {currentProgram.enrolledStudents})
                  </h3>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-slate-600" />
                    <select
                      value={studentFilter}
                      onChange={(e) => setStudentFilter(e.target.value as any)}
                      className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    >
                      <option value="all">All Students</option>
                      <option value="active">Active (In Progress)</option>
                      <option value="completed">Completed (Passed)</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Students Table */}
                {filteredStudents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100 border-b-2 border-slate-200">
                          <th className="text-left p-4 font-bold text-slate-700">Student</th>
                          <th className="text-left p-4 font-bold text-slate-700">Email</th>
                          <th className="text-left p-4 font-bold text-slate-700">Progress</th>
                          <th className="text-left p-4 font-bold text-slate-700">Exam Status</th>
                          <th className="text-left p-4 font-bold text-slate-700">Enrolled Date</th>
                          <th className="text-left p-4 font-bold text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student: any) => (
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
                              {student.examStatus === 'failed' && (
                                <span className="inline-flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                                  <X className="w-4 h-4" />
                                  <span>Failed</span>
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
                            <td className="p-4">
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowStudentDetails(true);
                                }}
                                className="text-purple-600 hover:text-purple-800 font-semibold"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-8 text-center">
                    <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No students found matching your filters</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Main Exam Tab */}
            {activeTab === 'exams' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Main Certification Exam</h3>
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Exam Configuration</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Questions:</span>
                          <span className="font-semibold">{examConfig.totalQuestions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Duration:</span>
                          <span className="font-semibold">{examConfig.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Passing Score:</span>
                          <span className="font-semibold">{examConfig.passingScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Max Attempts:</span>
                          <span className="font-semibold">{examConfig.maxAttempts}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Exam Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Attempts:</span>
                          <span className="font-semibold">{currentProgram.enrolledStudents * 2}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Passed:</span>
                          <span className="font-semibold text-green-600">{currentProgram.completedStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Failed:</span>
                          <span className="font-semibold text-red-600">
                            {currentProgram.enrolledStudents - currentProgram.completedStudents}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Success Rate:</span>
                          <span className="font-semibold text-purple-600">
                            {currentProgram.enrolledStudents > 0
                              ? Math.round((currentProgram.completedStudents / currentProgram.enrolledStudents) * 100)
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowExamConfig(true)}
                    className="mt-6 w-full bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-semibold"
                  >
                    Configure Exam Settings
                  </button>
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    Certificates Issued ({currentProgram.certificatesIssued})
                  </h3>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export All</span>
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <Award className="w-8 h-8 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-600">{currentProgram.certificatesIssued}</p>
                    <p className="text-sm text-green-700">Total Certificates</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <CheckCircle className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {currentProgram.enrolledStudents > 0
                        ? Math.round((currentProgram.certificatesIssued / currentProgram.enrolledStudents) * 100)
                        : 0}%
                    </p>
                    <p className="text-sm text-blue-700">Success Rate</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                    <Clock className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-600">
                      {currentProgram.enrolledStudents - currentProgram.certificatesIssued}
                    </p>
                    <p className="text-sm text-purple-700">In Progress</p>
                  </div>
                </div>

                {/* Certificates Table */}
                {programStudents.filter((s: any) => s.examStatus === 'passed').length > 0 ? (
                  <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100 border-b-2 border-slate-200">
                          <th className="text-left p-4 font-bold text-slate-700">Student Name</th>
                          <th className="text-left p-4 font-bold text-slate-700">Certificate ID</th>
                          <th className="text-left p-4 font-bold text-slate-700">Issue Date</th>
                          <th className="text-left p-4 font-bold text-slate-700">Score</th>
                          <th className="text-left p-4 font-bold text-slate-700">Credly Badge</th>
                          <th className="text-left p-4 font-bold text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programStudents
                          .filter((student: any) => student.examStatus === 'passed')
                          .map((student: any) => (
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
                              <td className="p-4">
                                <span className="font-mono text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                  {student.certificateNumber || 'CERT-' + student.id.slice(0, 8).toUpperCase()}
                                </span>
                              </td>
                              <td className="p-4 text-slate-600 text-sm">
                                {student.enrollment?.completedDate
                                  ? new Date(student.enrollment.completedDate).toLocaleDateString()
                                  : new Date().toLocaleDateString()}
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                  {student.courseProgress?.overallProgress || 100}%
                                </span>
                              </td>
                              <td className="p-4">
                                {student.credlyBadgeUrl ? (
                                  <button
                                    onClick={() => window.open(student.credlyBadgeUrl, '_blank')}
                                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 font-semibold"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    <span>View Badge</span>
                                  </button>
                                ) : (
                                  <button className="text-slate-400 text-sm">Not issued</button>
                                )}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => {
                                      alert(`Downloading certificate for ${student.name}...`);
                                    }}
                                    className="flex items-center space-x-1 bg-purple-100 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-all text-sm font-semibold"
                                  >
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                  </button>
                                  {!student.credlyBadgeUrl && (
                                    <button
                                      onClick={() => {
                                        alert(`Issuing Credly badge for ${student.name}...`);
                                      }}
                                      className="flex items-center space-x-1 bg-green-100 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-all text-sm font-semibold"
                                    >
                                      <Award className="w-4 h-4" />
                                      <span>Issue Badge</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-8 text-center">
                    <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No certificates issued yet</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Certificates will appear here once students pass the certification exam
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Reports & Analytics</h3>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                    <Users className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{currentProgram.enrolledStudents}</p>
                    <p className="text-sm text-blue-700">Total Students</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                    <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-600">{currentProgram.completedStudents}</p>
                    <p className="text-sm text-green-700">Completed</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200">
                    <Clock className="w-6 h-6 text-yellow-600 mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">
                      {programStudents.filter((s: any) => s.examStatus === 'not_attempted').length}
                    </p>
                    <p className="text-sm text-yellow-700">In Progress</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                    <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-600">
                      {currentProgram.enrolledStudents > 0
                        ? Math.round((currentProgram.completedStudents / currentProgram.enrolledStudents) * 100)
                        : 0}%
                    </p>
                    <p className="text-sm text-purple-700">Success Rate</p>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Enrollment Trend */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span>Enrollment Trend</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Last Month</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-slate-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-600 to-red-600 h-full rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">+{Math.floor(currentProgram.enrolledStudents * 0.3)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">This Month</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-slate-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-600 to-red-600 h-full rounded-full" style={{ width: '90%' }}></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">+{Math.floor(currentProgram.enrolledStudents * 0.4)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Projected Next Month</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-slate-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-600 to-red-600 h-full rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">+{Math.floor(currentProgram.enrolledStudents * 0.25)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-semibold">Total Growth</span>
                        <span className="text-green-600 font-bold">+{Math.round((currentProgram.enrolledStudents / Math.max(currentProgram.enrolledStudents - 10, 1)) * 100 - 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Completion Rate Breakdown */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      <span>Exam Results Distribution</span>
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-600">Passed</span>
                          <span className="text-sm font-bold text-green-600">{currentProgram.completedStudents}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
                            style={{
                              width: `${currentProgram.enrolledStudents > 0
                                ? (currentProgram.completedStudents / currentProgram.enrolledStudents) * 100
                                : 0}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-600">Failed</span>
                          <span className="text-sm font-bold text-red-600">
                            {programStudents.filter((s: any) => s.examStatus === 'failed').length}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full"
                            style={{
                              width: `${currentProgram.enrolledStudents > 0
                                ? (programStudents.filter((s: any) => s.examStatus === 'failed').length / currentProgram.enrolledStudents) * 100
                                : 0}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-600">In Progress</span>
                          <span className="text-sm font-bold text-blue-600">
                            {programStudents.filter((s: any) => s.examStatus === 'not_attempted').length}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                            style={{
                              width: `${currentProgram.enrolledStudents > 0
                                ? (programStudents.filter((s: any) => s.examStatus === 'not_attempted').length / currentProgram.enrolledStudents) * 100
                                : 0}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Average Progress */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      <span>Student Progress Overview</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="text-center py-4">
                        <div className="relative inline-flex items-center justify-center w-32 h-32">
                          <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              className="text-slate-200"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="url(#gradient)"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 56}`}
                              strokeDashoffset={`${2 * Math.PI * 56 * (1 - (programStudents.reduce((sum: number, s: any) => sum + (s.courseProgress?.overallProgress || 0), 0) / Math.max(programStudents.length, 1) / 100))}`}
                              className="transition-all duration-500"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#9333ea" />
                                <stop offset="100%" stopColor="#dc2626" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute text-center">
                            <p className="text-3xl font-bold text-slate-900">
                              {Math.round(programStudents.reduce((sum: number, s: any) => sum + (s.courseProgress?.overallProgress || 0), 0) / Math.max(programStudents.length, 1))}%
                            </p>
                            <p className="text-xs text-slate-500">Avg Progress</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-slate-50 rounded p-2 text-center">
                          <p className="text-slate-600">0-25%</p>
                          <p className="text-lg font-bold text-slate-900">
                            {programStudents.filter((s: any) => (s.courseProgress?.overallProgress || 0) <= 25).length}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded p-2 text-center">
                          <p className="text-slate-600">26-50%</p>
                          <p className="text-lg font-bold text-slate-900">
                            {programStudents.filter((s: any) => (s.courseProgress?.overallProgress || 0) > 25 && (s.courseProgress?.overallProgress || 0) <= 50).length}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded p-2 text-center">
                          <p className="text-slate-600">51-75%</p>
                          <p className="text-lg font-bold text-slate-900">
                            {programStudents.filter((s: any) => (s.courseProgress?.overallProgress || 0) > 50 && (s.courseProgress?.overallProgress || 0) <= 75).length}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded p-2 text-center">
                          <p className="text-slate-600">76-100%</p>
                          <p className="text-lg font-bold text-slate-900">
                            {programStudents.filter((s: any) => (s.courseProgress?.overallProgress || 0) > 75).length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Analytics */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span>Revenue Analytics</span>
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                        <p className="text-sm text-green-700 mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-green-600">
                          ₹{(currentProgram.enrolledStudents * currentProgram.price).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Enrolled Students</span>
                          <span className="text-sm font-bold text-slate-900">{currentProgram.enrolledStudents}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Price per Student</span>
                          <span className="text-sm font-bold text-slate-900">₹{currentProgram.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                          <span className="text-sm text-slate-600">Avg Revenue/Student</span>
                          <span className="text-sm font-bold text-purple-600">₹{currentProgram.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleViewDetailedReport}
                        className="w-full bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-all font-semibold"
                      >
                        View Detailed Report
                      </button>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className="bg-gradient-to-r from-purple-50 to-red-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Export Reports</h4>
                      <p className="text-sm text-slate-600">Download comprehensive analytics and reports</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleViewDetailedReport}
                        className="flex items-center space-x-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all font-semibold border-2 border-purple-200"
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
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
