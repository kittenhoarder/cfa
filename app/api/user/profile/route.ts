import { NextRequest, NextResponse } from "next/server";
import { saveUserProfile, getOrCreateUserProfile } from "@/lib/db/user-db";

/**
 * GET /api/user/profile
 * Get user profile
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const profile = await getOrCreateUserProfile(userId);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/profile
 * Create or update user profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, examLevel, examDate } = body;

    if (!userId || !examLevel || !examDate) {
      return NextResponse.json(
        { error: "userId, examLevel, and examDate are required" },
        { status: 400 }
      );
    }

    // Validate exam level
    if (!["level-1", "level-2", "level-3"].includes(examLevel)) {
      return NextResponse.json(
        { error: "Invalid exam level" },
        { status: 400 }
      );
    }

    // Validate exam date is in future
    const selectedDate = new Date(examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return NextResponse.json(
        { error: "Exam date must be in the future" },
        { status: 400 }
      );
    }

    const profile = await getOrCreateUserProfile(userId, {
      examLevel: examLevel as "level-1" | "level-2" | "level-3",
      examDate,
    });

    await saveUserProfile({
      ...profile,
      examLevel: examLevel as "level-1" | "level-2" | "level-3",
      examDate,
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error saving user profile:", error);
    return NextResponse.json(
      { error: "Failed to save user profile" },
      { status: 500 }
    );
  }
}

