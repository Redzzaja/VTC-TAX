import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
const result = dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
if (result.error) {
  dotenv.config(); // fallback to .env
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

async function createAdmin() {
  const client = await pool.connect();
  try {
    console.log("Connected to DB. Creating/Updating Admin...");

    const username = "admin";
    const password = "admin123"; // Plain text as per current auth implementation
    const fullName = "Super Administrator";
    const role = "admin";

    // Check if user exists
    const checkRes = await client.query("SELECT * FROM users WHERE username = $1", [username]);

    if (checkRes.rows.length > 0) {
      // Update existing
      await client.query(
        "UPDATE users SET password = $1, role = $2, full_name = $3 WHERE username = $4",
        [password, role, fullName, username]
      );
      console.log(`User '${username}' updated to Admin role.`);
    } else {
      // Insert new
      await client.query(
        "INSERT INTO users (username, password, full_name, role) VALUES ($1, $2, $3, $4)",
        [username, password, fullName, role]
      );
      console.log(`User '${username}' created with Admin role.`);
    }

  } catch (e) {
    console.error("Error creating admin:", e);
  } finally {
    client.release();
    await pool.end();
  }
}

createAdmin();
