import { db } from './src/db/config';
import { users } from './src/db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  try {
    // Get all users
    const allUsers = await db.select().from(users);
    
    if (allUsers.length === 0) {
      return;
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
    console.error('\nMake sure:');
    console.error('1. DATABASE_URL is set in .env file');
    console.error('2. Database is accessible');
    console.error('3. Tables exist (run: npm run db:push)');
  }
  
  process.exit(0);
}

checkDatabase();

