/**
 * Official CFA Exam Dates
 * Source: CFA Institute
 */

export interface ExamDate {
  id: string;
  level: "level-1" | "level-2" | "level-3";
  windowStart: string; // ISO date string (first day of exam window)
  windowEnd: string; // ISO date string (last day of exam window)
  year: number;
  month: string; // "February", "May", "August", "November"
  displayName: string; // e.g., "February 2025"
}

export const examDates: ExamDate[] = [
  // 2025 Level I
  {
    id: "2025-feb-level-1",
    level: "level-1",
    windowStart: "2025-02-17",
    windowEnd: "2025-02-23",
    year: 2025,
    month: "February",
    displayName: "February 17-23, 2025",
  },
  {
    id: "2025-may-level-1",
    level: "level-1",
    windowStart: "2025-05-14",
    windowEnd: "2025-05-20",
    year: 2025,
    month: "May",
    displayName: "May 14-20, 2025",
  },
  {
    id: "2025-aug-level-1",
    level: "level-1",
    windowStart: "2025-08-20",
    windowEnd: "2025-08-26",
    year: 2025,
    month: "August",
    displayName: "August 20-26, 2025",
  },
  {
    id: "2025-nov-level-1",
    level: "level-1",
    windowStart: "2025-11-12",
    windowEnd: "2025-11-18",
    year: 2025,
    month: "November",
    displayName: "November 12-18, 2025",
  },
  // 2025 Level II
  {
    id: "2025-may-level-2",
    level: "level-2",
    windowStart: "2025-05-21",
    windowEnd: "2025-05-25",
    year: 2025,
    month: "May",
    displayName: "May 21-25, 2025",
  },
  {
    id: "2025-aug-level-2",
    level: "level-2",
    windowStart: "2025-08-27",
    windowEnd: "2025-08-31",
    year: 2025,
    month: "August",
    displayName: "August 27-31, 2025",
  },
  {
    id: "2025-nov-level-2",
    level: "level-2",
    windowStart: "2025-11-19",
    windowEnd: "2025-11-23",
    year: 2025,
    month: "November",
    displayName: "November 19-23, 2025",
  },
  // 2025 Level III
  {
    id: "2025-feb-level-3",
    level: "level-3",
    windowStart: "2025-02-13",
    windowEnd: "2025-02-16",
    year: 2025,
    month: "February",
    displayName: "February 13-16, 2025",
  },
  {
    id: "2025-aug-level-3",
    level: "level-3",
    windowStart: "2025-08-15",
    windowEnd: "2025-08-19",
    year: 2025,
    month: "August",
    displayName: "August 15-19, 2025",
  },
  // 2026 Level I
  {
    id: "2026-feb-level-1",
    level: "level-1",
    windowStart: "2026-02-02",
    windowEnd: "2026-02-08",
    year: 2026,
    month: "February",
    displayName: "February 2-8, 2026",
  },
  {
    id: "2026-may-level-1",
    level: "level-1",
    windowStart: "2026-05-12",
    windowEnd: "2026-05-18",
    year: 2026,
    month: "May",
    displayName: "May 12-18, 2026",
  },
  {
    id: "2026-aug-level-1",
    level: "level-1",
    windowStart: "2026-08-18",
    windowEnd: "2026-08-24",
    year: 2026,
    month: "August",
    displayName: "August 18-24, 2026",
  },
  {
    id: "2026-nov-level-1",
    level: "level-1",
    windowStart: "2026-11-11",
    windowEnd: "2026-11-17",
    year: 2026,
    month: "November",
    displayName: "November 11-17, 2026",
  },
  // 2026 Level II
  {
    id: "2026-may-level-2",
    level: "level-2",
    windowStart: "2026-05-19",
    windowEnd: "2026-05-23",
    year: 2026,
    month: "May",
    displayName: "May 19-23, 2026",
  },
  {
    id: "2026-aug-level-2",
    level: "level-2",
    windowStart: "2026-08-25",
    windowEnd: "2026-08-29",
    year: 2026,
    month: "August",
    displayName: "August 25-29, 2026",
  },
  {
    id: "2026-nov-level-2",
    level: "level-2",
    windowStart: "2026-11-18",
    windowEnd: "2026-11-22",
    year: 2026,
    month: "November",
    displayName: "November 18-22, 2026",
  },
  // 2026 Level III
  {
    id: "2026-feb-level-3",
    level: "level-3",
    windowStart: "2026-01-29",
    windowEnd: "2026-02-01",
    year: 2026,
    month: "February",
    displayName: "January 29 - February 1, 2026",
  },
  {
    id: "2026-aug-level-3",
    level: "level-3",
    windowStart: "2026-08-13",
    windowEnd: "2026-08-17",
    year: 2026,
    month: "August",
    displayName: "August 13-17, 2026",
  },
];

/**
 * Get exam dates for a specific level
 */
export function getExamDatesForLevel(level: "level-1" | "level-2" | "level-3"): ExamDate[] {
  return examDates
    .filter((exam) => exam.level === level)
    .filter((exam) => {
      // Only show future exams
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const examDate = new Date(exam.windowStart);
      return examDate >= today;
    })
    .sort((a, b) => a.windowStart.localeCompare(b.windowStart));
}

/**
 * Get exam date by ID
 */
export function getExamDateById(id: string): ExamDate | undefined {
  return examDates.find((exam) => exam.id === id);
}

