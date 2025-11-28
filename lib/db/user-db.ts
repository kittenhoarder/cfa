import { readDatabase, updateDatabase } from "./database";
import type { UserProfile } from "@/lib/types/study";

/**
 * Get user profile by userId
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const db = await readDatabase();
  const userData = db.users[userId];
  if (!userData) return null;
  
  return {
    userId: userData.userId,
    examLevel: userData.examLevel,
    examDate: userData.examDate,
    createdAt: userData.createdAt,
  };
}

/**
 * Create or update user profile
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await updateDatabase((db) => {
    db.users[profile.userId] = {
      userId: profile.userId,
      examLevel: profile.examLevel,
      examDate: profile.examDate,
      createdAt: profile.createdAt,
    };
    return db;
  });
}

/**
 * Get or create user profile
 */
export async function getOrCreateUserProfile(
  userId: string,
  defaultProfile?: Partial<UserProfile>
): Promise<UserProfile> {
  const existing = await getUserProfile(userId);
  if (existing) return existing;

  const newProfile: UserProfile = {
    userId,
    examLevel: defaultProfile?.examLevel || "level-1",
    examDate: defaultProfile?.examDate || new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };

  await saveUserProfile(newProfile);
  return newProfile;
}

