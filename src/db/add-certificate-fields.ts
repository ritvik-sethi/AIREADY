import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.VITE_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function addCertificateFields() {
  const client = await pool.connect();

  try {
    // Add addon attempts fields
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS addon_attempts INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS addon_attempts_purchased INTEGER DEFAULT 0;
    `);

    // Add certificate validity fields
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS certificate_issued_date VARCHAR(50),
      ADD COLUMN IF NOT EXISTS certificate_expiry_date VARCHAR(50),
      ADD COLUMN IF NOT EXISTS certificate_status VARCHAR(50) DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS expiry_notification_sent BOOLEAN DEFAULT FALSE;
    `);

    // Update default remaining_attempts to 3 for new users
    await client.query(`
      ALTER TABLE users
      ALTER COLUMN remaining_attempts SET DEFAULT 3;
    `);

    // Update certification_tracks table to add new pricing fields
    await client.query(`
      ALTER TABLE certification_tracks
      ADD COLUMN IF NOT EXISTS addon_attempts_price INTEGER,
      ADD COLUMN IF NOT EXISTS re_exam_price INTEGER;
    `);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addCertificateFields();
