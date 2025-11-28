import { readDatabase, updateDatabase } from "./database";
import type { UserProgress } from "@/lib/types/study";

/**
 * Get user progress by userId
 */
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const db = await readDatabase();
  return db.progress[userId] || null;
}

/**
 * Save user progress
 */
export async function saveUserProgress(progress: UserProgress): Promise<void> {
  await updateDatabase((db) => {
    db.progress[progress.userId] = progress;
    return db;
  });
}

/**
 * Get or create user progress
 */
export async function getOrCreateUserProgress(
  userId: string,
  createFn: () => UserProgress
): Promise<UserProgress> {
  const existing = await getUserProgress(userId);
  if (existing) return existing;

  const newProgress = createFn();
  await saveUserProgress(newProgress);
  return newProgress;
}

