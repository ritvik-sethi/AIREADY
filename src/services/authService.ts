import { getAllRoles } from './database';
import { InferSelectModel } from 'drizzle-orm';
import { courseProgress as courseProgressSchema, mockTestResults as mockTestResultsSchema } from '../db/schema';

type CourseProgressType = InferSelectModel<typeof courseProgressSchema>;
type MockTestResultType = InferSelectModel<typeof mockTestResultsSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  // password: string; // Password should not be exposed to the frontend
  role: 'user' | 'admin' | 'institution';
  adminRole?: string;
  profile: {
    phone: string;
    organization: string;
    designation: string;
    location: string;
    joinedDate: string;
    bio: string;
    photo: string | null;
    idDocument: string | null;
    verified: boolean;
    verifiedBy: string | null;
    verifiedDate: string | null;
  };
  enrollment: {
    status: 'active' | 'suspended' | 'expired' | 'admin';
    enrolledDate: string;
    expiryDate: string | null;
  };
  examStatus: 'not_attempted' | 'passed' | 'failed' | 'not_applicable';
  remainingAttempts: number;
  addonAttempts?: number;
  addonAttemptsPurchased?: number;
  courseProgress: {
    modules: Array<{
      moduleId: string;
      progress: number;
      status: string;
    }>;
    overallProgress: number;
  };
  mockTests: Array<{
    testId: string;
    score: number | null;
    completed: boolean | null;
    completedAt: string | null;
    answers: any | null;
  }>;
  credlyBadgeUrl: string | null;
  certificateNumber: string | null;
  certificateIssuedDate?: string | null;
  certificateExpiryDate?: string | null;
  certificateStatus?: string;
  expiryNotificationSent?: boolean;
  certificationTrack?: string | null;
  // Institution-specific fields
  institutionId?: string;
  institutionType?: string;
}

class AuthService {
  private rolesCache: any[] = [];

  // Hard-coded institutions for now - in production, this would come from a database
  private institutions = [
    {
      id: '1',
      name: 'IIT Delhi',
      type: 'university',
      email: 'contact@iitd.ac.in',
      phone: '+91 11 2659 1000',
      city: 'New Delhi',
      state: 'Delhi',
      adminEmail: 'admin@iitd.ac.in',
      adminPassword: 'iitd@123',
      enrolledStudents: 45
    },
    {
      id: '2',
      name: 'St. Xavier\'s College',
      type: 'college',
      email: 'info@xaviers.edu',
      phone: '+91 22 2269 8662',
      city: 'Mumbai',
      state: 'Maharashtra',
      adminEmail: 'admin@xaviers.edu',
      adminPassword: 'xavier@123',
      enrolledStudents: 32
    }
  ];

  async loadRoles() {
    try {
      this.rolesCache = await getAllRoles();
    } catch (error) {
      console.error('Error loading roles:', error);
      this.rolesCache = [];
    }
  }

  checkInstitutionLogin(email: string, password: string): User | null {
    const institution = this.institutions.find(
      inst => inst.adminEmail === email && inst.adminPassword === password
    );

    if (institution) {
      // Create a User object for the institution
      const institutionUser: User = {
        id: institution.id,
        name: institution.name,
        email: institution.adminEmail,
        role: 'institution',
        institutionId: institution.id,
        institutionType: institution.type,
        profile: {
          phone: institution.phone,
          organization: institution.name,
          designation: institution.type,
          location: `${institution.city}, ${institution.state}`,
          joinedDate: new Date().toISOString(),
          bio: '',
          photo: null,
          idDocument: null,
          verified: true,
          verifiedBy: 'System',
          verifiedDate: new Date().toISOString(),
        },
        enrollment: {
          status: 'admin',
          enrolledDate: new Date().toISOString(),
          expiryDate: null,
        },
        examStatus: 'not_applicable',
        remainingAttempts: 0,
        courseProgress: {
          modules: [],
          overallProgress: 0,
        },
        mockTests: [],
        credlyBadgeUrl: null,
        certificateNumber: null,
      };

      return institutionUser;
    }

    return null;
  }

  async checkUserExists(email: string | null, phone: string | null): Promise<{ exists: boolean; hasEmail?: boolean; hasPhone?: boolean; email?: string; phone?: string; primaryIdentifier?: 'email' | 'phone' | null }> {
    try {
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return { exists: false };
    }
  }

