import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

async function resetDatabase() {
  const client = new Client(connectionString);
  await client.connect();

  try {
    const tableNames = [
      'users',
      'course_progress',
      'mock_test_results',
      'roles',
      'permissions',
      'certification_tracks',
      'modules',
      'mock_tests',
      'leads',
    ];

    for (const tableName of tableNames) {
      await client.query(`TRUNCATE TABLE \"${tableName}\" RESTART IDENTITY CASCADE;`);
    }
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

resetDatabase();
