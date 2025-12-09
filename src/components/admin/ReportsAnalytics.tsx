import { BarChart3, TrendingUp, Users, Award, Download, Calendar, Filter } from 'lucide-react';

export default function ReportsAnalytics() {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
          <p className="text-slate-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 border-2 border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all font-semibold">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-blue-100 text-sm font-semibold mb-1">Total Enrollments</p>
          <p className="text-4xl font-bold mb-1">248</p>
          <p className="text-blue-100 text-xs">+12% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-green-100 text-sm font-semibold mb-1">Certifications Issued</p>
          <p className="text-4xl font-bold mb-1">156</p>
          <p className="text-green-100 text-xs">+8% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-purple-100 text-sm font-semibold mb-1">Average Score</p>
          <p className="text-4xl font-bold mb-1">78%</p>
          <p className="text-purple-100 text-xs">+3% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 opacity-80" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-orange-100 text-sm font-semibold mb-1">Completion Rate</p>
          <p className="text-4xl font-bold mb-1">63%</p>
          <p className="text-orange-100 text-xs">+5% from last month</p>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Monthly Performance - {currentMonth}</h3>
        <div className="space-y-4">
          {[
            { label: 'New Enrollments', value: 45, max: 100, color: 'blue' },
            { label: 'Completed Courses', value: 82, max: 100, color: 'green' },
            { label: 'Tests Taken', value: 156, max: 200, color: 'purple' },
            { label: 'Certifications Issued', value: 38, max: 50, color: 'orange' },
          ].map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">{metric.label}</span>
                <span className="text-sm font-bold text-slate-900">{metric.value}/{metric.max}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 h-full rounded-full transition-all`}
                  style={{ width: `${(metric.value / metric.max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Track Performance */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Performance by Certification Track</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="text-left p-4 font-bold text-slate-700">Track Name</th>
                <th className="text-center p-4 font-bold text-slate-700">Enrollments</th>
                <th className="text-center p-4 font-bold text-slate-700">Completed</th>
                <th className="text-center p-4 font-bold text-slate-700">Avg. Score</th>
                <th className="text-center p-4 font-bold text-slate-700">Success Rate</th>
                <th className="text-center p-4 font-bold text-slate-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'AI Certified Leader', enrollments: 58, completed: 42, avgScore: 82, successRate: 85, revenue: 1050000 },
                { name: 'AI Ready HR Professional', enrollments: 73, completed: 51, avgScore: 76, successRate: 78, revenue: 1314000 },
                { name: 'AI Ready Business Manager', enrollments: 45, completed: 28, avgScore: 79, successRate: 81, revenue: 900000 },
                { name: 'AI Ready Technical Professional', enrollments: 52, completed: 25, avgScore: 85, successRate: 72, revenue: 1144000 },
                { name: 'AI Ready Educator', enrollments: 20, completed: 10, avgScore: 74, successRate: 75, revenue: 300000 },
              ].map((track, idx) => (
                <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-900">{track.name}</td>
                  <td className="p-4 text-center text-slate-600">{track.enrollments}</td>
                  <td className="p-4 text-center text-slate-600">{track.completed}</td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${track.avgScore >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                      {track.avgScore}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${track.successRate >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                      {track.successRate}%
                    </span>
                  </td>
                  <td className="p-4 text-center font-semibold text-slate-900">₹{(track.revenue / 1000).toFixed(0)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Demographics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Top Organizations</h3>
          <div className="space-y-4">
            {[
              { name: 'Tech Solutions Pvt Ltd', users: 18, percentage: 30 },
              { name: 'Innovation Labs', users: 15, percentage: 25 },
              { name: 'Global Tech Corp', users: 12, percentage: 20 },
              { name: 'Digital Ventures', users: 9, percentage: 15 },
              { name: 'Others', users: 6, percentage: 10 },
            ].map((org) => (
              <div key={org.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">{org.name}</span>
                  <span className="text-sm font-bold text-slate-900">{org.users} users</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-red-600 h-full rounded-full"
                    style={{ width: `${org.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">User Status Distribution</h3>
          <div className="space-y-4">
            {[
              { status: 'Active Users', count: 156, color: 'green', percentage: 63 },
              { status: 'In Progress', count: 62, color: 'blue', percentage: 25 },
              { status: 'Pending Verification', count: 22, color: 'yellow', percentage: 9 },
              { status: 'Suspended', count: 8, color: 'red', percentage: 3 },
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-${item.color}-500`}></div>
                  <span className="font-semibold text-slate-700">{item.status}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{item.count}</p>
                  <p className="text-xs text-slate-500">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Platform Activity</h3>
        <div className="space-y-4">
          {[
            { time: '2 hours ago', event: 'Jane Smith completed AI Ready Business Manager certification', type: 'success' },
            { time: '5 hours ago', event: '15 new users enrolled in AI Certified Leader track', type: 'info' },
            { time: '1 day ago', event: 'Mock Test 2 updated with 10 new questions', type: 'update' },
            { time: '2 days ago', event: 'New module "Advanced AI Ethics" published', type: 'new' },
            { time: '3 days ago', event: 'John Doe failed final exam - Attempt 1', type: 'warning' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  activity.type === 'update' ? 'bg-purple-500' :
                  activity.type === 'new' ? 'bg-cyan-500' :
                  'bg-orange-500'
                }`}></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{activity.event}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
