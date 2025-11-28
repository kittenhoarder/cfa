import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserProgress, saveUserProgress } from "@/lib/db/progress-db";
import { createDefaultProgress, updateFlashcardProgress, updateQuestionProgress, updateStudyTime, updateStreak } from "@/lib/utils/progress";
import type { Quality } from "@/lib/types/study";

/**
 * GET /api/progress
 * Retrieve user progress
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId") || "anonymous";

    const progress = await getOrCreateUserProgress(userId, () => createDefaultProgress(userId));
    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress
 * Update user progress
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, data } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const progress = await getOrCreateUserProgress(userId, () => createDefaultProgress(userId));
    let updatedProgress = progress;

    switch (type) {
      case "flashcard_review": {
        const { cardId, quality } = data;
        if (!cardId || quality === undefined) {
          return NextResponse.json(
            { error: "cardId and quality are required" },
            { status: 400 }
          );
        }
        updatedProgress = updateFlashcardProgress(progress, cardId, quality as Quality);
        updatedProgress = updateStreak(updatedProgress);
        break;
      }

      case "question_attempt": {
        const { questionId, isCorrect } = data;
        if (!questionId || isCorrect === undefined) {
          return NextResponse.json(
            { error: "questionId and isCorrect are required" },
            { status: 400 }
          );
        }
        updatedProgress = updateQuestionProgress(progress, questionId, isCorrect);
        updatedProgress = updateStreak(updatedProgress);
        break;
      }

      case "study_time": {
        const { minutes } = data;
        if (!minutes || minutes < 0) {
          return NextResponse.json(
            { error: "valid minutes is required" },
            { status: 400 }
          );
        }
        updatedProgress = updateStudyTime(progress, minutes);
        break;
      }

      case "mark_unanswered": {
        const { questionId } = data;
        if (!questionId) {
          return NextResponse.json(
            { error: "questionId is required" },
            { status: 400 }
          );
        }
        const { markQuestionUnanswered } = await import("@/lib/utils/progress");
        updatedProgress = markQuestionUnanswered(progress, questionId);
        break;
      }

      default:
        return NextResponse.json(
          { error: "Invalid type" },
          { status: 400 }
        );
    }

    await saveUserProgress(updatedProgress);
    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

