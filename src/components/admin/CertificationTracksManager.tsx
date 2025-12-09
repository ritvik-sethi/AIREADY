import { useState } from 'react';
import { Plus, Edit2, Trash2, Award, Users, Clock, DollarSign, Target, CheckCircle, XCircle, Crown, Briefcase, Code, BookOpen } from 'lucide-react';
import certificationTracksData from '../../data/certificationTracks.json';

interface Track {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  duration: string;
  price: number;
  passingScore: number;
  modules: string[];
  competencies: string[];
  targetAudience: string;
  prerequisites: string;
  active: boolean;
}

interface CertificationTracksManagerProps {
  onEditTrack?: (track: Track) => void;
  onCreateTrack?: () => void;
}

export default function CertificationTracksManager({ onEditTrack, onCreateTrack }: CertificationTracksManagerProps) {
  const [tracks] = useState<Track[]>(certificationTracksData.tracks);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const getIconComponent = (iconName: string) => {
    const icons: any = {
      crown: Crown,
      users: Users,
      briefcase: Briefcase,
      code: Code,
      book: BookOpen,
    };
    const Icon = icons[iconName] || Award;
    return Icon;
  };

  const getColorClasses = (color: string) => {
    const colors: any = {
      purple: 'from-purple-600 to-purple-800',
      blue: 'from-blue-600 to-blue-800',
      green: 'from-green-600 to-green-800',
      orange: 'from-orange-600 to-orange-800',
      red: 'from-red-600 to-red-800',
    };
    return colors[color] || 'from-purple-600 to-red-600';
  };

  const toggleTrackStatus = (trackId: string) => {
    // In production, this would make an API call
    alert(`Toggled status for track: ${trackId}`);
  };

  const handleDeleteTrack = (trackId: string) => {
    if (confirm('Are you sure you want to delete this certification track?')) {
      // In production, this would make an API call
      alert(`Deleted track: ${trackId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Certification Tracks</h2>
          <p className="text-slate-600 mt-1">Manage different certification verticals and specializations</p>
        </div>
        <button
          onClick={onCreateTrack}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Track</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-purple-600" />
            <span className="text-3xl font-bold text-slate-900">{tracks.length}</span>
          </div>
          <h3 className="text-slate-600 font-semibold">Total Tracks</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-slate-900">{tracks.filter(t => t.active).length}</span>
          </div>
          <h3 className="text-slate-600 font-semibold">Active Tracks</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-slate-900">248</span>
          </div>
          <h3 className="text-slate-600 font-semibold">Total Enrollments</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-orange-600" />
            <span className="text-3xl font-bold text-slate-900">₹{(tracks.reduce((sum, t) => sum + t.price, 0) / 1000).toFixed(0)}K</span>
          </div>
          <h3 className="text-slate-600 font-semibold">Avg. Price</h3>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => {
          const Icon = getIconComponent(track.icon);
          return (
            <div
              key={track.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border-2 border-slate-100"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${getColorClasses(track.color)} p-6 text-white`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {track.active ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="bg-slate-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{track.name}</h3>
                <p className="text-white/90 text-sm">{track.description}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-xs text-slate-500 font-semibold">Duration</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{track.duration}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      <span className="text-xs text-slate-500 font-semibold">Price</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">₹{track.price.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Target className="w-4 h-4 text-slate-500" />
                      <span className="text-xs text-slate-500 font-semibold">Pass Score</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{track.passingScore}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      <span className="text-xs text-slate-500 font-semibold">Modules</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{track.modules.length}</p>
                  </div>
                </div>

                {/* Competencies */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-2">Key Competencies:</h4>
                  <div className="flex flex-wrap gap-1">
                    {track.competencies.slice(0, 3).map((comp, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {comp}
                      </span>
                    ))}
                    {track.competencies.length > 3 && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        +{track.competencies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-1">Target Audience:</h4>
                  <p className="text-xs text-slate-600">{track.targetAudience}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => toggleTrackStatus(track.id)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-all text-sm font-semibold"
                  >
                    {track.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    <span>{track.active ? 'Deactivate' : 'Activate'}</span>
                  </button>
                  <button
                    onClick={() => onEditTrack?.(track)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-all text-sm font-semibold"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTrack(track.id)}
                    className="flex items-center justify-center bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Track Comparison Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Track Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="text-left p-4 font-bold text-slate-700">Track Name</th>
                <th className="text-left p-4 font-bold text-slate-700">Duration</th>
                <th className="text-left p-4 font-bold text-slate-700">Price</th>
                <th className="text-left p-4 font-bold text-slate-700">Pass Score</th>
                <th className="text-left p-4 font-bold text-slate-700">Prerequisites</th>
                <th className="text-left p-4 font-bold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr key={track.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-900">{track.name}</td>
                  <td className="p-4 text-slate-600">{track.duration}</td>
                  <td className="p-4 text-slate-600">₹{track.price.toLocaleString()}</td>
                  <td className="p-4 text-slate-600">{track.passingScore}%</td>
                  <td className="p-4 text-slate-600 text-sm">{track.prerequisites}</td>
                  <td className="p-4">
                    {track.active ? (
                      <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                        <XCircle className="w-4 h-4" />
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
    </div>
  );
}
