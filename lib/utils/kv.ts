import { kv } from "@vercel/kv";
import type { UserProgress } from "@/lib/types/study";
import { createDefaultProgress } from "./progress";

/**
 * Get user progress from Vercel KV
 * Falls back to localStorage if KV is unavailable
 */
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    // Try Vercel KV first
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const progress = await kv.get<UserProgress>(`progress:${userId}`);
      return progress;
    }
  } catch (error) {
    console.error("Error fetching from KV:", error);
  }

  // Fallback to localStorage (client-side only)
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(`cfa_progress:${userId}`);
    if (stored) {
      try {
        return JSON.parse(stored) as UserProgress;
      } catch (e) {
        console.error("Error parsing localStorage:", e);
      }
    }
  }

  return null;
}

/**
 * Save user progress to Vercel KV
 * Falls back to localStorage if KV is unavailable
 */
export async function saveUserProgress(progress: UserProgress): Promise<void> {
  try {
    // Try Vercel KV first
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(`progress:${progress.userId}`, progress);
      return;
    }
  } catch (error) {
    console.error("Error saving to KV:", error);
  }

  // Fallback to localStorage (client-side only)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`cfa_progress:${progress.userId}`, JSON.stringify(progress));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }
}

/**
 * Get or create user progress
 */
export async function getOrCreateUserProgress(userId: string): Promise<UserProgress> {
  const existing = await getUserProgress(userId);
  if (existing) {
    return existing;
  }

  const newProgress = createDefaultProgress(userId);
  await saveUserProgress(newProgress);
  return newProgress;
}

