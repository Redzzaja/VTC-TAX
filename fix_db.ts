import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

// Try loading from .env.local explicitly
const result = dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
if (result.error) {
  console.log("Error loading .env.local:", result.error);
  // Try .env
  dotenv.config();
}

const connectionString = process.env.DATABASE_URL;
console.log("Loaded .env. Connection string available:", !!connectionString);

if (!connectionString) {
  console.error("DATABASE_URL is missing!");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function run() {
  let client;
  try {
    console.log("Connecting to DB...");
    client = await pool.connect();
    console.log("Connected successfully!");

    // Run Migration SQL
    // 1. Materials
    await client.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        type VARCHAR(50), 
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Checked 'materials'.");

    // 2. Quiz Levels
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_levels (
        id SERIAL PRIMARY KEY,
        level_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(level_number)
      );
    `);
    console.log("Checked 'quiz_levels'.");

    // 3. Quiz Sub-Levels
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_sub_levels (
        id SERIAL PRIMARY KEY,
        level_id INT REFERENCES quiz_levels(id) ON DELETE CASCADE,
        sub_level_number INT NOT NULL, 
        title VARCHAR(255) NOT NULL,
        min_score_to_pass INT DEFAULT 70,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(level_id, sub_level_number)
      );
    `);
    console.log("Checked 'quiz_sub_levels'.");

    // 4. Quiz Questions
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        sub_level_id INT REFERENCES quiz_sub_levels(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_answer VARCHAR(255) NOT NULL,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Checked 'quiz_questions'.");

    // 5. User Progress
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        sub_level_id INT REFERENCES quiz_sub_levels(id) ON DELETE CASCADE,
        score INT,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        UNIQUE(user_id, sub_level_id)
      );
    `);
    console.log("Checked 'user_progress'.");
    
    // 6. Volunteer Logs Columns
    await client.query(`
         ALTER TABLE volunteer_logs 
         ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id) ON DELETE SET NULL;
    `);
    console.log("Checked 'volunteer_logs' columns.");
    
    // 7. Seed Levels
    const levelCheck = await client.query("SELECT COUNT(*) FROM quiz_levels");
    if (parseInt(levelCheck.rows[0].count) === 0) {
       await client.query(`
        INSERT INTO quiz_levels (level_number, title, description) VALUES 
        (1, 'Dasar Perpajakan', 'Pengenalan dasar-dasar perpajakan di Indonesia.'),
        (2, 'PPh 21', 'Pendalaman mengenai Pajak Penghasilan Pasal 21.');
       `);
       
        const lvl1 = await client.query("SELECT id FROM quiz_levels WHERE level_number = 1");
        const lvl1Id = lvl1.rows[0].id;

        let subLevelsValues = [];
        for(let i=1; i<=10; i++) {
            subLevelsValues.push(`(${lvl1Id}, ${i}, 'Materi Dasar ${i}', 70)`);
        }
        await client.query(`
            INSERT INTO quiz_sub_levels (level_id, sub_level_number, title, min_score_to_pass)
            VALUES ${subLevelsValues.join(", ")}
        `);
       console.log("Seeded Levels.");
    }

  } catch (e: any) {
    console.error("FULL ERROR:", e.message);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

run();
