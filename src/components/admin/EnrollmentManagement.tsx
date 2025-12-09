import { useState } from 'react';
import { Users, X, Trash2, UserPlus, Search, Award, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import usersData from '../../data/users.json';
import certificationTracksData from '../../data/certificationTracks.json';

interface User {
  id: string;
  name: string;
  email: string;
  profile: {
    organization: string;
    phone: string;
  };
  enrollment: {
    status: string;
    enrolledDate: string;
  };
  certificationTrack?: string;
  examStatus: string;
  courseProgress: {
    overallProgress: number;
  };
}

interface EnrollmentManagementProps {
  onDeleteUser?: (userId: string) => void;
}

export default function EnrollmentManagement({ onDeleteUser }: EnrollmentManagementProps) {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedUserToUnenroll, setSelectedUserToUnenroll] = useState<User | null>(null);

  const allUsers = usersData.users.filter(u => u.role === 'user') as User[];
  const tracks = certificationTracksData.tracks;

  // Get users by track
  const getUsersByTrack = (trackId: string) => {
    if (trackId === 'all') {
      return allUsers;
    }
    return allUsers.filter(u => u.certificationTrack === trackId);
  };

  // Get track name
  const getTrackName = (trackId?: string) => {
    if (!trackId) return 'No Track Assigned';
    const track = tracks.find(t => t.id === trackId);
    return track?.name || 'Unknown Track';
  };

  // Filter users
  const filteredUsers = getUsersByTrack(selectedTrack).filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.profile.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUnenroll = (user: User) => {
    setSelectedUserToUnenroll(user);
  };

  const confirmUnenroll = () => {
    if (selectedUserToUnenroll) {
      // In production, this would make an API call
      alert(`User ${selectedUserToUnenroll.name} has been unenrolled from ${getTrackName(selectedUserToUnenroll.certificationTrack)}`);
      setSelectedUserToUnenroll(null);
    }
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) {
      // In production, this would make an API call
      onDeleteUser?.(user.id);
      alert(`User ${user.name} has been deleted permanently.`);
    }
  };

  const handleEnrollUser = (userId: string, trackId: string) => {
    // In production, this would make an API call
    alert(`Enrolling user to track: ${getTrackName(trackId)}`);
  };

  // Get enrollment stats
  const getTrackStats = (trackId: string) => {
    const users = getUsersByTrack(trackId);
    return {
      total: users.length,
      active: users.filter(u => u.enrollment.status === 'active').length,
      completed: users.filter(u => u.examStatus === 'passed').length
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Enrollment Management</h2>
          <p className="text-slate-600 mt-1">Manage user enrollments by certification track</p>
        </div>
        <button
          onClick={() => setShowEnrollModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
        >
          <UserPlus className="w-5 h-5" />
          <span>Enroll User</span>
        </button>
      </div>

      {/* Track Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <Users className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-blue-100 text-sm font-semibold mb-1">Total Enrollments</p>
          <p className="text-4xl font-bold mb-1">{allUsers.length}</p>
          <p className="text-blue-100 text-xs">Across all tracks</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white shadow-lg">
          <CheckCircle className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-green-100 text-sm font-semibold mb-1">Active Users</p>
          <p className="text-4xl font-bold mb-1">{allUsers.filter(u => u.enrollment.status === 'active').length}</p>
          <p className="text-green-100 text-xs">Currently enrolled</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <Award className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-purple-100 text-sm font-semibold mb-1">Certified</p>
          <p className="text-4xl font-bold mb-1">{allUsers.filter(u => u.examStatus === 'passed').length}</p>
          <p className="text-purple-100 text-xs">Completed certification</p>
        </div>
      </div>

      {/* Track Filter & Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-bold text-slate-700">Filter by Track:</label>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
            >
              <option value="all">All Tracks ({allUsers.length})</option>
              {tracks.map(track => {
                const stats = getTrackStats(track.id);
                return (
                  <option key={track.id} value={track.id}>
                    {track.name} ({stats.total})
                  </option>
                );
              })}
              <option value="unassigned">Unassigned ({allUsers.filter(u => !u.certificationTrack).length})</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none w-full md:w-64"
            />
          </div>
        </div>

        {/* Track Info (when specific track selected) */}
        {selectedTrack !== 'all' && selectedTrack !== 'unassigned' && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border-2 border-purple-200">
            {(() => {
              const track = tracks.find(t => t.id === selectedTrack);
              const stats = getTrackStats(selectedTrack);
              return track ? (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{track.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{track.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-slate-700"><strong>Price:</strong> ₹{track.price.toLocaleString()}</span>
                      <span className="text-slate-700"><strong>Duration:</strong> {track.duration}</span>
                      <span className="text-slate-700"><strong>Pass Score:</strong> {track.passingScore}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
                    <p className="text-xs text-slate-600">Enrollments</p>
                    <p className="text-sm text-green-600 font-semibold mt-1">{stats.completed} Certified</p>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="text-left p-4 font-bold text-slate-700">User</th>
                <th className="text-left p-4 font-bold text-slate-700">Organization</th>
                <th className="text-left p-4 font-bold text-slate-700">Track</th>
                <th className="text-left p-4 font-bold text-slate-700">Status</th>
                <th className="text-left p-4 font-bold text-slate-700">Progress</th>
                <th className="text-left p-4 font-bold text-slate-700">Enrolled</th>
                <th className="text-left p-4 font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                    <p className="font-semibold">No users found</p>
                    <p className="text-sm">Try adjusting your filters or search term</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{user.profile.organization}</td>
                    <td className="p-4">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        user.certificationTrack
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {getTrackName(user.certificationTrack)}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.examStatus === 'passed' && (
                        <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          <span>Certified</span>
                        </span>
                      )}
                      {user.examStatus === 'failed' && (
                        <span className="inline-flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <X className="w-4 h-4" />
                          <span>Failed</span>
                        </span>
                      )}
                      {user.examStatus === 'not_attempted' && (
                        <span className="inline-flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <Calendar className="w-4 h-4" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-red-600 h-full rounded-full"
                            style={{ width: `${user.courseProgress?.overallProgress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{user.courseProgress?.overallProgress || 0}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">{user.enrollment.enrolledDate}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUnenroll(user)}
                          className="text-orange-600 hover:text-orange-800 p-2 hover:bg-orange-50 rounded transition-all"
                          title="Unenroll from track"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-all"
                          title="Delete user permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unenroll Confirmation Modal */}
      {selectedUserToUnenroll && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Confirm Unenrollment</h3>
              <button
                onClick={() => setSelectedUserToUnenroll(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-slate-600 mb-4">
                Are you sure you want to unenroll <strong>{selectedUserToUnenroll.name}</strong> from{' '}
                <strong>{getTrackName(selectedUserToUnenroll.certificationTrack)}</strong>?
              </p>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> The user will lose access to this track's courses and their progress will be saved but not accessible.
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedUserToUnenroll(null)}
                className="flex-1 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnenroll}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold"
              >
                Unenroll User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll User Modal (placeholder) */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Enroll User to Track</h3>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-600 mb-4">Select a user and track to enroll them.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">User</label>
                <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none">
                  <option>Select a user...</option>
                  {allUsers.filter(u => !u.certificationTrack).map(u => (
                    <option key={u.id} value={u.id}>{u.name} - {u.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Certification Track</label>
                <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none">
                  <option>Select a track...</option>
                  {tracks.map(track => (
                    <option key={track.id} value={track.id}>{track.name} - ₹{track.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-semibold"
              >
                Enroll User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
