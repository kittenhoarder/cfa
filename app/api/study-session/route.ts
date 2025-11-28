import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUserProgress, saveUserProgress } from "@/lib/utils/kv";
import { updateStudyTime, updateStreak } from "@/lib/utils/progress";

/**
 * POST /api/study-session
 * Start or end a study session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, startTime, endTime } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const progress = await getOrCreateUserProgress(userId);

    if (action === "start") {
      // Store session start time (could be stored in session storage or KV)
      return NextResponse.json({
        success: true,
        startTime: startTime || new Date().toISOString(),
      });
    } else if (action === "end") {
      if (!startTime || !endTime) {
        return NextResponse.json(
          { error: "startTime and endTime are required" },
          { status: 400 }
        );
      }

      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

      if (durationMinutes < 0) {
        return NextResponse.json(
          { error: "endTime must be after startTime" },
          { status: 400 }
        );
      }

      let updatedProgress = updateStudyTime(progress, durationMinutes);
      updatedProgress = updateStreak(updatedProgress);

      await saveUserProgress(updatedProgress);

      return NextResponse.json({
        success: true,
        duration: durationMinutes,
        progress: updatedProgress,
      });
    } else {
      return NextResponse.json(
        { error: "action must be 'start' or 'end'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error handling study session:", error);
    return NextResponse.json(
      { error: "Failed to handle study session" },
      { status: 500 }
    );
  }
}

