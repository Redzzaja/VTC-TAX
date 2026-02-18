// src/lib/db.ts
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// Gunakan verify-full agar eksplisit & future-proof
const sslParam = connectionString?.includes("?")
  ? "&sslmode=verify-full"
  : "?sslmode=verify-full";

const finalConnectionString =
  connectionString && !connectionString.includes("sslmode")
    ? `${connectionString}${sslParam}`
    : connectionString;

const pool = new Pool({
  connectionString: finalConnectionString,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
