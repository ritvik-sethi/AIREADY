# **TECHNICAL ARCHITECTURE DIAGRAMS**
## **ET AI Ready Certification Platform**

---

## **Table of Contents**
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Database Schema Diagram](#2-database-schema-diagram)
3. [Component Architecture](#3-component-architecture)
4. [Authentication Flow](#4-authentication-flow)
5. [User Journey Flow](#5-user-journey-flow)
6. [Data Flow Diagrams](#6-data-flow-diagrams)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Integration Architecture](#8-integration-architecture)

---

## **1. SYSTEM ARCHITECTURE OVERVIEW**

### **1.1 High-Level Architecture**

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Web App    │  │  Admin App   │  │ Institution  │           │
│  │ (React/Vite) │  │   (React)    │  │    Portal    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│         │                  │                  │                   │
└─────────┼──────────────────┼──────────────────┼───────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                   ┌─────────▼─────────┐
                   │   React Router    │
                   │  (Client-Side)    │
                   └─────────┬─────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                     APPLICATION LAYER                              │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ authService  │  │   database   │  │ leadService  │            │
│  │              │  │   service    │  │              │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│         │                  │                  │                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   payment    │  │    email     │  │   storage    │            │
│  │   Service    │  │   Service    │  │   Service    │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                    │
└────────────────────────────┬───────────────────────────────────────┘
                             │
                   ┌─────────▼─────────┐
                   │   Drizzle ORM     │
                   │  (Type-Safe ORM)  │
                   └─────────┬─────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                      DATABASE LAYER                                │
│                                                                    │
│              ┌────────────────────────────────┐                   │
│              │  Neon PostgreSQL (Serverless)  │                   │
│              │                                 │                   │
│              │  ┌──────┐ ┌──────┐ ┌──────┐   │                   │
│              │  │users │ │tests │ │leads │   │                   │
│              │  └──────┘ └──────┘ └──────┘   │                   │
│              │  ┌──────┐ ┌──────┐ ┌──────┐   │                   │
│              │  │roles │ │tracks│ │modules   │                   │
│              │  └──────┘ └──────┘ └──────┘   │                   │
│              └────────────────────────────────┘                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                   EXTERNAL INTEGRATIONS                            │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Razorpay   │  │   Talview    │  │    Credly    │            │
│  │  (Payments)  │  │ (Proctoring) │  │   (Badges)   │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  SendGrid/   │  │     CDN      │  │  Cloud       │            │
│  │     SES      │  │  (Videos)    │  │  Storage     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## **2. DATABASE SCHEMA DIAGRAM**

### **2.1 Entity Relationship Diagram**

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USERS TABLE                                 │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id (serial)                                                     │
│     name, email, password                                           │
│     role (user | admin | institution)                               │
│ FK  adminRole → roles.id                                            │
│ FK  certificationTrack → certificationTracks.id                     │
│     phone, organization, designation, location                      │
│     joinedDate, bio, photo, idDocument                              │
│     verified, verifiedBy, verifiedDate                              │
│     enrollmentStatus, enrolledDate, expiryDate                      │
│     examStatus, remainingAttempts, addonAttempts                    │
│     credlyBadgeUrl, certificateNumber                               │
│     certificateIssuedDate, certificateExpiryDate                    │
│     createdAt, updatedAt                                            │
└─────────────────────────────────────────────────────────────────────┘
          │                       │
          │ 1:N                   │ 1:N
          ▼                       ▼
┌──────────────────────┐   ┌──────────────────────┐
│  COURSE_PROGRESS     │   │  MOCK_TEST_RESULTS   │
├──────────────────────┤   ├──────────────────────┤
│ PK  id (serial)      │   │ PK  id (serial)      │
│ FK  userId           │   │ FK  userId           │
│     moduleId         │   │     testId           │
│     progress (0-100) │   │     score            │
│     status           │   │     completed        │
│     overallProgress  │   │     completedAt      │
│     createdAt        │   │     answers (JSON)   │
│     updatedAt        │   │     createdAt        │
└──────────────────────┘   └──────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         ROLES TABLE                                 │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id (varchar)                                                    │
│     name, description                                               │
│     permissions (JSON array) → [permission_ids]                     │
│     systemRole (boolean)                                            │
│     createdAt, updatedAt                                            │
└─────────────────────────────────────────────────────────────────────┘
          │ M:N (via JSON array)
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PERMISSIONS TABLE                              │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id (varchar)                                                    │
│     name, description                                               │
│     createdAt                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  CERTIFICATION_TRACKS TABLE                         │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id (varchar)                                                    │
│     name, description                                               │
│     color, icon                                                     │
│     duration, price, passingScore                                   │
│     modules (JSON array) → [module_ids]                             │
│     competencies (JSON array)                                       │
│     targetAudience, prerequisites                                   │
│     active (boolean)                                                │
│     createdAt, updatedAt                                            │
└─────────────────────────────────────────────────────────────────────┘
          │ M:N (via JSON array)
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       MODULES TABLE                                 │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id (varchar)                                                    │
│     title, description                                              │
│     duration, difficulty                                            │
│     topics (JSON array)                                             │
│     videoUrl, pdfUrl                                                │
│     createdAt, updatedAt                                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      MOCK_TESTS TABLE                               │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id (varchar)                                                    │
│     title, description                                              │
│     duration (minutes), totalQuestions                              │
│     passingScore                                                    │
│     questions (JSON array)                                          │
│     createdAt, updatedAt                                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        LEADS TABLE                                  │
├─────────────────────────────────────────────────────────────────────┤
│ PK  id (serial)                                                     │
│     type (university | school | organization)                       │
│     name, email, phone, organization                                │
│     address, additionalInfo                                         │
│     status (new | contacted | qualified | negotiation |            │
│             converted | lost)                                       │
│     assignedTo, notes (JSON array)                                  │
│     estimatedValue, followUpDate                                    │
│     createdAt, updatedAt                                            │
└─────────────────────────────────────────────────────────────────────┘
```

### **2.2 Table Relationships**

```
users (1) ───── (N) courseProgress
users (1) ───── (N) mockTestResults
users (N) ───── (1) roles (via adminRole)
users (N) ───── (1) certificationTracks (via certificationTrack)

certificationTracks (N) ───── (N) modules (via JSON array)
roles (N) ───── (N) permissions (via JSON array)
```

---

## **3. COMPONENT ARCHITECTURE**

### **3.1 React Component Tree**

```
App (Root)
│
├── BrowserRouter
│   │
│   ├── AuthContext.Provider
│   │
│   └── Routes
│       │
│       ├── "/" → LandingPage
│       │   ├── Navigation
│       │   ├── HeroSection
│       │   ├── TrustedBySection
│       │   ├── WhyAISection
│       │   ├── CategoriesSection
│       │   ├── BenefitsSection
│       │   ├── ProcessSection
│       │   ├── CurriculumSection
│       │   ├── TestimonialsSection
│       │   ├── FAQSection
│       │   └── Footer
│       │
│       ├── "/login" → LoginPage
│       │   └── Login
│       │       ├── EmailInput
│       │       ├── PasswordInput
│       │       └── LoginButton
│       │
│       ├── "/register" → RegisterPage
│       │   └── RegistrationForm
│       │       ├── TypeSelection
│       │       ├── FormStep
│       │       ├── CourseSelection
│       │       ├── PaymentIntegration
│       │       └── SuccessScreen
│       │
│       ├── "/dashboard" → DashboardPage (Protected)
│       │   ├── ErrorBoundary
│       │   └── Dashboard
│       │       ├── Header
│       │       ├── WelcomeSection
│       │       ├── CertificationTrackCard
│       │       ├── ProgressOverview
│       │       ├── ModulesList
│       │       │   └── ModuleCard (x9)
│       │       ├── MockTestsList
│       │       │   └── TestCard
│       │       ├── ExamSection
│       │       └── CertificateSection
│       │
│       ├── "/admin" → AdminPage (Protected, Admin Only)
│       │   ├── ErrorBoundary
│       │   └── AdminDashboard
│       │       ├── Header
│       │       ├── TabNavigation
│       │       ├── OverviewTab
│       │       │   ├── StatsCards
│       │       │   └── ChartsSection
│       │       ├── UsersTab
│       │       │   ├── SearchBar
│       │       │   ├── UsersList
│       │       │   └── UserDetailsModal
│       │       ├── ProgramsTab
│       │       │   └── CertificationProgramsManager
│       │       ├── InstitutionsTab
│       │       │   └── InstitutionsManager
│       │       ├── LeadsTab
│       │       │   └── LeadsManager
│       │       ├── BulkTab
│       │       │   └── BulkOperations
│       │       ├── RolesTab
│       │       │   └── RoleManagement
│       │       └── SettingsTab
│       │           └── SettingsConfiguration
│       │
│       ├── "/institution" → InstitutionPage (Protected, Institution Only)
│       │   ├── ErrorBoundary
│       │   └── InstitutionDashboard
│       │       ├── Header
│       │       ├── StudentsList
│       │       ├── ProgressTracking
│       │       └── CertificateManagement
│       │
│       └── "/mock-test" → MockTestPage
│           └── MockTestInterface
│               ├── QuestionDisplay
│               ├── OptionsList
│               ├── Timer
│               ├── NavigationButtons
│               └── ResultsScreen
│
└── Shared Components
    ├── UserProfile (Modal)
    ├── CourseEditor (Admin)
    ├── TestEditor (Admin)
    ├── ErrorBoundary (Wrapper)
    └── LoadingSpinner
```

---

## **4. AUTHENTICATION FLOW**

### **4.1 User Login Flow**

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Enter credentials
     ▼
┌──────────────────┐
│  Login Component │
└────┬─────────────┘
     │
     │ 2. Call authService.login(email, password)
     ▼
┌──────────────────────────┐
│  authService             │
│  ┌────────────────────┐  │
│  │ 1. Check if         │  │
│  │    institution login│  │
│  └────────┬───────────┘  │
│           │ No            │
│           ▼               │
│  ┌────────────────────┐  │
│  │ 2. Call database   │  │
│  │    .authenticateUser│ │
│  └────────┬───────────┘  │
└───────────┼──────────────┘
            │
            ▼
┌────────────────────────────┐
│  database.ts               │
│  ┌──────────────────────┐  │
│  │ 1. getUserByEmail    │  │
│  │ 2. Compare password  │  │
│  └────────┬─────────────┘  │
└───────────┼────────────────┘
            │
            ▼
┌────────────────────────────┐
│  Neon PostgreSQL           │
│  SELECT * FROM users       │
│  WHERE email = ?           │
└────────┬───────────────────┘
         │
         │ Return user data
         ▼
┌────────────────────────────┐
│  authService               │
│  ┌──────────────────────┐  │
│  │ 1. Load course       │  │
│  │    progress          │  │
│  │ 2. Load mock test    │  │
│  │    results           │  │
│  │ 3. Build User object │  │
│  │ 4. Save to           │  │
│  │    localStorage      │  │
│  └────────┬─────────────┘  │
└───────────┼────────────────┘
            │
            │ Return User object
            ▼
┌────────────────────────────┐
│  Login Component           │
│  ┌──────────────────────┐  │
│  │ 1. Update state      │  │
│  │ 2. Navigate based on │  │
│  │    user role:        │  │
│  │    - user → /dashboard│ │
│  │    - admin → /admin  │  │
│  │    - inst. → /inst.  │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```

---

## **5. USER JOURNEY FLOW**

### **5.1 Individual Professional Journey**

```
START
  │
  ├─→ Landing Page
  │      │
  │      ├─→ Browse Tracks
  │      │
  │      └─→ Click "Get Certified"
  │             │
  ├─→ Registration
  │      │
  │      ├─→ Select "Individual"
  │      ├─→ Fill Form
  │      ├─→ Select Track
  │      ├─→ Payment (Razorpay)
  │      │      │
  │      │      ├─→ Success → Account Created
  │      │      └─→ Failure → Retry
  │      │
  ├─→ Login
  │      │
  │      └─→ Credentials → Authenticate
  │                │
  ├─→ Dashboard
  │      │
  │      ├─→ View Enrolled Track
  │      │
  │      ├─→ Course Learning (Loop)
  │      │      │
  │      │      ├─→ Select Module
  │      │      ├─→ Watch Video
  │      │      ├─→ Download PDF
  │      │      ├─→ Mark Complete
  │      │      └─→ Progress Updated
  │      │             │
  │      │             └─→ All Modules Done? → Yes
  │      │
  │      ├─→ Mock Tests (Loop)
  │      │      │
  │      │      ├─→ Start Test
  │      │      ├─→ Answer Questions
  │      │      ├─→ Submit
  │      │      ├─→ View Results
  │      │      └─→ Review Answers
  │      │             │
  │      │             └─→ Ready for Exam? → Yes
  │      │
  │      ├─→ Schedule Exam
  │      │      │
  │      │      └─→ Talview Integration
  │      │
  │      ├─→ Take Exam
  │      │      │
  │      │      ├─→ Proctoring Active
  │      │      ├─→ Answer Questions
  │      │      └─→ Submit
  │      │             │
  │      │             ├─→ Pass? → Yes
  │      │             │      │
  │      │             │      └─→ Certificate Issued
  │      │             │             │
  │      │             │             ├─→ Download PDF
  │      │             │             ├─→ Credly Badge
  │      │             │             └─→ Share on LinkedIn
  │      │             │
  │      │             └─→ Fail → Retry (if attempts remain)
  │      │                    │
  │      │                    └─→ No attempts? → Purchase Addon
  │      │
  │      └─→ Certificate Maintenance
  │             │
  │             ├─→ Monitor Expiry
  │             └─→ Renew Before Expiry
  │
END (Certified Professional)
```

### **5.2 Institution Partnership Journey**

```
START
  │
  ├─→ Landing Page
  │      │
  │      └─→ Click "Get Certified"
  │             │
  ├─→ Registration
  │      │
  │      ├─→ Select "University/School"
  │      ├─→ Fill Institution Details
  │      └─→ Submit Inquiry → Lead Created
  │             │
  ├─→ Admin Reviews Lead
  │      │
  │      ├─→ Status: New
  │      ├─→ Status: Contacted (Call/Email)
  │      ├─→ Status: Qualified (Interested)
  │      ├─→ Status: Negotiation (Proposal)
  │      └─→ Status: Converted (Contract Signed)
  │             │
  ├─→ Institution Account Created
  │      │
  │      └─→ Credentials Sent
  │             │
  ├─→ Institution Login
  │      │
  ├─→ Institution Dashboard
  │      │
  │      ├─→ Bulk Enroll Students
  │      │      │
  │      │      └─→ Upload CSV → Accounts Created
  │      │
  │      ├─→ Track Student Progress
  │      │      │
  │      │      └─→ View Reports
  │      │
  │      └─→ Manage Certificates
  │             │
  │             └─→ Download/Verify
  │
END (Partnered Institution)
```

---

## **6. DATA FLOW DIAGRAMS**

### **6.1 Course Progress Update Flow**

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       │ 1. Clicks "Mark as Completed"
       ▼
┌──────────────────────────┐
│  Dashboard Component     │
│  handleMarkAsCompleted() │
└──────┬───────────────────┘
       │
       │ 2. Calculate new progress
       │    - Update module: 100%
       │    - Calculate overall: (completed/total) * 100
       ▼
┌──────────────────────────────┐
│  database.updateCourseProgress│
│  (userId, moduleId, data)     │
└──────┬───────────────────────┘
       │
       │ 3. Check if record exists
       ▼
┌──────────────────────────┐
│  Neon PostgreSQL         │
│  SELECT * FROM           │
│  course_progress         │
│  WHERE userId=? AND      │
│  moduleId=?              │
└──────┬───────────────────┘
       │
       ├─→ Exists? → UPDATE
       │              SET progress=100, status='completed'
       │
       └─→ Not Exists? → INSERT
                         VALUES (userId, moduleId, 100, 'completed')
       │
       ▼
┌──────────────────────────┐
│  Return updated record   │
└──────┬───────────────────┘
       │
       │ 4. Refresh user data
       ▼
┌──────────────────────────────┐
│  authService.refreshUserData()│
└──────┬───────────────────────┘
       │
       │ 5. Update localStorage
       ▼
┌──────────────────────────┐
│  Dashboard re-renders    │
│  with new progress       │
└──────────────────────────┘
```

### **6.2 Mock Test Submission Flow**

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       │ 1. Completes test & clicks "Submit"
       ▼
┌──────────────────────────────┐
│  MockTestInterface Component │
│  handleSubmit()               │
└──────┬───────────────────────┘
       │
       │ 2. Calculate score
       │    - Compare answers to correctAnswer
       │    - Score = (correct/total) * 100
       ▼
┌──────────────────────────────┐
│  database.saveMockTestResult │
│  (userId, testId, score,     │
│   completed, answers)         │
└──────┬───────────────────────┘
       │
       │ 3. Check for existing result
       ▼
┌──────────────────────────┐
│  Neon PostgreSQL         │
│  SELECT * FROM           │
│  mock_test_results       │
│  WHERE userId=? AND      │
│  testId=?                │
└──────┬───────────────────┘
       │
       ├─→ Exists? → UPDATE
       │              SET score=?, completed=true, answers=?
       │
       └─→ Not Exists? → INSERT
                         VALUES (userId, testId, score, true, answers)
       │
       ▼
┌──────────────────────────┐
│  Return result record    │
└──────┬───────────────────┘
       │
       │ 4. Update UI
       ▼
┌──────────────────────────────┐
│  Show Results Screen         │
│  - Score percentage          │
│  - Pass/Fail status          │
│  - Answer review             │
└──────────────────────────────┘
```

### **6.3 Lead Creation Flow**

```
┌──────────────┐
│   Visitor    │
└──────┬───────┘
       │
       │ 1. Fills institution inquiry form
       ▼
┌──────────────────────────────┐
│  RegistrationForm Component  │
│  handleSubmit()              │
└──────┬───────────────────────┘
       │
       │ 2. Validate form data
       ▼
┌──────────────────────────────┐
│  leadService.createLead()    │
│  (leadData)                  │
└──────┬───────────────────────┘
       │
       │ 3. Insert into database
       ▼
┌──────────────────────────────┐
│  database.createLead()       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────┐
│  Neon PostgreSQL         │
│  INSERT INTO leads       │
│  VALUES (...)            │
│  RETURNING *             │
└──────┬───────────────────┘
       │
       │ 4. Return lead record
       ▼
┌──────────────────────────────┐
│  Success Screen              │
│  - Thank you message         │
│  - Admin will contact        │
└──────────────────────────────┘
       │
       │ 5. Admin notification (planned)
       ▼
┌──────────────────────────────┐
│  Email/Slack to Sales Team   │
└──────────────────────────────┘
```

---

## **7. DEPLOYMENT ARCHITECTURE**

### **7.1 Production Deployment**

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Browser  │  │ Browser  │  │ Mobile   │  │  Tablet  │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                      │
                      │ HTTPS
                      ▼
┌──────────────────────────────────────────────────────────────────┐
│                      VERCEL EDGE NETWORK                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Global CDN (Cached Static Assets)                         │  │
│  │  - HTML, CSS, JS bundles                                   │  │
│  │  - Images, fonts                                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Serverless Functions (React SSR - Optional)               │  │
│  │  - Auto-scaling                                            │  │
│  │  - 0ms cold start                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                      │
                      │ Client-Side Database Calls
                      ▼
┌──────────────────────────────────────────────────────────────────┐
│                  NEON SERVERLESS POSTGRESQL                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Connection Pooling                                        │  │
│  │  - Automatic scaling                                       │  │
│  │  - WebSocket support                                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Database Cluster                                          │  │
│  │  - Primary (Read/Write)                                    │  │
│  │  - Replicas (Read-only, planned)                           │  │
│  │  - Auto-backups (Daily)                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                      │
                      │ External API Calls
                      ▼
┌──────────────────────────────────────────────────────────────────┐
│              THIRD-PARTY SERVICES                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  Razorpay    │  │  Talview     │  │  Credly      │            │
│  │  Payment API │  │  Proctoring  │  │  Badges API  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  SendGrid    │  │  Cloudflare  │  │  AWS S3      │            │
│  │  Email API   │  │  CDN/Video   │  │  Storage     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

### **7.2 CI/CD Pipeline**

```
┌──────────────┐
│  Developer   │
│  Pushes Code │
└──────┬───────┘
       │
       │ git push origin main
       ▼
┌──────────────────────────┐
│  GitHub Repository       │
└──────┬───────────────────┘
       │
       │ Webhook trigger
       ▼
┌──────────────────────────────────┐
│  Vercel Build System             │
│  ┌────────────────────────────┐  │
│  │ 1. npm install             │  │
│  │ 2. npm run typecheck       │  │
│  │ 3. npm run build           │  │
│  │    (vite build → dist/)    │  │
│  └────────────────────────────┘  │
└──────┬───────────────────────────┘
       │
       ├─→ Success? → Deploy
       │              │
       │              ▼
       │   ┌──────────────────────┐
       │   │ Vercel Edge Network  │
       │   │ - Update static files│
       │   │ - Invalidate cache   │
       │   │ - Update routes      │
       │   └──────────────────────┘
       │              │
       │              ▼
       │   ┌──────────────────────┐
       │   │ Deployment Success   │
       │   │ - Preview URL        │
       │   │ - Production URL     │
       │   └──────────────────────┘
       │
       └─→ Failure? → Notification
                      │
                      ▼
           ┌──────────────────────┐
           │ Email/Slack Alert    │
           │ - Build logs         │
           │ - Error details      │
           └──────────────────────┘
```

---

## **8. INTEGRATION ARCHITECTURE**

### **8.1 Payment Flow (Razorpay)**

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       │ 1. Select course & click "Pay"
       ▼
┌──────────────────────────────┐
│  Frontend (React)            │
│  paymentService.createOrder()│
└──────┬───────────────────────┘
       │
       │ 2. Create order
       ▼
┌──────────────────────────────┐
│  Razorpay API                │
│  POST /orders                │
│  {                           │
│    amount: 1500000,          │
│    currency: "INR"           │
│  }                           │
└──────┬───────────────────────┘
       │
       │ 3. Return order_id
       ▼
┌──────────────────────────────┐
│  Frontend                    │
│  Open Razorpay Checkout      │
└──────┬───────────────────────┘
       │
       │ 4. User enters payment details
       ▼
┌──────────────────────────────┐
│  Razorpay Payment Gateway    │
│  - Card/UPI/Netbanking       │
│  - 2FA verification          │
└──────┬───────────────────────┘
       │
       ├─→ Success
       │     │
       │     ▼
       │  ┌────────────────────────┐
       │  │ Frontend               │
       │  │ paymentService.verify()│
       │  └────────┬───────────────┘
       │           │
       │           │ 5. Verify payment_id
       │           ▼
       │  ┌────────────────────────┐
       │  │ Razorpay API           │
       │  │ GET /payments/{id}     │
       │  └────────┬───────────────┘
       │           │
       │           │ 6. Payment verified
       │           ▼
       │  ┌────────────────────────┐
       │  │ Create User Account    │
       │  │ Grant Access           │
       │  └────────────────────────┘
       │
       └─→ Failure
             │
             ▼
          ┌────────────────────────┐
          │ Show error message     │
          │ Retry option           │
          └────────────────────────┘
```

### **8.2 Proctoring Flow (Talview)**

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       │ 1. Schedule exam
       ▼
┌──────────────────────────────┐
│  Frontend                    │
│  Call Talview API            │
└──────┬───────────────────────┘
       │
       │ 2. Create exam session
       ▼
┌──────────────────────────────┐
│  Talview API                 │
│  POST /sessions              │
│  {                           │
│    userId, examId, duration  │
│  }                           │
└──────┬───────────────────────┘
       │
       │ 3. Return session URL
       ▼
┌──────────────────────────────┐
│  Frontend                    │
│  Redirect to Talview         │
└──────┬───────────────────────┘
       │
       │ 4. User on Talview platform
       ▼
┌──────────────────────────────┐
│  Talview Proctoring          │
│  - Identity verification     │
│  - Browser lockdown          │
│  - AI monitoring             │
│  - Test interface            │
└──────┬───────────────────────┘
       │
       │ 5. User completes exam
       ▼
┌──────────────────────────────┐
│  Talview processes results   │
└──────┬───────────────────────┘
       │
       │ 6. Webhook callback
       ▼
┌──────────────────────────────┐
│  Backend Webhook Handler     │
│  POST /api/webhooks/talview  │
│  {                           │
│    userId, score, status     │
│  }                           │
└──────┬───────────────────────┘
       │
       │ 7. Update user record
       ▼
┌──────────────────────────────┐
│  Database                    │
│  UPDATE users                │
│  SET examStatus='passed',   │
│      score=85                │
└──────┬───────────────────────┘
       │
       │ 8. Trigger certificate issuance
       ▼
┌──────────────────────────────┐
│  Certificate Service         │
│  - Generate PDF              │
│  - Create Credly badge       │
│  - Send email                │
└──────────────────────────────┘
```

### **8.3 Digital Badge Flow (Credly)**

```
┌──────────────────────────────┐
│  User passes exam            │
└──────┬───────────────────────┘
       │
       │ 1. Trigger certificate issuance
       ▼
┌──────────────────────────────┐
│  Backend Service             │
│  generateCertificate()       │
└──────┬───────────────────────┘
       │
       │ 2. Call Credly API
       ▼
┌──────────────────────────────┐
│  Credly API                  │
│  POST /badges                │
│  {                           │
│    recipient_email,          │
│    badge_template_id,        │
│    issued_at,                │
│    expires_at                │
│  }                           │
└──────┬───────────────────────┘
       │
       │ 3. Return badge data
       ▼
┌──────────────────────────────┐
│  Backend Service             │
│  - Save credlyBadgeUrl       │
│  - Save certificateNumber    │
│  - Update user record        │
└──────┬───────────────────────┘
       │
       │ 4. Send email to user
       ▼
┌──────────────────────────────┐
│  Email Service (SendGrid)    │
│  - Certificate PDF attached  │
│  - Credly badge link         │
│  - LinkedIn share link       │
└──────────────────────────────┘
       │
       │ 5. User receives email
       ▼
┌──────────────────────────────┐
│  User                        │
│  - Downloads PDF             │
│  - Accepts Credly badge      │
│  - Shares on LinkedIn        │
└──────────────────────────────┘
```

---

## **9. SECURITY ARCHITECTURE**

### **9.1 Security Layers**

```
┌─────────────────────────────────────────────────────────────────┐
│                     NETWORK LAYER                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ - HTTPS/TLS 1.3 encryption                                 │  │
│  │ - Vercel Edge Network (DDoS protection)                    │  │
│  │ - Rate limiting (planned)                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ - Role-Based Access Control (RBAC)                         │  │
│  │ - Permission validation                                    │  │
│  │ - Session management (localStorage)                        │  │
│  │ - Input validation (client & server)                       │  │
│  │ - XSS protection (React escaping)                          │  │
│  │ - CSRF tokens (planned)                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                                │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ - SQL injection prevention (Drizzle ORM)                   │  │
│  │ - Parameterized queries                                    │  │
│  │ - Password hashing (bcrypt - planned)                      │  │
│  │ - Encrypted connections (SSL)                              │  │
│  │ - Automated backups                                        │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ - Sensitive data encryption (planned)                      │  │
│  │ - PII protection (GDPR/DPDP compliance)                    │  │
│  │ - Audit logging                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## **10. MONITORING & OBSERVABILITY**

### **10.1 Monitoring Stack (Planned)**

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Error Tracking: Sentry                                     │  │
│  │ - JavaScript errors                                        │  │
│  │ - React component errors                                   │  │
│  │ - Network request failures                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Analytics: Google Analytics / Mixpanel                     │  │
│  │ - User behavior tracking                                   │  │
│  │ - Conversion funnels                                       │  │
│  │ - Page views, sessions                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Vercel Analytics                                           │  │
│  │ - Build times                                              │  │
│  │ - Deployment success rate                                  │  │
│  │ - Edge function performance                                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Neon Monitoring                                            │  │
│  │ - Query performance                                        │  │
│  │ - Connection pool usage                                    │  │
│  │ - Database size                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        ALERTING                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ PagerDuty / Opsgenie                                       │  │
│  │ - Critical error alerts                                    │  │
│  │ - Downtime notifications                                   │  │
│  │ - Performance degradation                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

**END OF ARCHITECTURE DIAGRAMS DOCUMENT**
