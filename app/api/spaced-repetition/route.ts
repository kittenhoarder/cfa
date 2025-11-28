import { NextRequest, NextResponse } from "next/server";
import { SM2Algorithm } from "@/lib/algorithms/sm2";
import type { Quality, ReviewResult } from "@/lib/types/study";

/**
 * POST /api/spaced-repetition
 * Calculate next review using SM-2 algorithm
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quality, easeFactor, interval, repetitions } = body;

    if (quality === undefined || quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: "quality must be between 0 and 5" },
        { status: 400 }
      );
    }

    const result = SM2Algorithm.calculateNextReview(
      quality as Quality,
      easeFactor || SM2Algorithm["INITIAL_EASE_FACTOR"],
      interval || SM2Algorithm["INITIAL_INTERVAL"],
      repetitions || 0
    );

    return NextResponse.json({
      easeFactor: result.easeFactor,
      interval: result.interval,
      repetitions: result.repetitions,
      nextReview: result.nextReview.toISOString(),
    } as ReviewResult & { nextReview: string });
  } catch (error) {
    console.error("Error calculating spaced repetition:", error);
    return NextResponse.json(
      { error: "Failed to calculate spaced repetition" },
      { status: 500 }
    );
  }
}

