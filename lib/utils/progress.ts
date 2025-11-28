import type { UserProgress, FlashcardProgress, QuestionProgress, UserStats } from "@/lib/types/study";
import { SM2Algorithm } from "@/lib/algorithms/sm2";

/**
 * Get or create user progress
 * For MVP, we'll use a default userId "anonymous"
 */
export function getDefaultUserId(): string {
  if (typeof window !== "undefined") {
    let userId = localStorage.getItem("cfa_user_id");
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cfa_user_id", userId);
    }
    return userId;
  }
  return "anonymous";
}

/**
 * Initialize default user progress
 */
export function createDefaultProgress(userId: string): UserProgress {
  return {
    userId,
    flashcards: {},
    questions: {},
    stats: {
      totalStudyTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      cardsMastered: 0,
    },
  };
}

/**
 * Update flashcard progress after review
 */
export function updateFlashcardProgress(
  progress: UserProgress,
  cardId: string,
  quality: 0 | 1 | 2 | 3 | 4 | 5
): UserProgress {
  const currentCardProgress = progress.flashcards[cardId];
  const reviewResult = SM2Algorithm.updateCard(
    currentCardProgress
      ? {
          easeFactor: currentCardProgress.easeFactor,
          interval: currentCardProgress.interval,
          repetitions: currentCardProgress.repetitions,
        }
      : null,
    quality
  );

  const newProgress = {
    ...progress,
    flashcards: {
      ...progress.flashcards,
      [cardId]: {
        easeFactor: reviewResult.easeFactor,
        interval: reviewResult.interval,
        repetitions: reviewResult.repetitions,
        lastReview: new Date().toISOString(),
        nextReview: reviewResult.nextReview.toISOString(),
      } as FlashcardProgress,
    },
  };

  // Update cards mastered count
  if (reviewResult.repetitions >= 3 && reviewResult.interval >= 30) {
    // Consider a card "mastered" if it has 3+ repetitions and 30+ day interval
    if (!currentCardProgress || currentCardProgress.interval < 30) {
      newProgress.stats.cardsMastered += 1;
    }
  }

  return newProgress;
}

/**
 * Update question progress after attempt
 */
export function updateQuestionProgress(
  progress: UserProgress,
  questionId: string,
  isCorrect: boolean
): UserProgress {
  const currentQuestionProgress = progress.questions[questionId] || {
    attempts: 0,
    correct: 0,
    lastAttempt: new Date().toISOString(),
  };

  return {
    ...progress,
    questions: {
      ...progress.questions,
      [questionId]: {
        attempts: currentQuestionProgress.attempts + 1,
        correct: currentQuestionProgress.correct + (isCorrect ? 1 : 0),
        lastAttempt: new Date().toISOString(),
      } as QuestionProgress,
    },
  };
}

/**
 * Update study time
 */
export function updateStudyTime(progress: UserProgress, minutes: number): UserProgress {
  return {
    ...progress,
    stats: {
      ...progress.stats,
      totalStudyTime: progress.stats.totalStudyTime + minutes,
    },
  };
}

/**
 * Update study streak
 */
export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split("T")[0];
  const lastStudyDate = progress.stats.lastStudyDate?.split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let currentStreak = progress.stats.currentStreak;
  let longestStreak = progress.stats.longestStreak;

  if (lastStudyDate === today) {
    // Already studied today, no change
    return progress;
  } else if (lastStudyDate === yesterdayStr) {
    // Studied yesterday, continue streak
    currentStreak += 1;
  } else if (!lastStudyDate || lastStudyDate !== today) {
    // New streak
    currentStreak = 1;
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    ...progress,
    stats: {
      ...progress.stats,
      currentStreak,
      longestStreak,
      lastStudyDate: today,
    },
  };
}

/**
 * Get cards due for review
 */
export function getDueCards(progress: UserProgress, allCardIds: string[]): string[] {
  return allCardIds.filter((cardId) => {
    const cardProgress = progress.flashcards[cardId];
    if (!cardProgress) {
      // New card, due for first review
      return true;
    }
    return SM2Algorithm.isDue(cardProgress.nextReview);
  });
}

/**
 * Get weak areas (topics with <70% accuracy)
 */
export function getWeakAreas(
  progress: UserProgress,
  questionsByTopic: { [topicId: string]: string[] }
): Array<{ topicId: string; accuracy: number; totalAttempts: number }> {
  const weakAreas: Array<{ topicId: string; accuracy: number; totalAttempts: number }> = [];

  for (const [topicId, questionIds] of Object.entries(questionsByTopic)) {
    let totalAttempts = 0;
    let totalCorrect = 0;

    questionIds.forEach((questionId) => {
      const questionProgress = progress.questions[questionId];
      if (questionProgress && questionProgress.attempts > 0) {
        totalAttempts += questionProgress.attempts;
        totalCorrect += questionProgress.correct;
      }
    });

    if (totalAttempts > 0) {
      const accuracy = (totalCorrect / totalAttempts) * 100;
      if (accuracy < 70) {
        weakAreas.push({
          topicId,
          accuracy,
          totalAttempts,
        });
      }
    }
  }

  return weakAreas.sort((a, b) => a.accuracy - b.accuracy);
}

/**
 * Calculate topic accuracy
 */
export function getTopicAccuracy(
  progress: UserProgress,
  questionIds: string[]
): number {
  let totalAttempts = 0;
  let totalCorrect = 0;

  questionIds.forEach((questionId) => {
    const questionProgress = progress.questions[questionId];
    if (questionProgress && questionProgress.attempts > 0) {
      totalAttempts += questionProgress.attempts;
      totalCorrect += questionProgress.correct;
    }
  });

  if (totalAttempts === 0) return 0;
  return (totalCorrect / totalAttempts) * 100;
}

