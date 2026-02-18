"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// --- Types ---
export type QuizLevel = {
  id: number;
  level_number: number;
  title: string;
  description: string;
};

export type QuizSubLevel = {
  id: number;
  level_id: number;
  sub_level_number: number;
  title: string;
  min_score_to_pass: number;
  is_locked?: boolean; // For frontend logic
  is_completed?: boolean;
  score?: number;
};

export type QuizQuestion = {
  id: number;
  sub_level_id: number;
  question_text: string;
  options: string[]; // JSONB stored as array
  correct_answer: string;
  explanation: string;
};

// --- Admin Actions ---

export async function getLevelsAction() {
  try {
    const res = await query("SELECT * FROM quiz_levels ORDER BY level_number ASC");
    return { success: true, data: res.rows as QuizLevel[] };
  } catch (error) {
    console.error("Error fetching levels:", error);
    return { success: false, data: [] };
  }
}

export async function getSubLevelsAction(levelId: number) {
  try {
    const res = await query(
      "SELECT * FROM quiz_sub_levels WHERE level_id = $1 ORDER BY sub_level_number ASC",
      [levelId]
    );
    return { success: true, data: res.rows as QuizSubLevel[] };
  } catch (error) {
    console.error("Error fetching sub-levels:", error);
    return { success: false, data: [] };
  }
}

export async function getQuestionsAction(subLevelId: number) {
  try {
    const res = await query(
      "SELECT * FROM quiz_questions WHERE sub_level_id = $1 ORDER BY id ASC",
      [subLevelId]
    );
    return { success: true, data: res.rows as QuizQuestion[] };
  } catch (error) {
    console.error("Error fetching questions:", error);
    return { success: false, data: [] };
  }
}

export async function addQuestionAction(prevState: any, formData: FormData) {
  const subLevelId = formData.get("subLevelId");
  const questionText = formData.get("questionText") as string;
  const optionA = formData.get("optionA") as string;
  const optionB = formData.get("optionB") as string;
  const optionC = formData.get("optionC") as string;
  const optionD = formData.get("optionD") as string;
  const correctAnswer = formData.get("correctAnswer") as string;
  const explanation = formData.get("explanation") as string;

  if (!subLevelId || !questionText || !optionA || !optionB || !correctAnswer) {
    return { success: false, message: "Semua field wajib diisi." };
  }

  const options = JSON.stringify([optionA, optionB, optionC, optionD]);

  try {
    await query(
      `INSERT INTO quiz_questions (sub_level_id, question_text, options, correct_answer, explanation)
       VALUES ($1, $2, $3, $4, $5)`,
      [subLevelId, questionText, options, correctAnswer, explanation]
    );
    revalidatePath("/dashboard/admin/quizzes");
    return { success: true, message: "Soal berhasil ditambahkan." };
  } catch (error) {
    console.error("Error adding question:", error);
    return { success: false, message: "Gagal menambahkan soal." };
  }
}

export async function deleteQuestionAction(id: number) {
  try {
    await query("DELETE FROM quiz_questions WHERE id = $1", [id]);
    revalidatePath("/dashboard/admin/quizzes");
    return { success: true, message: "Soal berhasil dihapus." };
  } catch (error) {
    console.error("Error deleting question:", error);
    return { success: false, message: "Gagal menghapus soal." };
  }
}


// --- User/Learning Actions ---

export async function getUserProgressAction(username: string) {
  try {
    // 1. Get User ID
    const userRes = await query("SELECT id FROM users WHERE username = $1", [username]);
    if (userRes.rowCount === 0) return { success: false, message: "User not found" };
    const userId = userRes.rows[0].id;

    // 2. Get Progress
    const progressRes = await query(
      "SELECT * FROM user_progress WHERE user_id = $1",
      [userId]
    );
    
    return { success: true, data: progressRes.rows };
  } catch (error) {
    console.error("Error getting user progress:", error);
    return { success: false, data: [] };
  }
}

