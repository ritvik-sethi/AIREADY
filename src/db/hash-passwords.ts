import { Client } from 'pg';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

async function hashPlainTextPasswords() {
  const client = new Client({
    connectionString,
    ssl: connectionString?.includes('neon.tech') || connectionString?.includes('supabase') 
      ? { rejectUnauthorized: false } 
      : false,
  });
  
  await client.connect();

  try {
    // Get all users
    const result = await client.query(`
      SELECT id, email, password 
      FROM users
    `);

    for (const user of result.rows) {
      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      const isHashed = user.password && (
        user.password.startsWith('$2a$') ||
        user.password.startsWith('$2b$') ||
        user.password.startsWith('$2y$')
      );

      if (!isHashed && user.password) {
        // Hash the plain text password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        await client.query(
          `UPDATE users 
           SET password = $1, updated_at = NOW() 
           WHERE id = $2`,
          [hashedPassword, user.id]
        );
      }
    }
  } catch (error) {
    console.error('❌ Error hashing passwords:', error);
    throw error;
  } finally {
    await client.end();
  }
}

hashPlainTextPasswords();

