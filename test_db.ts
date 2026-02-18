
import { query } from "./src/lib/db";
import dotenv from "dotenv";
dotenv.config();

async function test() {
  try {
    console.log("Testing connection...");
    const res = await query("SELECT NOW()");
    console.log("Connection successful:", res.rows[0]);
    
    // If successful, try to inspect Schema again
    const schema = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    console.log("Users Table Columns:", schema.rows);
    
  } catch (e) {
    console.error("Connection failed:", e);
  }
}

test();
