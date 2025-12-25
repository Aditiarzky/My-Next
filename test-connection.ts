import { user } from '@/drizzle/schema';
import { db } from './src/lib/db';

async function testConnection() {
  try {
    const result = await db.select().from(user).limit(1);
    console.log('Connection OK! Sample data:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection();