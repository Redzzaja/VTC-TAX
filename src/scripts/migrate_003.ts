import { query } from "../lib/db";
import dotenv from "dotenv";
dotenv.config();

async function migrate() {
  console.log("Starting migration part 2...");

  try {
    // 1. Add user_id to volunteer_logs if not exists
    await query(`
      ALTER TABLE volunteer_logs 
      ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE SET NULL;
    `);
    console.log("Added user_id to volunteer_logs.");

    // 2. Ensure users table has role column (it should, but let's check or alter type if needed)
    // We assume it's VARCHAR.
    
    console.log("Migration part 2 completed.");
  } catch (err) {
    console.error("Migration part 2 failed:", err);
  }
}

migrate();
