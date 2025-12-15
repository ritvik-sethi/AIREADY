import * as dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

async function addSsoidColumn() {
  const databaseUrl = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL or VITE_DATABASE_URL is not set');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Add ssoid column
    console.log('Adding ssoid column...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS ssoid VARCHAR(255);
    `);
    console.log('✅ Added ssoid column');

    // Create unique index
    console.log('Creating unique index...');
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_ssoid_unique 
      ON users(ssoid) 
      WHERE ssoid IS NOT NULL;
    `);
    console.log('✅ Created unique index');

    // Create regular index
    console.log('Creating index...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_ssoid 
      ON users(ssoid);
    `);
    console.log('✅ Created index');

    console.log('✅ Migration completed successfully!');
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addSsoidColumn();

