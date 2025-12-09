import { db } from './config';
import { sql } from 'drizzle-orm';

async function createLeadsTable() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        address TEXT,
        additional_info TEXT,
        status VARCHAR(50) DEFAULT 'new',
        assigned_to VARCHAR(255),
        notes JSONB DEFAULT '[]'::jsonb,
        estimated_value INTEGER,
        follow_up_date VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create index on email for faster searches
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)
    `);

    // Create index on status for faster filtering
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)
    `);

    // Create index on created_at for sorting
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC)
    `);

    process.exit(0);
  } catch (error) {
    console.error('Error creating leads table:', error);
    process.exit(1);
  }
}

createLeadsTable();
