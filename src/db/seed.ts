import 'dotenv/config';
import { db } from './config';
import { users, roles, permissions, certificationTracks, modules, mockTests, courseProgress, mockTestResults } from './schema';
import usersData from '../data/users.json';
import rolesData from '../data/roles.json';
import curriculumData from '../data/curriculum.json';
import mockTestsData from '../data/mockTests.json';
import tracksData from '../data/certificationTracks.json';

async function seed() {
  try {
    // 1. Seed Permissions
    for (const permission of rolesData.permissions) {
      await db.insert(permissions).values({
        id: permission.id,
        name: permission.name,
        description: permission.description,
      }).onConflictDoUpdate({
        target: permissions.id,
        set: {
          name: permission.name,
          description: permission.description,
        },
      });
    }

    // 2. Seed Roles
    for (const role of rolesData.roles) {
      await db.insert(roles).values({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        systemRole: role.system_role,
      }).onConflictDoNothing();
    }

    // 3. Seed Certification Tracks
    for (const track of tracksData.tracks) {
      await db.insert(certificationTracks).values({
        id: track.id,
        name: track.name,
        description: track.description,
        color: track.color,
        icon: track.icon,
        duration: track.validity,
        price: track.price,
        passingScore: track.passingScore,
        modules: track.modules,
        competencies: track.competencies,
        targetAudience: track.targetAudience,
        prerequisites: track.prerequisites,
        active: track.active,
      }).onConflictDoNothing();
    }

    // 4. Seed Modules
    for (const module of curriculumData.modules) {
      await db.insert(modules).values({
        id: module.id,
        title: module.title,
        description: module.description,
        duration: module.duration,
        topics: module.topics,
        pdfUrl: module.pdfUrl,
      }).onConflictDoNothing();
    }

    // 5. Seed Mock Tests
    for (const test of mockTestsData.tests) {
      await db.insert(mockTests).values({
        id: test.id,
        title: test.title,
        duration: test.duration,
        totalQuestions: test.totalQuestions,
        passingScore: test.passingScore,
        questions: test.questions as any,
      }).onConflictDoNothing();
    }

    // 6. Seed Users
    for (const user of usersData.users) {
      const [insertedUser] = await db.insert(users).values({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        adminRole: user.adminRole,
        certificationTrack: user.certificationTrack,
        phone: user.profile.phone,
        organization: user.profile.organization,
        designation: user.profile.designation,
        location: user.profile.location,
        joinedDate: user.profile.joinedDate,
        bio: user.profile.bio,
        photo: user.profile.photo,
        idDocument: user.profile.idDocument,
        verified: user.profile.verified,
        verifiedBy: user.profile.verifiedBy,
        verifiedDate: user.profile.verifiedDate,
        enrollmentStatus: user.enrollment.status,
        enrolledDate: user.enrollment.enrolledDate,
        expiryDate: user.enrollment.expiryDate,
        examStatus: user.examStatus,
        remainingAttempts: user.remainingAttempts,
        credlyBadgeUrl: user.credlyBadgeUrl,
        certificateNumber: user.certificateNumber,
      }).returning();

      // Seed course progress for this user
      if (user.courseProgress?.modules && user.courseProgress.modules.length > 0) {
        for (const moduleProgress of user.courseProgress.modules) {
          await db.insert(courseProgress).values({
            userId: insertedUser.id,
            moduleId: moduleProgress.moduleId,
            progress: moduleProgress.progress,
            status: moduleProgress.status,
            overallProgress: user.courseProgress.overallProgress,
          }).onConflictDoNothing();
        }
      }

      // Seed mock test results for this user
      if (user.mockTests && user.mockTests.length > 0) {
        for (const test of user.mockTests) {
          await db.insert(mockTestResults).values({
            userId: insertedUser.id,
            testId: test.testId,
            score: test.score,
            completed: test.completed,
            completedAt: test.completed ? new Date() : null,
          }).onConflictDoNothing();
        }
      }
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed().catch(console.error);
