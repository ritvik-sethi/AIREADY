# **API SPECIFICATIONS**
## **ET AI Ready Certification Platform**

---

## **Table of Contents**
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [User Management APIs](#user-management-apis)
4. [Course Progress APIs](#course-progress-apis)
5. [Assessment APIs](#assessment-apis)
6. [Certification APIs](#certification-apis)
7. [Lead Management APIs](#lead-management-apis)
8. [Admin APIs](#admin-apis)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

---

## **1. OVERVIEW**

### **1.1 Base URL**
```
Development: http://localhost:5174
Production: https://ai-ready.vercel.app
```

### **1.2 Architecture**
- **Type**: RESTful API (Internal services)
- **Data Format**: JSON
- **Database**: PostgreSQL via Drizzle ORM
- **Client**: Direct database access via Neon serverless driver

### **1.3 Service Files**
- `src/services/authService.ts` - Authentication and user management
- `src/services/database.ts` - Core database operations
- `src/services/leadService.ts` - Lead management
- `src/services/paymentService.ts` - Payment processing (planned)

---

## **2. AUTHENTICATION**

### **2.1 Login**

#### **authService.login()**
```typescript
async login(email: string, password: string): Promise<User | null>
```

**Purpose**: Authenticate user and retrieve user data

**Parameters**:
- `email` (string, required): User email address
- `password` (string, required): User password (plaintext in dev, hashed in prod)

**Returns**:
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'institution';
  adminRole?: string;
  certificationTrack?: string;
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
    completed: boolean;
  }>;
  credlyBadgeUrl: string | null;
  certificateNumber: string | null;
}
```

**Example Usage**:
```typescript
const user = await authService.login('user@example.com', 'password123');
if (user) {
  console.log('Login successful:', user.name);
}
```

**Error Handling**:
- Returns `null` if credentials are invalid
- Throws error if database connection fails

---

### **2.2 Logout**

#### **authService.logout()**
```typescript
logout(): void
```

**Purpose**: Clear user session from localStorage

**Parameters**: None

**Returns**: void

**Example Usage**:
```typescript
authService.logout();
```

---

### **2.3 Get Current User**

#### **authService.getCurrentUser()**
```typescript
getCurrentUser(): User | null
```

**Purpose**: Retrieve currently logged-in user from localStorage

**Parameters**: None

**Returns**: User object or null

**Example Usage**:
```typescript
const currentUser = authService.getCurrentUser();
if (currentUser) {
  console.log('Current user:', currentUser.name);
}
```

---

### **2.4 Refresh User Data**

#### **authService.refreshUserData()**
```typescript
async refreshUserData(): Promise<User | null>
```

**Purpose**: Reload user data from database and update localStorage

**Parameters**: None

**Returns**: Updated User object or null

**Example Usage**:
```typescript
const refreshedUser = await authService.refreshUserData();
```

---

### **2.5 Check Permissions**

#### **authService.getUserPermissions()**
```typescript
async getUserPermissions(user: User): Promise<string[]>
```

**Purpose**: Get list of permissions for admin user

**Parameters**:
- `user` (User, required): User object

**Returns**: Array of permission IDs

**Example Usage**:
```typescript
const permissions = await authService.getUserPermissions(adminUser);
// Returns: ['manage_users', 'view_reports', 'manage_content']
```

---

#### **authService.hasPermission()**
```typescript
async hasPermission(user: User, permission: string): Promise<boolean>
```

**Purpose**: Check if user has specific permission

**Parameters**:
- `user` (User, required): User object
- `permission` (string, required): Permission ID to check

**Returns**: Boolean

**Example Usage**:
```typescript
const canManageUsers = await authService.hasPermission(adminUser, 'manage_users');
if (canManageUsers) {
  // Show user management UI
}
```

---

## **3. USER MANAGEMENT APIs**

### **3.1 Get All Users**

#### **database.getAllUsers()**
```typescript
async getAllUsers(): Promise<User[]>
```

**Purpose**: Retrieve all registered users

**Parameters**: None

**Returns**: Array of User objects

**Example Usage**:
```typescript
const allUsers = await getAllUsers();
console.log(`Total users: ${allUsers.length}`);
```

---

### **3.2 Get User by Email**

#### **database.getUserByEmail()**
```typescript
async getUserByEmail(email: string): Promise<User | null>
```

**Purpose**: Find user by email address

**Parameters**:
- `email` (string, required): User email

**Returns**: User object or null

**Example Usage**:
```typescript
const user = await getUserByEmail('john@example.com');
```

---

### **3.3 Get User by ID**

#### **database.getUserById()**
```typescript
async getUserById(userId: number): Promise<User | null>
```

**Purpose**: Find user by numeric ID

**Parameters**:
- `userId` (number, required): User ID

**Returns**: User object or null

**Example Usage**:
```typescript
const user = await getUserById(123);
```

---

### **3.4 Create User**

#### **database.createUser()**
```typescript
async createUser(userData: {
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
}): Promise<User>
```

**Purpose**: Create new user account

**Parameters**:
- `userData` (object, required): User details

**Required Fields**:
- `name`, `email`, `password`, `role`

**Optional Fields**:
- `adminRole`, `certificationTrack`, `phone`, `organization`, `designation`, `location`, `joinedDate`, `bio`, `photo`, `enrollmentStatus`, `enrolledDate`, `expiryDate`

**Returns**: Created User object

**Example Usage**:
```typescript
const newUser = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword',
  role: 'user',
  certificationTrack: 'ai-technical',
  organization: 'Tech Corp',
  phone: '+91 98765 43210'
});
```

---

### **3.5 Update User**

#### **database.updateUser()**
```typescript
async updateUser(userId: number, updates: Partial<UserUpdateData>): Promise<User>
```

**Purpose**: Update user information

**Parameters**:
- `userId` (number, required): User ID
- `updates` (object, required): Fields to update

**Updatable Fields**:
```typescript
{
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  adminRole?: string | null;
  certificationTrack?: string | null;
  phone?: string | null;
  organization?: string | null;
  designation?: string | null;
  location?: string | null;
  bio?: string | null;
  photo?: string | null;
  idDocument?: string | null;
  verified?: boolean;
  verifiedBy?: string | null;
  verifiedDate?: string | null;
  enrollmentStatus?: string;
  enrolledDate?: string | null;
  expiryDate?: string | null;
  examStatus?: string;
  remainingAttempts?: number;
  addonAttempts?: number;
  addonAttemptsPurchased?: number;
  credlyBadgeUrl?: string | null;
  certificateNumber?: string | null;
  certificateIssuedDate?: string | null;
  certificateExpiryDate?: string | null;
  certificateStatus?: string | null;
  expiryNotificationSent?: boolean;
}
```

**Returns**: Updated User object

**Example Usage**:
```typescript
const updatedUser = await updateUser(123, {
  examStatus: 'passed',
  certificateNumber: 'ET-AI-2025-12345',
  certificateIssuedDate: '2025-01-06'
});
```

---

### **3.6 Delete User**

#### **database.deleteUser()**
```typescript
async deleteUser(userId: number): Promise<boolean>
```

**Purpose**: Permanently delete user and related records

**Parameters**:
- `userId` (number, required): User ID

**Returns**: Boolean (success)

**Cascading Deletes**:
- Course progress records
- Mock test results
- (User record itself)

**Example Usage**:
```typescript
const success = await deleteUser(123);
if (success) {
  console.log('User deleted successfully');
}
```

---

## **4. COURSE PROGRESS APIs**

### **4.1 Get User Course Progress**

#### **database.getUserCourseProgress()**
```typescript
async getUserCourseProgress(userId: number): Promise<CourseProgress[]>
```

**Purpose**: Retrieve all module progress for a user

**Parameters**:
- `userId` (number, required): User ID

**Returns**: Array of progress records
```typescript
[
  {
    id: number;
    userId: number;
    moduleId: string;
    progress: number; // 0-100
    status: string; // 'not_started' | 'in_progress' | 'completed'
    overallProgress: number; // 0-100
    createdAt: Date;
    updatedAt: Date;
  }
]
```

**Example Usage**:
```typescript
const progress = await getUserCourseProgress(123);
console.log(`Overall progress: ${progress[0]?.overallProgress}%`);
```

---

### **4.2 Update Course Progress**

#### **database.updateCourseProgress()**
```typescript
async updateCourseProgress(
  userId: number,
  moduleId: string,
  progressData: {
    progress: number;
    status: string;
    overallProgress: number;
  }
): Promise<CourseProgress>
```

**Purpose**: Update or create module progress record

**Parameters**:
- `userId` (number, required): User ID
- `moduleId` (string, required): Module identifier
- `progressData` (object, required):
  - `progress` (number): Module completion (0-100)
  - `status` (string): 'not_started' | 'in_progress' | 'completed'
  - `overallProgress` (number): Overall course progress (0-100)

**Returns**: Updated/created CourseProgress object

**Example Usage**:
```typescript
const updated = await updateCourseProgress(123, 'module-1', {
  progress: 100,
  status: 'completed',
  overallProgress: 11 // 1 out of 9 modules = ~11%
});
```

---

## **5. ASSESSMENT APIs**

### **5.1 Get All Mock Tests**

#### **database.getAllMockTests()**
```typescript
async getAllMockTests(): Promise<MockTest[]>
```

**Purpose**: Retrieve all available mock tests

**Parameters**: None

**Returns**: Array of MockTest objects
```typescript
[
  {
    id: string;
    title: string;
    description: string;
    duration: number; // minutes
    totalQuestions: number;
    passingScore: number;
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }
]
```

**Example Usage**:
```typescript
const mockTests = await getAllMockTests();
console.log(`Available tests: ${mockTests.length}`);
```

---

### **5.2 Get Mock Test by ID**

#### **database.getMockTestById()**
```typescript
async getMockTestById(testId: string): Promise<MockTest | null>
```

**Purpose**: Retrieve specific mock test

**Parameters**:
- `testId` (string, required): Test identifier

**Returns**: MockTest object or null

**Example Usage**:
```typescript
const test = await getMockTestById('mock-test-1');
if (test) {
  console.log(`Test: ${test.title}, Questions: ${test.totalQuestions}`);
}
```

---

### **5.3 Get User Mock Test Results**

#### **database.getUserMockTestResults()**
```typescript
async getUserMockTestResults(userId: number): Promise<MockTestResult[]>
```

**Purpose**: Get all test attempts for a user

**Parameters**:
- `userId` (number, required): User ID

**Returns**: Array of test results
```typescript
[
  {
    id: number;
    userId: number;
    testId: string;
    score: number | null;
    completed: boolean;
    completedAt: Date | null;
    answers: any; // JSON of user's answers
    createdAt: Date;
  }
]
```

**Example Usage**:
```typescript
const results = await getUserMockTestResults(123);
const completedTests = results.filter(r => r.completed);
console.log(`Completed ${completedTests.length} tests`);
```

---

### **5.4 Save Mock Test Result**

#### **database.saveMockTestResult()**
```typescript
async saveMockTestResult(
  userId: number,
  testId: string,
  score: number,
  completed: boolean,
  answers?: any
): Promise<MockTestResult>
```

**Purpose**: Save or update test result

**Parameters**:
- `userId` (number, required): User ID
- `testId` (string, required): Test identifier
- `score` (number, required): Score percentage (0-100)
- `completed` (boolean, required): Whether test was fully completed
- `answers` (any, optional): JSON object with user's answers

**Returns**: Saved MockTestResult object

**Example Usage**:
```typescript
const result = await saveMockTestResult(
  123,
  'mock-test-1',
  85,
  true,
  [0, 2, 1, 3, 0] // answer indices
);
console.log(`Score saved: ${result.score}%`);
```

---

## **6. CERTIFICATION APIs**

### **6.1 Get All Certification Tracks**

#### **database.getAllCertificationTracks()**
```typescript
async getAllCertificationTracks(): Promise<CertificationTrack[]>
```

**Purpose**: Retrieve all active certification tracks

**Parameters**: None

**Returns**: Array of CertificationTrack objects
```typescript
[
  {
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
    duration: string;
    price: number;
    passingScore: number;
    modules: string[]; // Array of module IDs
    competencies: string[]; // Array of competency descriptions
    targetAudience: string;
    prerequisites: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
]
```

**Example Usage**:
```typescript
const tracks = await getAllCertificationTracks();
const technicalTrack = tracks.find(t => t.id === 'ai-technical');
console.log(`Price: ₹${technicalTrack.price}`);
```

---

### **6.2 Get Certification Track by ID**

#### **database.getCertificationTrackById()**
```typescript
async getCertificationTrackById(trackId: string): Promise<CertificationTrack | null>
```

**Purpose**: Get specific certification track details

**Parameters**:
- `trackId` (string, required): Track identifier

**Returns**: CertificationTrack object or null

**Example Usage**:
```typescript
const track = await getCertificationTrackById('ai-leader');
```

---

## **7. LEAD MANAGEMENT APIs**

### **7.1 Get All Leads**

#### **leadService.getAllLeads()**
```typescript
async getAllLeads(): Promise<Lead[]>
```

**Purpose**: Retrieve all leads in system

**Parameters**: None

**Returns**: Array of Lead objects
```typescript
[
  {
    id: string;
    type: 'university' | 'school' | 'organization';
    name: string;
    email: string;
    phone: string;
    organization: string;
    address: string;
    additionalInfo: string;
    status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'converted' | 'lost';
    createdDate: string;
    lastUpdated: string;
    assignedTo?: string;
    notes: string[];
    estimatedValue?: number;
    followUpDate?: string;
  }
]
```

**Example Usage**:
```typescript
const leads = await leadService.getAllLeads();
const newLeads = leads.filter(l => l.status === 'new');
console.log(`${newLeads.length} new leads to follow up`);
```

---

### **7.2 Get Lead by ID**

#### **leadService.getLeadById()**
```typescript
async getLeadById(id: string): Promise<Lead | null>
```

**Purpose**: Get specific lead details

**Parameters**:
- `id` (string, required): Lead ID

**Returns**: Lead object or null

**Example Usage**:
```typescript
const lead = await leadService.getLeadById('123');
```

---

### **7.3 Create Lead**

#### **leadService.createLead()**
```typescript
async createLead(leadData: {
  type: 'university' | 'school' | 'organization';
  name: string;
  email: string;
  phone: string;
  organization: string;
  address?: string;
  additionalInfo?: string;
  status?: string;
  assignedTo?: string;
  estimatedValue?: number;
  followUpDate?: string;
}): Promise<Lead | null>
```

**Purpose**: Create new lead from registration

**Parameters**:
- `leadData` (object, required): Lead information

**Required Fields**:
- `type`, `name`, `email`, `phone`, `organization`

**Returns**: Created Lead object or null

**Example Usage**:
```typescript
const lead = await leadService.createLead({
  type: 'university',
  name: 'Dr. Sarah Johnson',
  email: 'sarah@university.edu',
  phone: '+91 98765 43210',
  organization: 'State University',
  address: '123 Campus Road, City',
  estimatedValue: 2000000,
  followUpDate: '2025-01-15'
});
```

---

### **7.4 Update Lead Status**

#### **leadService.updateLeadStatus()**
```typescript
async updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  updatedBy: string
): Promise<boolean>
```

**Purpose**: Update lead pipeline status

**Parameters**:
- `leadId` (string, required): Lead ID
- `status` (LeadStatus, required): New status
- `updatedBy` (string, required): Admin name

**Valid Statuses**:
- 'new', 'contacted', 'qualified', 'negotiation', 'converted', 'lost'

**Returns**: Boolean (success)

**Example Usage**:
```typescript
const success = await leadService.updateLeadStatus(
  '123',
  'contacted',
  'Admin Name'
);
```

---

### **7.5 Add Lead Note**

#### **leadService.addNote()**
```typescript
async addNote(
  leadId: string,
  note: string,
  createdBy: string
): Promise<boolean>
```

**Purpose**: Add activity note to lead

**Parameters**:
- `leadId` (string, required): Lead ID
- `note` (string, required): Note content
- `createdBy` (string, required): Admin name

**Returns**: Boolean (success)

**Example Usage**:
```typescript
await leadService.addNote(
  '123',
  'Follow-up call scheduled for next week',
  'Admin Name'
);
```

---

### **7.6 Get Lead Statistics**

#### **leadService.getLeadStats()**
```typescript
async getLeadStats(): Promise<{
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  negotiation: number;
  converted: number;
  lost: number;
  byType: {
    university: number;
    school: number;
    organization: number;
  };
}>
```

**Purpose**: Get lead pipeline metrics

**Parameters**: None

**Returns**: Statistics object

**Example Usage**:
```typescript
const stats = await leadService.getLeadStats();
console.log(`Conversion rate: ${(stats.converted / stats.total * 100).toFixed(1)}%`);
```

---

### **7.7 Search Leads**

#### **leadService.searchLeads()**
```typescript
async searchLeads(query: string): Promise<Lead[]>
```

**Purpose**: Search leads by name, email, organization, or phone

**Parameters**:
- `query` (string, required): Search term

**Returns**: Array of matching Lead objects

**Example Usage**:
```typescript
const results = await leadService.searchLeads('university');
```

---

## **8. ADMIN APIs**

### **8.1 Get All Roles**

#### **database.getAllRoles()**
```typescript
async getAllRoles(): Promise<Role[]>
```

**Purpose**: Get all admin role definitions

**Parameters**: None

**Returns**: Array of Role objects
```typescript
[
  {
    id: string;
    name: string;
    description: string;
    permissions: string[]; // Array of permission IDs
    systemRole: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
]
```

**Example Usage**:
```typescript
const roles = await getAllRoles();
const customRoles = roles.filter(r => !r.systemRole);
```

---

### **8.2 Get All Permissions**

#### **database.getAllPermissions()**
```typescript
async getAllPermissions(): Promise<Permission[]>
```

**Purpose**: Get all available permissions

**Parameters**: None

**Returns**: Array of Permission objects
```typescript
[
  {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
  }
]
```

**Example Usage**:
```typescript
const permissions = await getAllPermissions();
```

---

### **8.3 Get All Modules**

#### **database.getAllModules()**
```typescript
async getAllModules(): Promise<Module[]>
```

**Purpose**: Get all curriculum modules

**Parameters**: None

**Returns**: Array of Module objects
```typescript
[
  {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: string;
    topics: string[];
    videoUrl: string;
    pdfUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }
]
```

**Example Usage**:
```typescript
const modules = await getAllModules();
console.log(`Total modules: ${modules.length}`);
```

---

## **9. ERROR HANDLING**

### **9.1 Error Types**

All database operations can throw the following errors:

#### **Database Connection Error**
```typescript
{
  message: "Error connecting to database",
  code: "DB_CONNECTION_ERROR"
}
```

#### **Authentication Error**
```typescript
{
  message: "Invalid credentials",
  code: "AUTH_ERROR"
}
```

#### **Not Found Error**
```typescript
{
  message: "Record not found",
  code: "NOT_FOUND"
}
```

#### **Validation Error**
```typescript
{
  message: "Invalid data provided",
  code: "VALIDATION_ERROR",
  fields: string[]
}
```

#### **Permission Error**
```typescript
{
  message: "Insufficient permissions",
  code: "PERMISSION_DENIED"
}
```

### **9.2 Error Handling Pattern**

```typescript
try {
  const user = await createUser(userData);
  console.log('User created:', user.id);
} catch (error) {
  console.error('Error creating user:', error);

  if (error.code === 'VALIDATION_ERROR') {
    alert(`Invalid fields: ${error.fields.join(', ')}`);
  } else {
    alert('An error occurred. Please try again.');
  }
}
```

---

## **10. RATE LIMITING**

### **10.1 Current Implementation**
- No rate limiting in development
- All operations are direct database calls

### **10.2 Planned for Production**
- API Gateway rate limiting: 100 requests/minute per user
- Login attempts: 5 per 15 minutes per IP
- Test submission: 1 per test session
- Lead creation: 10 per hour per IP

---

## **11. DATA VALIDATION**

### **11.1 Email Validation**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error('Invalid email format');
}
```

### **11.2 Phone Validation**
```typescript
const phoneRegex = /^\+?\d{10,15}$/;
if (!phoneRegex.test(phone)) {
  throw new Error('Invalid phone number');
}
```

### **11.3 Password Requirements** (Production)
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

---

## **12. WEBHOOKS (Planned)**

### **12.1 Payment Webhook**
```
POST /api/webhooks/payment
```

**Purpose**: Receive payment confirmation from Razorpay

**Headers**:
- `X-Razorpay-Signature`: HMAC signature

**Payload**:
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxxxx",
        "amount": 1500000,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_xxxxx",
        "email": "user@example.com"
      }
    }
  }
}
```

---

### **12.2 Certificate Webhook** (Planned)
```
POST /api/webhooks/certificate
```

**Purpose**: Receive certificate issuance confirmation from Credly

---

## **13. BEST PRACTICES**

### **13.1 Error Handling**
```typescript
// ✅ Good
try {
  const result = await database.operation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw error; // Re-throw for caller to handle
}

