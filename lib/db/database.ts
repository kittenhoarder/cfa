import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "database.json");

export interface Database {
  users: {
    [userId: string]: {
      userId: string;
      examLevel: "level-1" | "level-2" | "level-3";
      examDateId: string; // Exam date ID
      examDate: string; // ISO date string (first day of exam window)
      examWindowEnd: string; // ISO date string (last day of exam window)
      createdAt: string;
    };
  };
  progress: {
    [userId: string]: any; // UserProgress type
  };
}

/**
 * Ensure data directory exists
 */
async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.access(path.dirname(DB_PATH));
  } catch {
    // Directory doesn't exist, create it
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  }
}

/**
 * Initialize database file if it doesn't exist
 */
async function ensureDatabase(): Promise<void> {
  await ensureDataDirectory();
  try {
    await fs.access(DB_PATH);
  } catch {
    // File doesn't exist, create it
    const initialData: Database = {
      users: {},
      progress: {},
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

/**
 * Read database file with atomic operation
 */
export async function readDatabase(): Promise<Database> {
  await ensureDatabase();
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data) as Database;
  } catch (error) {
    console.error("Error reading database:", error);
    // Return empty database on error
    return { users: {}, progress: {} };
  }
}

/**
 * Write database file with atomic operation (write to temp, then rename)
 */
export async function writeDatabase(data: Database): Promise<void> {
  // Ensure directory exists before writing
  await ensureDataDirectory();
  
  const tempPath = `${DB_PATH}.tmp`;
  try {
    // Write to temporary file first (this will create the file even if directory was just created)
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
    // Atomic rename - ensure target directory exists
    await ensureDataDirectory();
    await fs.rename(tempPath, DB_PATH);
  } catch (error: any) {
    // Clean up temp file on error
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
    console.error("Error writing database:", error);
    // If it's a directory issue, try creating directory again and retry once
    if (error?.code === "ENOENT") {
      try {
        await ensureDataDirectory();
        await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
        await fs.rename(tempPath, DB_PATH);
        return; // Success on retry
      } catch (retryError) {
        console.error("Error on retry:", retryError);
      }
    }
    throw error;
  }
}

/**
 * Update database with a function (for atomic updates)
 */
export async function updateDatabase(
  updater: (db: Database) => Database
): Promise<Database> {
  const current = await readDatabase();
  const updated = updater(current);
  await writeDatabase(updated);
  return updated;
}

