import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.VITE_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function quickSeed() {
  const client = await pool.connect();

  try {
    // Insert admin user
    await client.query(`
      INSERT INTO users (
        name, email, password, role, admin_role,
        phone, organization, designation, location, joined_date, bio,
        photo, verified, verified_by, verified_date,
        enrollment_status, enrolled_date, exam_status, remaining_attempts
      ) VALUES (
        'Admin User', 'admin@etaiready.com', 'admin123', 'admin', 'super_admin',
        '+91 99999 00000', 'Economic Times', 'System Administrator', 'Delhi, India', '2024-01-01',
        'Platform administrator managing AI Ready certification program.',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        true, 'system', '2024-01-01',
        'admin', '2024-01-01', 'not_applicable', 0
      )
      ON CONFLICT (email) DO NOTHING
    `);

    // Insert test user - John
    await client.query(`
      INSERT INTO users (
        name, email, password, role,
        phone, organization, designation, location, joined_date, bio,
        photo, verified,
        enrollment_status, enrolled_date, expiry_date, exam_status, remaining_attempts,
        certification_track
      ) VALUES (
        'John Doe', 'john@example.com', 'password123', 'user',
        '+91 98765 43210', 'Tech Solutions Pvt Ltd', 'Software Developer', 'Mumbai, India', '2025-01-15',
        'Passionate about AI and Machine Learning.',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        false,
        'active', '2025-01-15', '2026-01-15', 'not_attempted', 2,
        'ai-technical'
      )
      ON CONFLICT (email) DO NOTHING
    `);

    // Insert test user - Jane
    await client.query(`
      INSERT INTO users (
        name, email, password, role,
        phone, organization, designation, location, joined_date, bio,
        photo, verified, verified_by, verified_date, id_document,
        enrollment_status, enrolled_date, expiry_date, exam_status, remaining_attempts,
        certification_track, credly_badge_url, certificate_number
      ) VALUES (
        'Jane Smith', 'jane@example.com', 'password123', 'user',
        '+91 87654 32109', 'Innovation Labs', 'Data Scientist', 'Bangalore, India', '2024-11-20',
        'Data scientist with 5 years of experience.',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        true, 'admin@etaiready.com', '2024-11-21', 'https://example.com/documents/jane-id.pdf',
        'active', '2024-11-20', '2027-11-20', 'passed', 2,
        'ai-leader', 'https://www.credly.com/badges/ai-ready-cert', 'AIRC-2025-001234'
      )
      ON CONFLICT (email) DO NOTHING
    `);
  } catch (error) {
    console.error('❌ Error seeding:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

quickSeed();
