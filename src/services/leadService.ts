// Lead Management Service
import * as database from './database';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'converted' | 'lost';
export type LeadType = 'university' | 'school' | 'organization';

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  organization: string;
  address: string | null;
  additionalInfo: string | null;
  status: LeadStatus;
  createdDate: string;
  lastUpdated: string;
  assignedTo: string | null;
  notes: string[];
  estimatedValue: number | null;
  followUpDate: string | null;
}

export interface LeadNote {
  id: string;
  leadId: string;
  note: string;
  createdBy: string;
  createdDate: string;
}

class LeadService {
  // Get all leads
  async getAllLeads(): Promise<Lead[]> {
    try {
      return await database.getAllLeads();
    } catch (error) {
      console.error('Error getting all leads:', error);
      return [];
    }
  }

  // Get lead by ID
  async getLeadById(id: string): Promise<Lead | null> {
    try {
      return await database.getLeadById(parseInt(id));
    } catch (error) {
      console.error('Error getting lead by ID:', error);
      return null;
    }
  }

  // Create new lead
  async createLead(leadData: Omit<Lead, 'id' | 'createdDate' | 'lastUpdated' | 'notes'>): Promise<Lead | null> {
    try {
      return await database.createLead(leadData);
    } catch (error) {
      console.error('Error creating lead:', error);
      return null;
    }
  }

  // Update lead status
  async updateLeadStatus(leadId: string, status: LeadStatus, updatedBy: string): Promise<boolean> {
    try {
      const result = await database.updateLeadStatus(parseInt(leadId), status, updatedBy);
      return result !== null;
    } catch (error) {
      console.error('Error updating lead status:', error);
      return false;
    }
  }

  // Update lead
  async updateLead(leadId: string, updates: Partial<Lead>): Promise<boolean> {
    try {
      const result = await database.updateLead(parseInt(leadId), updates);
      return result !== null;
    } catch (error) {
      console.error('Error updating lead:', error);
      return false;
    }
  }

  // Add note to lead
  async addNote(leadId: string, note: string, createdBy: string): Promise<boolean> {
    try {
      const result = await database.addLeadNote(parseInt(leadId), note, createdBy);
      return result !== null;
    } catch (error) {
      console.error('Error adding note:', error);
      return false;
    }
  }

  // Delete lead
  async deleteLead(leadId: string): Promise<boolean> {
    try {
      return await database.deleteLead(parseInt(leadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
      return false;
    }
  }

  // Get leads by status
  async getLeadsByStatus(status: LeadStatus): Promise<Lead[]> {
    try {
      const allLeads = await this.getAllLeads();
      return allLeads.filter(lead => lead.status === status);
    } catch (error) {
      console.error('Error getting leads by status:', error);
      return [];
    }
  }

  // Get leads by type
  async getLeadsByType(type: LeadType): Promise<Lead[]> {
    try {
      const allLeads = await this.getAllLeads();
      return allLeads.filter(lead => lead.type === type);
    } catch (error) {
      console.error('Error getting leads by type:', error);
      return [];
    }
  }

  // Get lead statistics
  async getLeadStats() {
    try {
      return await database.getLeadStats();
    } catch (error) {
      console.error('Error getting lead stats:', error);
      return {
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
      };
    }
  }

  // Search leads
  async searchLeads(query: string): Promise<Lead[]> {
    try {
      return await database.searchLeads(query);
    } catch (error) {
      console.error('Error searching leads:', error);
      return [];
    }
  }
}

export const leadService = new LeadService();

// Status color mapping for UI
export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  new: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  contacted: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  qualified: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  negotiation: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  converted: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  lost: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
};

// Status labels
export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New Lead',
  contacted: 'Contacted',
  qualified: 'Qualified',
  negotiation: 'In Negotiation',
  converted: 'Converted',
  lost: 'Lost'
};
