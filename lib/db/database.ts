import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "database.json");

export interface Database {
  users: {
    [userId: string]: {
      userId: string;
      examLevel: "level-1" | "level-2" | "level-3";
      examDate: string; // ISO date string
      createdAt: string;
    };
  };
  progress: {
    [userId: string]: any; // UserProgress type
  };
}

/**
 * Initialize database file if it doesn't exist
 */
async function ensureDatabase(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    // File doesn't exist, create it
    const initialData: Database = {
      users: {},
      progress: {},
    };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
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
  await ensureDatabase();
  const tempPath = `${DB_PATH}.tmp`;
  try {
    // Write to temporary file first
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2));
    // Atomic rename
    await fs.rename(tempPath, DB_PATH);
  } catch (error) {
    // Clean up temp file on error
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
    console.error("Error writing database:", error);
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

