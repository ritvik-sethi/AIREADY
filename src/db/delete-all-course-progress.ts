import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1') 
    ? false 
    : {
        rejectUnauthorized: false
      }
});

async function deleteAllCourseProgress() {
  const client = await pool.connect();

  try {
    // Delete all records from course_progress table
    await client.query(`
      DELETE FROM course_progress;
    `);
  } catch (error) {
    console.error('❌ Error during deletion:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

deleteAllCourseProgress()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

