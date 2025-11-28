// Quality rating for spaced repetition (SM-2 algorithm)
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

// Flashcard review result
export interface ReviewResult {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
}

// Flashcard card data
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topicId: string;
  subtopicId: string;
  tags?: string[];
}

// Practice question
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
  topicId: string;
  subtopicId: string;
  difficulty: "easy" | "medium" | "hard";
}

// Topic structure
export interface Topic {
  id: string;
  name: string;
  weight: number; // Exam weight percentage
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  name: string;
  flashcards: string[]; // Flashcard IDs
  questions: string[]; // Question IDs
}

// User progress for a flashcard
export interface FlashcardProgress {
  easeFactor: number;
  interval: number; // Days until next review
  repetitions: number;
  lastReview: string; // ISO date string
  nextReview: string; // ISO date string
}

// User progress for a question
export interface QuestionProgress {
  attempts: number;
  correct: number;
  lastAttempt: string; // ISO date string
}

// User statistics
export interface UserStats {
  totalStudyTime: number; // Minutes
  currentStreak: number; // Days
  longestStreak: number; // Days
  cardsMastered: number;
  lastStudyDate?: string; // ISO date string
}

// Complete user progress
export interface UserProgress {
  userId: string;
  flashcards: {
    [cardId: string]: FlashcardProgress;
  };
  questions: {
    [questionId: string]: QuestionProgress;
  };
  stats: UserStats;
}

// Study session data
export interface StudySession {
  userId: string;
  startTime: string; // ISO date string
  endTime?: string; // ISO date string
  duration?: number; // Minutes
  cardsReviewed: number;
  questionsAnswered: number;
}

