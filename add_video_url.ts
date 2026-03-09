import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Pool } from "pg";

async function checkAndMigrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  
  try {
    console.log("Connected to database!");
    
    // Check columns
    const res = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'quiz_sub_levels' ORDER BY ordinal_position"
    );
    const columns = res.rows.map((r: any) => r.column_name);
    console.log("Columns before:", JSON.stringify(columns));

    if (columns.includes("video_url")) {
      console.log("RESULT: video_url already exists");
    } else {
      console.log("Adding video_url column...");
      await client.query("ALTER TABLE quiz_sub_levels ADD COLUMN video_url TEXT");
      console.log("RESULT: video_url added!");
    }

    // Verify
    const v = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'quiz_sub_levels' AND column_name = 'video_url'"
    );
    console.log("VERIFY:", v.rows.length > 0 ? "EXISTS" : "MISSING");
    
  } catch (error: any) {
    console.error("FAILED:", error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkAndMigrate();