  async signup(userData: { name: string; email?: string | null; phone?: string | null; password: string; address: string }): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!data.success || !data.user) {
        throw new Error(data.message || 'Signup failed');
      }

      const dbUser = data.user;

      // Load course progress and mock test results
      const courseProgressResponse = await (await fetch(`/api/auth/user/${dbUser.id}/course-progress`)).json();
      const mockTestResultsResponse = await (await fetch(`/api/auth/user/${dbUser.id}/mock-tests`)).json();

      const courseProgress: CourseProgressType[] = courseProgressResponse.progress || [];
      const mockTestResults: MockTestResultType[] = mockTestResultsResponse.results || [];

      // Calculate overall progress
      let overallProgress = 0;
      if (courseProgress && courseProgress.length > 0) {
        overallProgress = courseProgress[0]?.overallProgress || 0;
      }

      // Build user object matching the expected format
      const user: User = {
        id: String(dbUser.id),
        name: dbUser.name,
        email: dbUser.email || '',
        role: dbUser.role as 'user' | 'admin',
        adminRole: dbUser.adminRole || undefined,
        certificationTrack: dbUser.certificationTrack || undefined,
        profile: dbUser.profile || {
          phone: dbUser.phone || '',
          organization: '',
          designation: '',
          location: dbUser.location || dbUser.address || '',
          joinedDate: '',
          bio: '',
          photo: null,
          idDocument: null,
          verified: false,
          verifiedBy: null,
          verifiedDate: null,
        },
        enrollment: dbUser.enrollment || {
          status: 'active',
          enrolledDate: '',
          expiryDate: '',
        },
        examStatus: dbUser.examStatus as 'not_attempted' | 'passed' | 'failed' | 'not_applicable',
        remainingAttempts: dbUser.remainingAttempts,
        courseProgress: {
          modules: courseProgress?.map(cp => ({
            moduleId: cp.moduleId,
            progress: cp.progress === null ? 0 : cp.progress,
            status: cp.status === null ? 'not_started' : cp.status,
          })) || [],
          overallProgress: overallProgress,
        },
        mockTests: mockTestResults?.map(mt => ({
          testId: String(mt.testId), // Ensure testId is always a string
          score: mt.score,
          completed: mt.completed === true || mt.completed === 1, // Handle both boolean and number (1/0)
          completedAt: mt.completedAt ? new Date(mt.completedAt).toISOString() : null,
          answers: mt.answers || null,
        })) || [],
        credlyBadgeUrl: dbUser.credlyBadgeUrl || null,
        certificateNumber: dbUser.certificateNumber || null,
      };

      // Store user session
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async login(email: string | null, phone: string | null, password: string): Promise<User | null> {
    try {
      // First, check if it's an institution login (only if email provided)
      if (email) {
        const institutionUser = this.checkInstitutionLogin(email, password);
        if (institutionUser) {
          localStorage.setItem('currentUser', JSON.stringify(institutionUser));
          return institutionUser;
        }
      }

      // If not institution, make a request to the backend for user/admin authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone, password }),
      });

      const data = await response.json();

      if (!data.success || !data.user) {
        return null;
      }

      const dbUser = data.user;

      // Load course progress and mock test results
      const courseProgressResponse = await (await fetch(`/api/auth/user/${dbUser.id}/course-progress`)).json();
      const mockTestResultsResponse = await (await fetch(`/api/auth/user/${dbUser.id}/mock-tests`)).json();

      const courseProgress: CourseProgressType[] = courseProgressResponse.progress || [];
      const mockTestResults: MockTestResultType[] = mockTestResultsResponse.results || [];

      // Calculate overall progress from course progress records
      let overallProgress = 0;
      if (courseProgress && courseProgress.length > 0) {
        // Use the overallProgress from the first record (they should all be the same)
        overallProgress = courseProgress[0]?.overallProgress || 0;
      }

      // Build user object matching the expected format
      const user: User = {
        id: String(dbUser.id),
        name: dbUser.name,
        email: dbUser.email,
        // password: dbUser.password, // Password is not returned from backend
        role: dbUser.role as 'user' | 'admin',
        adminRole: dbUser.adminRole || undefined,
        certificationTrack: dbUser.certificationTrack || undefined,
        profile: dbUser.profile || {
          phone: '',
          organization: '',
          designation: '',
          location: '',
          joinedDate: '',
          bio: '',
          photo: null,
          idDocument: null,
          verified: false,
          verifiedBy: null,
          verifiedDate: null,
        },
        enrollment: dbUser.enrollment || {
          status: 'active',
          enrolledDate: '',
          expiryDate: '',
        },
        examStatus: dbUser.examStatus as 'not_attempted' | 'passed' | 'failed' | 'not_applicable',
        remainingAttempts: dbUser.remainingAttempts,
        courseProgress: {
          modules: courseProgress?.map(cp => ({
            moduleId: cp.moduleId,
            progress: cp.progress === null ? 0 : cp.progress, // Handle null progress
            status: cp.status === null ? 'not_started' : cp.status, // Handle null status
          })) || [],
          overallProgress: overallProgress,
        },
        mockTests: mockTestResults?.map(mt => ({
          testId: mt.testId,
          score: mt.score,
          completed: mt.completed === null ? false : mt.completed, // Handle null completed
        })) || [],
        credlyBadgeUrl: dbUser.credlyBadgeUrl || null,
        certificateNumber: dbUser.certificateNumber || null,
      };

      // Store user session
      localStorage.setItem('currentUser', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  async refreshUserData(): Promise<User | null> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return null;

      // Check if it's an institution user (no need to refresh from DB)
      if (currentUser.role === 'institution') {
        return currentUser;
      }

      // Reload user data from database via API
      const response = await fetch(`/api/auth/user-by-email?email=${currentUser.email}`);
      const data = await response.json();

      if (!data.success || !data.user) {
        return null;
      }

      const dbUser = data.user;

      // Load fresh course progress and mock test results via API
      const courseProgressResponse = await (await fetch(`/api/auth/user/${dbUser.id}/course-progress`)).json();
      const mockTestResultsResponse = await (await fetch(`/api/auth/user/${dbUser.id}/mock-tests`)).json();

      const courseProgress: CourseProgressType[] = courseProgressResponse.progress || [];
      const mockTestResults: MockTestResultType[] = mockTestResultsResponse.results || [];

      // Calculate overall progress
      let overallProgress = 0;
      if (courseProgress && courseProgress.length > 0) {
        overallProgress = courseProgress[0]?.overallProgress || 0;
      }

      // Build updated user object
      const user: User = {
        id: String(dbUser.id),
        name: dbUser.name,
        email: dbUser.email,
        // password: dbUser.password, // Password is not returned from backend
        role: dbUser.role as 'user' | 'admin',
        adminRole: dbUser.adminRole || undefined,
        certificationTrack: dbUser.certificationTrack || undefined,
        profile: dbUser.profile || {
          phone: '',
          organization: '',
          designation: '',
          location: '',
          joinedDate: '',
          bio: '',
          photo: null,
          idDocument: null,
          verified: false,
          verifiedBy: null,
          verifiedDate: null,
        },
        enrollment: dbUser.enrollment || {
          status: 'active',
          enrolledDate: '',
          expiryDate: '',
        },
        examStatus: dbUser.examStatus as 'not_attempted' | 'passed' | 'failed' | 'not_applicable',
        remainingAttempts: dbUser.remainingAttempts,
        courseProgress: {
          modules: courseProgress?.map(cp => ({
            moduleId: cp.moduleId,
            progress: cp.progress === null ? 0 : cp.progress,
            status: cp.status === null ? 'not_started' : cp.status,
          })) || [],
          overallProgress: overallProgress,
        },
        mockTests: mockTestResults?.map(mt => ({
          testId: String(mt.testId), // Ensure testId is always a string
          score: mt.score,
          completed: mt.completed === true || mt.completed === 1, // Handle both boolean and number (1/0)
          completedAt: mt.completedAt ? new Date(mt.completedAt).toISOString() : null,
          answers: mt.answers || null,
        })) || [],
        credlyBadgeUrl: dbUser.credlyBadgeUrl || null,
        certificateNumber: dbUser.certificateNumber || null,
      };

      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get permissions for current user
  async getUserPermissions(user: User): Promise<string[]> {
    if (user.role !== 'admin') return [];
    if (!user.adminRole) return [];

    // Load roles if not cached
    if (this.rolesCache.length === 0) {
      await this.loadRoles();
    }

    const role = this.rolesCache.find(r => r.id === user.adminRole);
    return role?.permissions || [];
  }

  // Check if user has a specific permission
  async hasPermission(user: User, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(user);
    return permissions.includes(permission);
  }

  // Check if user has any of the specified permissions
  async hasAnyPermission(user: User, permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(user);
    return permissions.some(p => userPermissions.includes(p));
  }

  // Check if user has all specified permissions
  async hasAllPermissions(user: User, permissions: string[]): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(user);
    return permissions.every(p => userPermissions.includes(p));
  }

  // Synchronous versions for backward compatibility (uses cached data)
  getUserPermissionsSync(user: User): string[] {
    if (user.role !== 'admin') return [];
    if (!user.adminRole) return [];

    const role = this.rolesCache.find(r => r.id === user.adminRole);
    return role?.permissions || [];
  }

  hasPermissionSync(user: User, permission: string): boolean {
    const permissions = this.getUserPermissionsSync(user);
    return permissions.includes(permission);
  }
}

export const authService = new AuthService();

// Initialize roles cache on module load
authService.loadRoles();

export type { User };
