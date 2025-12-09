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

async function addUpdatedAtColumn() {
  const client = await pool.connect();

  try {
    // Check if column already exists
    const checkColumn = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='mock_test_results'
      AND column_name='updated_at';
    `);

    if (checkColumn.rows.length === 0) {
      // Add the updated_at column
      await client.query(`
        ALTER TABLE mock_test_results
        ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
      `);
    }
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addUpdatedAtColumn();

