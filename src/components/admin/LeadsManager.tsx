import { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, Building2, MapPin, Calendar, TrendingUp, X, Edit2, Save, FileText, Download, Filter } from 'lucide-react';
import { leadService, Lead, LeadStatus, STATUS_COLORS, STATUS_LABELS, LeadType } from '../../services/leadService';

// Leads Manager Component - Fixed async/await issues
export default function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    negotiation: 0,
    converted: 0,
    lost: 0,
    byType: {
      university: 0,
      school: 0,
      organization: 0,
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<LeadType | 'all'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<LeadStatus>('new');
  const [newNote, setNewNote] = useState('');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
    loadStats();
  }, []);

  const loadLeads = async () => {
    const allLeads = await leadService.getAllLeads();
    setLeads(allLeads);
  };

  const loadStats = async () => {
    const leadStats = await leadService.getLeadStats();
    setStats(leadStats);
  };

  const handleStatusChange = (lead: Lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setShowStatusModal(true);
  };

  const saveStatusChange = async () => {
    if (selectedLead) {
      await leadService.updateLeadStatus(selectedLead.id, newStatus, 'Admin');
      if (newNote.trim()) {
        await leadService.addNote(selectedLead.id, newNote, 'Admin');
      }
      await loadLeads();
      await loadStats();
      setShowStatusModal(false);
      setNewNote('');
      setSelectedLead(null);
    }
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };

  const handleAddNote = async () => {
    if (selectedLead && newNote.trim()) {
      await leadService.addNote(selectedLead.id, newNote, 'Admin');
      setNewNote('');
      await loadLeads();
      // Refresh the selected lead
      const updatedLead = await leadService.getLeadById(selectedLead.id);
      if (updatedLead) setSelectedLead(updatedLead);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      await leadService.deleteLead(leadId);
      await loadLeads();
      await loadStats();
      setShowDetailsModal(false);
      setSelectedLead(null);
    }
  };

  const handleExportLeads = () => {
    const csvContent = [
      ['Lead ID', 'Type', 'Name', 'Email', 'Phone', 'Organization', 'Address', 'Status', 'Created Date', 'Last Updated'],
      ...filteredLeads.map(lead => [
        lead.id,
        lead.type,
        lead.name,
        lead.email,
        lead.phone,
        lead.organization,
        lead.address,
        lead.status,
        new Date(lead.createdDate).toLocaleDateString(),
        new Date(lead.lastUpdated).toLocaleDateString()
      ])
    ];

    const csv = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Leads_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesType = filterType === 'all' || lead.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <>
      {/* Status Change Modal */}
      {showStatusModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Update Lead Status</h2>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Lead: <span className="font-semibold text-slate-900">{selectedLead.name}</span></p>
                <p className="text-sm text-slate-600">Organization: <span className="font-semibold text-slate-900">{selectedLead.organization}</span></p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="negotiation">In Negotiation</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Add Note (Optional)</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Add any notes about this status change..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStatusChange}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Lead Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Lead Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Name</label>
                  <p className="text-slate-900 font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Type</label>
                  <p className="text-slate-900 font-medium capitalize">{selectedLead.type}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <p className="text-slate-900">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Phone</label>
                  <p className="text-slate-900">{selectedLead.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Organization</label>
                  <p className="text-slate-900 font-medium">{selectedLead.organization}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[selectedLead.status].bg} ${STATUS_COLORS[selectedLead.status].text}`}>
                    {STATUS_LABELS[selectedLead.status]}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Address</label>
                  <p className="text-slate-900">{selectedLead.address}</p>
                </div>
                {selectedLead.additionalInfo && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Additional Information</label>
                    <p className="text-slate-900">{selectedLead.additionalInfo}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-slate-700">Created</label>
                  <p className="text-slate-900">{new Date(selectedLead.createdDate).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Last Updated</label>
                  <p className="text-slate-900">{new Date(selectedLead.lastUpdated).toLocaleString()}</p>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Activity Notes</h3>
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                  {selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((note, index) => (
                      <div key={index} className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
                        {note}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">No notes yet</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={2}
                    className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-sm"
                    placeholder="Add a note..."
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg hover:opacity-90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleStatusChange(selectedLead)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Change Status</span>
                </button>
                <button
                  onClick={() => handleDeleteLead(selectedLead.id)}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all font-semibold"
                >
                  <X className="w-4 h-4" />
                  <span>Delete Lead</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Leads Management</h2>
            <p className="text-slate-600 mt-1">Manage and track your sales leads</p>
          </div>
          <button
            onClick={handleExportLeads}
            className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all font-semibold"
          >
            <Download className="w-4 h-4" />
            <span>Export Leads</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-blue-700">Total Leads</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
            <FileText className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-600">{stats.new}</p>
            <p className="text-sm text-purple-700">New</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border-2 border-indigo-200">
            <Phone className="w-6 h-6 text-indigo-600 mb-2" />
            <p className="text-2xl font-bold text-indigo-600">{stats.contacted}</p>
            <p className="text-sm text-indigo-700">Contacted</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200">
            <TrendingUp className="w-6 h-6 text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{stats.qualified}</p>
            <p className="text-sm text-yellow-700">Qualified</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
            <Building2 className="w-6 h-6 text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.negotiation}</p>
            <p className="text-sm text-orange-700">Negotiation</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
            <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
            <p className="text-sm text-green-700">Converted</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
            <X className="w-6 h-6 text-red-600 mb-2" />
            <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
            <p className="text-sm text-red-700">Lost</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads by name, email, organization, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as LeadStatus | 'all')}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="negotiation">In Negotiation</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as LeadType | 'all')}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="university">University</option>
                <option value="school">School/College</option>
                <option value="organization">Organization</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-200">
                  <th className="text-left p-4 font-bold text-slate-700">Lead</th>
                  <th className="text-left p-4 font-bold text-slate-700">Type</th>
                  <th className="text-left p-4 font-bold text-slate-700">Contact</th>
                  <th className="text-left p-4 font-bold text-slate-700">Organization</th>
                  <th className="text-left p-4 font-bold text-slate-700">Status</th>
                  <th className="text-left p-4 font-bold text-slate-700">Created</th>
                  <th className="text-left p-4 font-bold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{lead.name}</p>
                          <p className="text-sm text-slate-600">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                        {lead.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{lead.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">{lead.organization}</p>
                      <p className="text-sm text-slate-600">{lead.address}</p>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusChange(lead)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[lead.status].bg} ${STATUS_COLORS[lead.status].text} hover:opacity-80 transition-opacity`}
                      >
                        {STATUS_LABELS[lead.status]}
                      </button>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">
                      {new Date(lead.createdDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewDetails(lead)}
                        className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="bg-slate-50 p-8 text-center">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No leads found</p>
              <p className="text-sm text-slate-500 mt-2">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'New leads will appear here when users register'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
