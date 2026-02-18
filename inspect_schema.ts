
import { query } from "./src/lib/db";

async function inspect() {
  try {
    const res = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    console.log("Users Table Schema:", res.rows);
  } catch (e) {
    console.error(e);
  }
}

inspect();
