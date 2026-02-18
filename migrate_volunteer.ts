import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
const result = dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
if (result.error) {
  dotenv.config();
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing!");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();
  try {
    console.log("Connecting to DB...");
    
    // Check if columns exist, if not add them
    await client.query(`
      ALTER TABLE volunteer_logs 
      ADD COLUMN IF NOT EXISTS selection_score INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS test_taken_at TIMESTAMP;
    `);
    
    console.log("Updated 'volunteer_logs' table successfully.");

  } catch (e: any) {
    console.error("Migration Error:", e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
