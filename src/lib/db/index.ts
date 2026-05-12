import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Disable prepare statement cho Supabase Pooler (Session pooler port 5432 hoặc Transaction pooler port 6543)
// Cả 2 pooler đều không support prepared statements - prepare: false đảm bảo tương thích
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
