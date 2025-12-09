// import { db } from '../db/config';
// import { users, roles, permissions, certificationTracks, modules, mockTests, courseProgress, mockTestResults, leads } from '../db/schema';
// import { eq, and, sql, or, like } from 'drizzle-orm';
import { LeadType, LeadStatus } from './leadService';
import { User } from './authService'; // Import User interface

const API_BASE_URL = '/api'; // Base URL for your API

// ============================================
// USER OPERATIONS
// ============================================

export async function getAllUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allUsers = await response.json();
    return allUsers.map((user: User) => ({
      ...user,
      profile: {
        phone: user.profile?.phone || '',
        organization: user.profile?.organization || '',
        designation: user.profile?.designation || '',
        location: user.profile?.location || '',
        joinedDate: user.profile?.joinedDate || '',
        bio: user.profile?.bio || '',
        photo: user.profile?.photo || '',
        idDocument: user.profile?.idDocument || '',
        verified: user.profile?.verified || false,
        verifiedBy: user.profile?.verifiedBy || undefined,
        verifiedDate: user.profile?.verifiedDate || undefined,
      },
      enrollment: {
        status: user.enrollment?.status || 'active',
        enrolledDate: user.enrollment?.enrolledDate || '',
        expiryDate: user.enrollment?.expiryDate || '',
      },
      adminRole: user.adminRole || undefined,
      certificationTrack: user.certificationTrack || undefined,
      examStatus: user.examStatus || 'not_attempted',
      remainingAttempts: user.remainingAttempts || 2,
      credlyBadgeUrl: user.credlyBadgeUrl || undefined,
      certificateNumber: user.certificateNumber || undefined,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Removed getUserByEmail and authenticateUser, now in src/server/controllers/authController.ts

export async function getUserById(userId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    if (!user) return null;

    return {
      ...user,
      profile: {
        phone: user.phone || '',
        organization: user.organization || '',
        designation: user.designation || '',
        location: user.location || '',
        joinedDate: user.joinedDate || '',
        bio: user.bio || '',
        photo: user.photo || '',
        idDocument: user.idDocument || '',
        verified: user.verified || false,
        verifiedBy: user.verifiedBy || undefined,
        verifiedDate: user.verifiedDate || undefined,
      },
      enrollment: {
        status: user.enrollmentStatus || 'active',
        enrolledDate: user.enrolledDate || '',
        expiryDate: user.expiryDate || '',
      },
      adminRole: user.adminRole || undefined,
      certificationTrack: user.certificationTrack || undefined,
      examStatus: user.examStatus || 'not_attempted',
      remainingAttempts: user.remainingAttempts || 2,
      credlyBadgeUrl: user.credlyBadgeUrl || undefined,
      certificateNumber: user.certificateNumber || undefined,
    };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
  adminRole?: string;
  certificationTrack?: string;
  phone?: string;
  organization?: string;
  designation?: string;
  location?: string;
  joinedDate?: string;
  bio?: string;
  photo?: string;
  enrollmentStatus?: string;
  enrolledDate?: string;
  expiryDate?: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(userId: number, updates: Partial<{
  name: string;
  email: string;
  password: string;
  role: string;
  adminRole: string | null;
  certificationTrack: string | null;
  phone: string | null;
  organization: string | null;
  designation: string | null;
  location: string | null;
  bio: string | null;
  photo: string | null;
  idDocument: string | null;
  verified: boolean;
  verifiedBy: string | null;
  verifiedDate: string | null;
  enrollmentStatus: string;
  enrolledDate: string | null;
  expiryDate: string | null;
  examStatus: string;
  remainingAttempts: number;
  addonAttempts: number;
  addonAttemptsPurchased: number;
  credlyBadgeUrl: string | null;
  certificateNumber: string | null;
  certificateIssuedDate: string | null;
  certificateExpiryDate: string | null;
  certificateStatus: string | null;
  expiryNotificationSent: boolean;
}>) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(userId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.ok;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// ============================================
// COURSE PROGRESS OPERATIONS
// ============================================

export async function getUserCourseProgress(userId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/course-progress`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching course progress:', error);
    throw error;
  }
}

export async function updateCourseProgress(userId: number, moduleId: string, progressData: {
  progress: number;
  status: string;
  overallProgress: number;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/course-progress/${moduleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating course progress:', error);
    throw error;
  }
}

// ============================================
// MOCK TEST OPERATIONS
// ============================================

export async function getAllMockTests() {
  try {
    const response = await fetch(`${API_BASE_URL}/mock-tests`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tests = await response.json();
    return tests.map((test: any) => ({
      ...test,
      questions: test.questions as any[],
    }));
  } catch (error) {
    console.error('Error fetching mock tests:', error);
    throw error;
  }
}

export async function getMockTestById(testId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/mock-tests/${testId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const test = await response.json();
    if (!test) return null;
    return {
      ...test,
      questions: test.questions as any[],
    };
  } catch (error) {
    console.error('Error fetching mock test:', error);
    throw error;
  }
}

export async function getUserMockTestResults(userId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/mock-tests`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching mock test results:', error);
    throw error;
  }
}

export async function saveMockTestResult(userId: number, testId: string, score: number, completed: boolean, answers?: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/mock-tests/${testId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, completed, answers }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving mock test result:', error);
    throw error;
  }
}

export async function createMockTest(test: {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  totalQuestions?: number;
  passingScore?: number;
  questions: any[];
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/mock-tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating mock test:', error);
    throw error;
  }
}

export async function updateMockTest(testId: string, test: {
  title?: string;
  description?: string;
  duration?: number;
  totalQuestions?: number;
  passingScore?: number;
  questions?: any[];
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/mock-tests/${testId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating mock test:', error);
    throw error;
  }
}

export async function deleteMockTest(testId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/mock-tests/${testId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting mock test:', error);
    throw error;
  }
}

// ============================================
// ROLES & PERMISSIONS OPERATIONS
// ============================================

export async function getAllRoles() {
  try {
    const response = await fetch(`${API_BASE_URL}/roles`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allRoles = await response.json();
    return allRoles.map((role: any) => ({
      ...role,
      permissions: role.permissions as string[],
    }));
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

export async function getAllPermissions() {
  try {
    const response = await fetch(`${API_BASE_URL}/permissions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
}

export async function getRoleById(roleId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const role = await response.json();
    if (!role) return null;
    return {
      ...role,
      permissions: role.permissions as string[],
    };
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
}

// ============================================
// CERTIFICATION TRACKS OPERATIONS
// ============================================

export async function getAllCertificationTracks() {
  try {
    const response = await fetch(`${API_BASE_URL}/certification-tracks`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tracks = await response.json();
    return tracks.map((track: any) => ({
      ...track,
      modules: track.modules as string[],
      competencies: track.competencies as string[],
    }));
  } catch (error) {
    console.error('Error fetching certification tracks:', error);
    throw error;
  }
}

export async function getCertificationTrackById(trackId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/certification-tracks/${trackId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const track = await response.json();
    if (!track) return null;
    return {
      ...track,
      modules: track.modules as string[],
      competencies: track.competencies as string[],
    };
  } catch (error) {
    console.error('Error fetching certification track:', error);
    throw error;
  }
}

// ============================================
// MODULES OPERATIONS
// ============================================

export async function getAllModules() {
  try {
    const response = await fetch(`${API_BASE_URL}/modules`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allModules = await response.json();
    return allModules.map((module: any) => ({
      ...module,
      topics: module.topics as string[],
    }));
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
}

export async function getModuleById(moduleId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const module = await response.json();
    if (!module) return null;
    return {
      ...module,
      topics: module.topics as string[],
    };
  } catch (error) {
    console.error('Error fetching module:', error);
    throw error;
  }
}

// ============================================
// AUTHENTICATION
// ============================================

// Removed authenticateUser, now in src/server/controllers/authController.ts

// ============================================
// LEADS OPERATIONS
// ============================================

export async function getAllLeads() {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allLeads = await response.json();
    return allLeads.map((lead: any) => ({
      ...lead,
      id: String(lead.id),
      type: lead.type as LeadType,
      status: lead.status as LeadStatus,
      notes: (lead.notes as string[]) || [],
      createdDate: lead.createdAt?.toISOString() || new Date().toISOString(),
      lastUpdated: lead.updatedAt?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}

export async function getLeadById(leadId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const lead = await response.json();
    if (!lead) return null;
    return {
      ...lead,
      id: String(lead.id),
      type: lead.type as LeadType,
      status: lead.status as LeadStatus,
      notes: (lead.notes as string[]) || [],
      createdDate: lead.createdAt?.toISOString() || new Date().toISOString(),
      lastUpdated: lead.updatedAt?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching lead:', error);
    throw error;
  }
}

export async function createLead(leadData: {
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  organization: string;
  address: string | null;
  additionalInfo: string | null;
  status: LeadStatus;
  assignedTo: string | null;
  estimatedValue: number | null;
  followUpDate: string | null;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const lead = await response.json();
    return {
      ...lead,
      id: String(lead.id),
      type: lead.type as LeadType,
      status: lead.status as LeadStatus,
      notes: (lead.notes as string[]) || [],
      createdDate: lead.createdAt?.toISOString() || new Date().toISOString(),
      lastUpdated: lead.updatedAt?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

export async function updateLead(leadId: number, updates: Partial<{
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  organization: string;
  address: string | null;
  additionalInfo: string | null;
  status: LeadStatus;
  assignedTo: string | null;
  estimatedValue: number | null;
  followUpDate: string | null;
}>) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const lead = await response.json();
    if (!lead) return null;
    return {
      ...lead,
      id: String(lead.id),
      type: lead.type as LeadType,
      status: lead.status as LeadStatus,
      notes: (lead.notes as string[]) || [],
      createdDate: lead.createdAt?.toISOString() || new Date().toISOString(),
      lastUpdated: lead.updatedAt?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
}

export async function updateLeadStatus(leadId: number, status: string, updatedBy: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, updatedBy }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const lead = await response.json();
    if (!lead) return null;
    return {
      ...lead,
      id: String(lead.id),
      type: lead.type as LeadType,
      status: lead.status as LeadStatus,
      notes: (lead.notes as string[]) || [],
      createdDate: lead.createdAt?.toISOString() || new Date().toISOString(),
      lastUpdated: lead.updatedAt?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
}

export async function addLeadNote(leadId: number, note: string, createdBy: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, createdBy }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const lead = await response.json();
    if (!lead) return null;
    return {
      ...lead,
      id: String(lead.id),
      type: lead.type as LeadType,
      status: lead.status as LeadStatus,
      notes: (lead.notes as string[]) || [],
      createdDate: lead.createdAt?.toISOString() || new Date().toISOString(),
      lastUpdated: lead.updatedAt?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error adding lead note:', error);
    throw error;
  }
}

export async function deleteLead(leadId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.ok;
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
}

export async function searchLeads(query: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const results = await response.json();
    return results.map((lead: any) => ({
      ...lead,
      id: String(lead.id),
      type: lead.type as LeadType,
      status: lead.status as LeadStatus,
      notes: (lead.notes as string[]) || [],
      createdDate: lead.createdAt?.toISOString() || new Date().toISOString(),
      lastUpdated: lead.updatedAt?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error searching leads:', error);
    throw error;
  }
}

export async function getLeadStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/stats`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting lead stats:', error);
    throw error;
  }
}
