import { pgTable, text, varchar, integer, boolean, timestamp, json, serial } from 'drizzle-orm/pg-core';

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }), // Made optional - at least email or phone required
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'), // 'user' or 'admin'
  adminRole: varchar('admin_role', { length: 100 }), // role ID for admins
  certificationTrack: varchar('certification_track', { length: 100 }), // track ID

  // Profile
  phone: varchar('phone', { length: 50 }), // At least email or phone required
  primaryIdentifier: varchar('primary_identifier', { length: 10 }), // 'email' or 'phone' - set on first login
  address: text('address'), // Added address field
  organization: varchar('organization', { length: 255 }),
  designation: varchar('designation', { length: 255 }),
  location: varchar('location', { length: 255 }),
  joinedDate: varchar('joined_date', { length: 50 }),
  bio: text('bio'),
  photo: text('photo'),
  idDocument: text('id_document'),
  verified: boolean('verified').default(false),
  verifiedBy: varchar('verified_by', { length: 255 }),
  verifiedDate: varchar('verified_date', { length: 50 }),

  // Enrollment
  enrollmentStatus: varchar('enrollment_status', { length: 50 }).default('active'),
  enrolledDate: varchar('enrolled_date', { length: 50 }),
  expiryDate: varchar('expiry_date', { length: 50 }),

  // Exam
  examStatus: varchar('exam_status', { length: 50 }).default('not_attempted'),
  remainingAttempts: integer('remaining_attempts').default(3),
  addonAttempts: integer('addon_attempts').default(0),
  addonAttemptsPurchased: integer('addon_attempts_purchased').default(0),

  // Certification
  credlyBadgeUrl: text('credly_badge_url'),
  certificateNumber: varchar('certificate_number', { length: 100 }),
  certificateIssuedDate: varchar('certificate_issued_date', { length: 50 }),
  certificateExpiryDate: varchar('certificate_expiry_date', { length: 50 }),
  certificateStatus: varchar('certificate_status', { length: 50 }).default('active'), // active, expiring_soon, expired
  expiryNotificationSent: boolean('expiry_notification_sent').default(false),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Course Progress Table
export const courseProgress = pgTable('course_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  moduleId: varchar('module_id', { length: 100 }).notNull(),
  progress: integer('progress').default(0),
  status: varchar('status', { length: 50 }).default('not_started'),
  overallProgress: integer('overall_progress').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Mock Tests Results Table
export const mockTestResults = pgTable('mock_test_results', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  testId: varchar('test_id', { length: 100 }).notNull(),
  score: integer('score'),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  answers: json('answers'), // Store user's answers
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Roles Table
export const roles = pgTable('roles', {
  id: varchar('id', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  permissions: json('permissions').$type<string[]>().notNull(), // Array of permission IDs
  systemRole: boolean('system_role').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Permissions Table
export const permissions = pgTable('permissions', {
  id: varchar('id', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Certification Tracks Table
export const certificationTracks = pgTable('certification_tracks', {
  id: varchar('id', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 50 }),
  icon: varchar('icon', { length: 50 }),
  duration: varchar('duration', { length: 50 }),
  price: integer('price'),
  passingScore: integer('passing_score'),
  modules: json('modules').$type<string[]>(), // Array of module IDs
  competencies: json('competencies').$type<string[]>(),
  targetAudience: text('target_audience'),
  prerequisites: text('prerequisites'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Curriculum Modules Table
export const modules = pgTable('modules', {
  id: varchar('id', { length: 100 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  duration: varchar('duration', { length: 50 }),
  difficulty: varchar('difficulty', { length: 50 }),
  topics: json('topics').$type<string[]>(),
  videoUrl: text('video_url'),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Mock Tests Table
export const mockTests = pgTable('mock_tests', {
  id: varchar('id', { length: 100 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  duration: integer('duration'), // in minutes
  totalQuestions: integer('total_questions'),
  passingScore: integer('passing_score'),
  questions: json('questions'), // Array of question objects
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Leads Table
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // 'university', 'school', 'organization'
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  organization: varchar('organization', { length: 255 }).notNull(),
  address: text('address'),
  additionalInfo: text('additional_info'),
  status: varchar('status', { length: 50 }).default('new'), // 'new', 'contacted', 'qualified', 'negotiation', 'converted', 'lost'
  assignedTo: varchar('assigned_to', { length: 255 }),
  notes: json('notes').$type<string[]>().default([]),
  estimatedValue: integer('estimated_value'),
  followUpDate: varchar('follow_up_date', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
