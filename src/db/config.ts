import * as schema from './schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

type AnyDrizzleDb = PostgresJsDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;

// Get database URL from environment variable
// In Vite (browser), use import.meta.env
// In Node.js (tsx/seed scripts), use process.env
const databaseUrl = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_DATABASE_URL
  : process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

// Check if running in Node.js environment (server-side)
const isNodeEnv = typeof process !== 'undefined' && process.versions && process.versions.node;

// Only throw error in Node.js environments (server-side scripts)
// In browser, we'll handle it lazily when db is actually used
if (!databaseUrl && isNodeEnv) {
  console.error('❌ DATABASE_URL or VITE_DATABASE_URL is not set in environment variables');
  console.error('Available env vars:', {
    hasImportMeta: typeof import.meta !== 'undefined',
    hasViteEnv: typeof import.meta !== 'undefined' && import.meta.env ? 'yes' : 'no',
    viteEnvKeys: typeof import.meta !== 'undefined' && import.meta.env
      ? Object.keys(import.meta.env)
      : [],
  });
  throw new Error('DATABASE_URL or VITE_DATABASE_URL is not set in environment variables. Please set VITE_DATABASE_URL in your deployment platform.');
}

let db: AnyDrizzleDb | null = null;

// Lazy initialization function
async function initializeDb(): Promise<AnyDrizzleDb> {
  if (db) {
    return db;
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL or VITE_DATABASE_URL is not set in environment variables. Please set VITE_DATABASE_URL in your deployment platform.');
  }

  // Check if running in a Node.js environment (where `process` is defined)
  if (isNodeEnv) {
    // Node.js environment - always use pg driver for better reliability
    // pg driver works with both localhost and remote Neon databases
    const { Client } = await import('pg');
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const client = new Client({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
    });
    await client.connect();
    db = drizzle(client, { schema });
  } else {
    // Browser environment - use Neon HTTP driver
    const { neon } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-http');
    const sql = neon(databaseUrl);
    db = drizzle(sql, { schema });
  }

  return db;
}

// Initialize immediately if databaseUrl is available and we're in Node.js
// Otherwise, initialize lazily when db is accessed
if (databaseUrl && isNodeEnv) {
  initializeDb().catch((error) => {
    console.error('Failed to initialize database:', error);
  });
}

// Export a getter that initializes lazily
export const getDb = async (): Promise<AnyDrizzleDb> => {
  return initializeDb();
};

// For backward compatibility, export db directly
// In browser, this will be null until getDb() is called
// In Node.js, this will be initialized if databaseUrl is available
export { db };
