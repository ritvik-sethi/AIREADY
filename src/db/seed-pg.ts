import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from 'dotenv';
import usersData from '../data/users.json' assert { type: 'json' };
import rolesData from '../data/roles.json' assert { type: 'json' };
import curriculumData from '../data/curriculum.json' assert { type: 'json' };
import mockTestsData from '../data/mockTests.json' assert { type: 'json' };
import tracksData from '../data/certificationTracks.json' assert { type: 'json' };

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  const client = await pool.connect();

  try {
    // 1. Seed Permissions
    for (const permission of rolesData.permissions) {
      await client.query(
        `INSERT INTO permissions (id, name, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [permission.id, permission.name, permission.description]
      );
    }

    // 2. Seed Roles
    for (const role of rolesData.roles) {
      await client.query(
        `INSERT INTO roles (id, name, description, permissions, system_role)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [role.id, role.name, role.description, JSON.stringify(role.permissions), role.system_role]
      );
    }

    // 3. Seed Certification Tracks
    for (const track of tracksData.tracks) {
      await client.query(
        `INSERT INTO certification_tracks (id, name, description, color, icon, duration, price, passing_score, modules, competencies, target_audience, prerequisites, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO NOTHING`,
        [
          track.id,
          track.name,
          track.description,
          track.color,
          track.icon,
          track.duration,
          track.price,
          track.passingScore,
          JSON.stringify(track.modules),
          JSON.stringify(track.competencies),
          track.targetAudience,
          track.prerequisites,
          track.active,
        ]
      );
    }

    // 4. Seed Modules
    for (const module of curriculumData.modules) {
      await client.query(
        `INSERT INTO modules (id, title, description, duration, difficulty, topics, video_url, pdf_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [
          module.id,
          module.title,
          module.description,
          module.duration,
          module.difficulty,
          JSON.stringify(module.topics),
          module.videoUrl,
          module.pdfUrl,
        ]
      );
    }

    // 5. Seed Mock Tests
    for (const test of mockTestsData.tests) {
      await client.query(
        `INSERT INTO mock_tests (id, title, description, duration, total_questions, passing_score, questions)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [
          test.id,
          test.title,
          test.description,
          test.duration,
          test.totalQuestions,
          test.passingScore,
          JSON.stringify(test.questions),
        ]
      );
    }

    // 6. Seed Users
    for (const user of usersData.users) {
      const result = await client.query(
        `INSERT INTO users (name, email, password, role, admin_role, certification_track, phone, organization, designation, location, joined_date, bio, photo, id_document, verified, verified_by, verified_date, enrollment_status, enrolled_date, expiry_date, exam_status, remaining_attempts, credly_badge_url, certificate_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [
          user.name,
          user.email,
          user.password,
          user.role,
          user.adminRole,
          user.certificationTrack,
          user.profile.phone,
          user.profile.organization,
          user.profile.designation,
          user.profile.location,
          user.profile.joinedDate,
          user.profile.bio,
          user.profile.photo,
          user.profile.idDocument,
          user.profile.verified,
          user.profile.verifiedBy,
          user.profile.verifiedDate,
          user.enrollment.status,
          user.enrollment.enrolledDate,
          user.enrollment.expiryDate,
          user.examStatus,
          user.remainingAttempts,
          user.credlyBadgeUrl,
          user.certificateNumber,
        ]
      );

      if (result.rows.length > 0) {
        const userId = result.rows[0].id;

        // Seed course progress for this user
        if (user.courseProgress?.modules && user.courseProgress.modules.length > 0) {
          for (const moduleProgress of user.courseProgress.modules) {
            await client.query(
              `INSERT INTO course_progress (user_id, module_id, progress, status, overall_progress)
               VALUES ($1, $2, $3, $4, $5)`,
              [
                userId,
                moduleProgress.moduleId,
                moduleProgress.progress,
                moduleProgress.status,
                user.courseProgress.overallProgress,
              ]
            );
          }
        }

        // Seed mock test results for this user
        if (user.mockTests && user.mockTests.length > 0) {
          for (const test of user.mockTests) {
            await client.query(
              `INSERT INTO mock_test_results (user_id, test_id, score, completed, completed_at)
               VALUES ($1, $2, $3, $4, $5)`,
              [userId, test.testId, test.score, test.completed, test.completed ? new Date() : null]
            );
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
