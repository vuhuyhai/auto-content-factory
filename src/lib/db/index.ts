import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Disable prepare statement vì dùng Supabase Pooler (port 6543)
// Supabase Transaction Pooler không support prepared statements
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
