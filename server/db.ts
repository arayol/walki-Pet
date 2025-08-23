import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to configure the database?",
  );
}

// Create Neon HTTP client
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export the schema for use in queries
export * from '../shared/schema.js';