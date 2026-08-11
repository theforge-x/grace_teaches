import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to your .env file.");
}

// `prepare: false` is required when connecting through Supabase's transaction
// pooler (port 6543, pgbouncer). If you connect directly to Postgres (port 5432)
// you can remove this option.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
