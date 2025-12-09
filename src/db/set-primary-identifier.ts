import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

async function setPrimaryIdentifierForExistingUsers() {
  const client = new Client({
    connectionString,
    ssl: connectionString?.includes('neon.tech') || connectionString?.includes('supabase') 
      ? { rejectUnauthorized: false } 
      : false,
  });
  
  await client.connect();

  try {
    // Get all users who don't have primaryIdentifier set
    const result = await client.query(`
      SELECT id, email, phone, primary_identifier 
      FROM users 
      WHERE primary_identifier IS NULL
    `);

    for (const user of result.rows) {
      let primaryIdentifier: string | null = null;

      // Priority: email first, then phone
      if (user.email && user.email.trim() !== '') {
        primaryIdentifier = 'email';
      } else if (user.phone && user.phone.trim() !== '') {
        primaryIdentifier = 'phone';
      }

      if (primaryIdentifier) {
        await client.query(
          `UPDATE users 
           SET primary_identifier = $1, updated_at = NOW() 
           WHERE id = $2`,
          [primaryIdentifier, user.id]
        );
      }
    }
  } catch (error) {
    console.error('❌ Error setting primary identifier:', error);
    throw error;
  } finally {
    await client.end();
  }
}

setPrimaryIdentifierForExistingUsers();