// ❌ Bad
const result = await database.operation(); // No error handling
```

### **13.2 Null Checks**
```typescript
// ✅ Good
const user = await getUserById(123);
if (!user) {
  throw new Error('User not found');
}
console.log(user.name);

// ❌ Bad
const user = await getUserById(123);
console.log(user.name); // May throw if user is null
```

### **13.3 Type Safety**
```typescript
// ✅ Good
const userId: number = parseInt(userIdString);
const result = await updateUser(userId, updates);

// ❌ Bad
const result = await updateUser(userIdString as any, updates);
```

---

## **14. TESTING ENDPOINTS**

### **14.1 Test User Creation**
```typescript
// Create test user
const testUser = await createUser({
  name: 'Test User',
  email: 'test@example.com',
  password: 'test123',
  role: 'user',
  certificationTrack: 'ai-technical',
  organization: 'Test Org',
  phone: '+91 98765 43210'
});

console.log('Test user created:', testUser.id);
```

### **14.2 Test Login**
```typescript
// Test login
const user = await authService.login('test@example.com', 'test123');
if (user) {
  console.log('Login successful');
} else {
  console.log('Login failed');
}
```

### **14.3 Test Progress Update**
```typescript
// Test progress update
await updateCourseProgress(testUser.id, 'module-1', {
  progress: 50,
  status: 'in_progress',
  overallProgress: 6
});

const progress = await getUserCourseProgress(testUser.id);
console.log('Progress updated:', progress);
```

---

## **15. MIGRATION TO REST API (Future)**

### **15.1 Planned Endpoints**

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

GET    /api/progress/:userId
PUT    /api/progress/:userId/:moduleId

GET    /api/tests
GET    /api/tests/:id
POST   /api/tests/:id/submit

GET    /api/tracks
GET    /api/tracks/:id

GET    /api/leads
POST   /api/leads
PUT    /api/leads/:id
```

---

**END OF API SPECIFICATIONS**
