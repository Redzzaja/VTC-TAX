import { query } from "../lib/db";
import dotenv from "dotenv";
dotenv.config();

async function migrate() {
  console.log("Starting migration...");

  try {
    // 1. Materials Table
    await query(`
      CREATE TABLE IF NOT EXISTS materials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        type VARCHAR(50), -- 'PDF', 'Video', etc.
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created 'materials' table.");

    // 2. Quiz Levels
    await query(`
      CREATE TABLE IF NOT EXISTS quiz_levels (
        id SERIAL PRIMARY KEY,
        level_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(level_number)
      );
    `);
    console.log("Created 'quiz_levels' table.");

    // 3. Quiz Sub-Levels (10 per level)
    await query(`
      CREATE TABLE IF NOT EXISTS quiz_sub_levels (
        id SERIAL PRIMARY KEY,
        level_id INT REFERENCES quiz_levels(id) ON DELETE CASCADE,
        sub_level_number INT NOT NULL, -- 1 to 10
        title VARCHAR(255) NOT NULL,
        min_score_to_pass INT DEFAULT 70,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(level_id, sub_level_number)
      );
    `);
    console.log("Created 'quiz_sub_levels' table.");

    // 4. Quiz Questions
    await query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        sub_level_id INT REFERENCES quiz_sub_levels(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        options JSONB NOT NULL, -- Array of strings e.g. ["A", "B", "C", "D"]
        correct_answer VARCHAR(255) NOT NULL,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created 'quiz_questions' table.");

    // 5. User Progress
    await query(`
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
    console.log("Created 'user_progress' table.");

    // 6. Seed Initial Levels if not exists
    const levelCheck = await query("SELECT COUNT(*) FROM quiz_levels");
    if (parseInt(levelCheck.rows[0].count) === 0) {
       await query(`
        INSERT INTO quiz_levels (level_number, title, description) VALUES 
        (1, 'Dasar Perpajakan', 'Pengenalan dasar-dasar perpajakan di Indonesia.'),
        (2, 'PPh 21', 'Pendalaman mengenai Pajak Penghasilan Pasal 21.');
       `);
       console.log("Seeded initial levels.");
       
        // Seed Sub-levels for Level 1
        // Get Level 1 ID
        const lvl1 = await query("SELECT id FROM quiz_levels WHERE level_number = 1");
        const lvl1Id = lvl1.rows[0].id;

        let subLevelsValues = [];
        for(let i=1; i<=10; i++) {
            subLevelsValues.push(`(${lvl1Id}, ${i}, 'Materi Dasar ${i}', 70)`);
        }
        await query(`
            INSERT INTO quiz_sub_levels (level_id, sub_level_number, title, min_score_to_pass)
            VALUES ${subLevelsValues.join(", ")}
        `);
        console.log("Seeded sub-levels for Level 1.");
    }
    
    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

migrate();