export async function submitQuizAction(
  username: string,
  subLevelId: number,
  answers: { [questionId: number]: string }
) {
  try {
    // 1. Get User ID
    const userRes = await query("SELECT id FROM users WHERE username = $1", [username]);
    if (userRes.rowCount === 0) return { success: false, message: "User not found" };
    const userId = userRes.rows[0].id;

    // 2. Fetch Questions & Calculate Score
    const questionsRes = await query(
      "SELECT id, question_text, options, correct_answer, explanation FROM quiz_questions WHERE sub_level_id = $1",
      [subLevelId]
    );
    const questions = questionsRes.rows;
    
    let correctCount = 0;
    const details = questions.map((q) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) correctCount++;
      
      return {
        id: q.id,
        question_text: q.question_text,
        user_answer: userAnswer,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        is_correct: isCorrect,
        options: q.options // Include options if needed for display
      };
    });

    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // 3. Check Passing Grade
    const subLevelRes = await query("SELECT min_score_to_pass FROM quiz_sub_levels WHERE id = $1", [subLevelId]);
    const minScore = subLevelRes.rows[0].min_score_to_pass;
    const isPassed = score >= minScore;

    // 4. Update/Insert Progress
    // Check if exists
    const checkRes = await query(
      "SELECT * FROM user_progress WHERE user_id = $1 AND sub_level_id = $2",
      [userId, subLevelId]
    );

    if (checkRes.rowCount && checkRes.rowCount > 0) {
      // Update if score is higher
      const currentScore = checkRes.rows[0].score;
      if (score > currentScore) {
         await query(
            `UPDATE user_progress 
             SET score = $1, is_completed = $2, completed_at = NOW() 
             WHERE id = $3`,
            [score, isPassed, checkRes.rows[0].id]
         );
      } else if (isPassed && !checkRes.rows[0].is_completed) {
          // Just in case
          await query("UPDATE user_progress SET is_completed = true WHERE id = $1", [checkRes.rows[0].id]);
      }
    } else {
      // Insert
      await query(
        `INSERT INTO user_progress (user_id, sub_level_id, score, is_completed, completed_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, subLevelId, score, isPassed]
      );
    }
    // ... (rest of logic) ...

    // ... (rest of logic) ...

    const resultData = { success: true, score, isPassed, totalQuestions, correctCount, details };
    
    // Store result in cookie to avoid long URL
    const cookieStore = await cookies();
    cookieStore.set(`quiz_result_${subLevelId}`, JSON.stringify(resultData), { 
        path: '/', 
        maxAge: 300 // 5 minutes 
    });

    revalidatePath("/dashboard/belajar");
    return { success: true };

  } catch (error) {
    console.error("Error submitting quiz:", error);
    return { success: false, message: "Gagal mengirim jawaban." };
  }
}

export async function resetQuizAction(subLevelId: number) {
  const cookieStore = await cookies();
  cookieStore.delete(`quiz_result_${subLevelId}`);
  revalidatePath(`/dashboard/belajar`);
  return { success: true };
}

// --- CRUD Levels & SubLevels (Admin) ---

export async function createLevelAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const levelNumber = parseInt(formData.get("levelNumber") as string);

  try {
    await query(
      "INSERT INTO quiz_levels (level_number, title, description) VALUES ($1, $2, $3)",
      [levelNumber, title, description]
    );
    revalidatePath("/dashboard/admin/learning/levels");
    revalidatePath("/dashboard/belajar");
    return { success: true, message: "Level berhasil dibuat." };
  } catch (error) {
    return { success: false, message: "Gagal membuat level. Pastikan nomor level unik." };
  }
}

export async function deleteLevelAction(id: number) {
  try {
    await query("DELETE FROM quiz_levels WHERE id = $1", [id]);
    revalidatePath("/dashboard/admin/learning/levels");
    revalidatePath("/dashboard/belajar");
    return { success: true, message: "Level dihapus." };
  } catch (error) {
    return { success: false, message: "Gagal menghapus level." };
  }
}

export async function createSubLevelAction(formData: FormData) {
  const levelId = formData.get("levelId");
  const title = formData.get("title") as string;
  const subLevelNumber = parseInt(formData.get("subLevelNumber") as string);
  const minScore = parseInt(formData.get("minScore") as string) || 70;

  try {
    await query(
      "INSERT INTO quiz_sub_levels (level_id, sub_level_number, title, min_score_to_pass) VALUES ($1, $2, $3, $4)",
      [levelId, subLevelNumber, title, minScore]
    );
    revalidatePath("/dashboard/admin/learning/sublevels");
    revalidatePath("/dashboard/belajar");
    return { success: true, message: "Sub-level berhasil dibuat." };
  } catch (error) {
    return { success: false, message: "Gagal membuat sub-level." };
  }
}

export async function deleteSubLevelAction(id: number) {
  try {
    await query("DELETE FROM quiz_sub_levels WHERE id = $1", [id]);
    revalidatePath("/dashboard/admin/learning/sublevels");
    revalidatePath("/dashboard/belajar");
    return { success: true, message: "Sub-level dihapus." };
  } catch (error) {
    return { success: false, message: "Gagal menghapus sub-level." };
  }
}

// --- Composite Action for Learning Map ---

export async function getLevelsAndProgressAction(username: string) {
  try {
    // 1. Get All Levels
    const levelsRes = await getLevelsAction();
    const levels = (levelsRes.success && Array.isArray(levelsRes.data)) ? levelsRes.data : [];

    // 2. Get User Progress
    let userProgress: any[] = [];
    const progressRes = await getUserProgressAction(username);
    if (progressRes.success && Array.isArray(progressRes.data)) {
        userProgress = progressRes.data;
    }

    // Helper functions
    const isSubCompleted = (subId: number) => userProgress.some(p => p.sub_level_id === subId && p.is_completed);
    const getScore = (subId: number) => userProgress.find(p => p.sub_level_id === subId)?.score;

    // 3. Process Levels Sequentially for Correct Locking Cascade
    const processedLevels = [];
    let isPreviousLevelCompleted = true; // Level 1 is always unlocked initially

    for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        
        // Fetch SubLevels for this level
        const subRes = await getSubLevelsAction(level.id);
        const subLevelsData = (subRes.success && Array.isArray(subRes.data)) ? subRes.data : [];

        // Determine if THIS level is unlocked
        // It's unlocked if previous level was completed.
        const isUnlocked = isPreviousLevelCompleted;

        // Process SubLevels (Add locked status)
        const subLevels = subLevelsData.map((sub: any, subIdx: number) => {
            let isSubLocked = false;
            
            // If Level is locked, ALL sub-levels are locked
            if (!isUnlocked) {
                isSubLocked = true;
            } else {
                // Level is unlocked, check sub-level internal sequence
                if (subIdx === 0) {
                     isSubLocked = false; // First part always open if level is open
                } else {
                     // Check previous part
                     const prevSubId = subLevelsData[subIdx - 1].id;
                     if (!isSubCompleted(prevSubId)) isSubLocked = true;
                }
            }

            return {
                ...sub,
                isLocked: isSubLocked,
                isCompleted: isSubCompleted(sub.id),
                score: getScore(sub.id)
            };
        });

        // Determine if THIS level is fully completed
        // Rule: Must have content (>0 subs) AND all subs must be completed.
        const hasContent = subLevels.length > 0;
        const allSubsCompleted = hasContent && subLevels.every((s:any) => s.isCompleted);
        
        const currentLevelCompleted = allSubsCompleted;

        processedLevels.push({
            ...level,
            sub_levels: subLevels,
            is_unlocked: isUnlocked
        });

        // Update flag for next iteration
        isPreviousLevelCompleted = currentLevelCompleted;
    }

    return { success: true, levels: processedLevels };

  } catch (error) {
    console.error("Error fetching learning map data:", error);
    return { success: false, levels: [] };
  }
}
