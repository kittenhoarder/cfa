import type { Quality, ReviewResult } from "@/lib/types/study";

/**
 * SM-2 (SuperMemo 2) Spaced Repetition Algorithm
 * 
 * Quality scale:
 * 0 - Complete blackout (total failure)
 * 1 - Incorrect response with recollection
 * 2 - Incorrect response with easy recall
 * 3 - Correct response with difficulty
 * 4 - Correct response after hesitation
 * 5 - Perfect response
 */
export class SM2Algorithm {
  static readonly MIN_EASE_FACTOR = 1.3;
  static readonly INITIAL_EASE_FACTOR = 2.5;
  static readonly INITIAL_INTERVAL = 1; // Days

  /**
   * Calculate next review based on quality rating
   * @param quality Quality rating (0-5)
   * @param easeFactor Current ease factor
   * @param interval Current interval in days
   * @param repetitions Current repetition count
   * @returns Review result with updated values
   */
  static calculateNextReview(
    quality: Quality,
    easeFactor: number = this.INITIAL_EASE_FACTOR,
    interval: number = this.INITIAL_INTERVAL,
    repetitions: number = 0
  ): ReviewResult {
    let newEaseFactor = easeFactor;
    let newInterval = interval;
    let newRepetitions = repetitions;

    // Update ease factor based on quality
    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Ensure minimum ease factor
    if (newEaseFactor < this.MIN_EASE_FACTOR) {
      newEaseFactor = this.MIN_EASE_FACTOR;
    }

    // Update interval and repetitions based on quality
    if (quality < 3) {
      // Failed - reset to beginning
      newInterval = this.INITIAL_INTERVAL;
      newRepetitions = 0;
    } else {
      // Passed
      if (newRepetitions === 0) {
        newInterval = 1;
      } else if (newRepetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(newInterval * newEaseFactor);
      }
      newRepetitions += 1;
    }

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    return {
      easeFactor: newEaseFactor,
      interval: newInterval,
      repetitions: newRepetitions,
      nextReview,
    };
  }

  /**
   * Update card progress after review
   * @param currentProgress Current flashcard progress
   * @param quality Quality rating from user
   * @returns Updated review result
   */
  static updateCard(
    currentProgress: {
      easeFactor: number;
      interval: number;
      repetitions: number;
    } | null,
    quality: Quality
  ): ReviewResult {
    if (!currentProgress) {
      // First review
      return this.calculateNextReview(
        quality,
        this.INITIAL_EASE_FACTOR,
        this.INITIAL_INTERVAL,
        0
      );
    }

    return this.calculateNextReview(
      quality,
      currentProgress.easeFactor,
      currentProgress.interval,
      currentProgress.repetitions
    );
  }

  /**
   * Check if a card is due for review
   * @param nextReview Next review date
   * @returns True if card is due
   */
  static isDue(nextReview: string | Date): boolean {
    const reviewDate = typeof nextReview === "string" ? new Date(nextReview) : nextReview;
    return reviewDate <= new Date();
  }

  /**
   * Get days until next review
   * @param nextReview Next review date
   * @returns Days until review (negative if overdue)
   */
  static daysUntilReview(nextReview: string | Date): number {
    const reviewDate = typeof nextReview === "string" ? new Date(nextReview) : new Date(nextReview);
    const today = new Date();
    const diffTime = reviewDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

