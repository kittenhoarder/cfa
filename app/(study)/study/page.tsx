"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDefaultUserId, getDueCards } from "@/lib/utils/progress";
import { flashcards } from "@/lib/content/flashcards";
import { questions } from "@/lib/content/questions";
import { curriculum } from "@/lib/content/curriculum";
import { getExamDateById } from "@/lib/data/exam-dates";

export default function StudyPage() {
  const [userId] = useState(() => getDefaultUserId());
  const [progress, setProgress] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [examDisplayName, setExamDisplayName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [progressRes, profileRes] = await Promise.all([
          fetch(`/api/progress?userId=${userId}`),
          fetch(`/api/user/profile?userId=${userId}`),
        ]);
        const progressData = await progressRes.json();
        const profileData = await profileRes.json();
        setProgress(progressData);
        setUserProfile(profileData);
        
        // Load exam display name
        if (profileData.examDateId) {
          const examDate = getExamDateById(profileData.examDateId);
          if (examDate) {
            setExamDisplayName(examDate.displayName);
          } else {
            const date = new Date(profileData.examDate);
            setExamDisplayName(date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
          }
        } else if (profileData.examDate) {
          const date = new Date(profileData.examDate);
          setExamDisplayName(date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-xl">Loading...</div>
      </div>
    );
  }

  const allCardIds = flashcards.map((c) => c.id);
  const dueCards = progress ? getDueCards(progress, allCardIds) : allCardIds;
  const totalCards = flashcards.length;
  const masteredCards = progress?.stats?.cardsMastered || 0;
  const totalQuestions = questions.length;
  const totalStudyTime = progress?.stats?.totalStudyTime || 0;
  const currentStreak = progress?.stats?.currentStreak || 0;

  // Calculate days until exam
  const daysUntilExam = userProfile?.examDate
    ? Math.ceil((new Date(userProfile.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black">Study Dashboard</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Exam Countdown */}
        {userProfile && daysUntilExam !== null && (
          <div className="border-2 border-black p-6 mb-8 bg-black text-white">
            <div className="text-sm mb-2">Days Until Exam</div>
            <div className="text-4xl font-bold">{daysUntilExam}</div>
            <div className="text-sm mt-2">
              {userProfile.examLevel === "level-1" ? "CFA Level I" :
               userProfile.examLevel === "level-2" ? "CFA Level II" : "CFA Level III"} - {examDisplayName || new Date(userProfile.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="border-2 border-black p-6">
            <div className="text-sm text-gray-600 mb-2">Cards Due</div>
            <div className="text-4xl font-bold text-black">{dueCards.length}</div>
          </div>
          <div className="border-2 border-black p-6">
            <div className="text-sm text-gray-600 mb-2">Cards Mastered</div>
            <div className="text-4xl font-bold text-black">{masteredCards}</div>
            <div className="text-sm text-gray-600 mt-2">of {totalCards}</div>
          </div>
          <div className="border-2 border-black p-6">
            <div className="text-sm text-gray-600 mb-2">Study Streak</div>
            <div className="text-4xl font-bold text-black">{currentStreak}</div>
            <div className="text-sm text-gray-600 mt-2">days</div>
          </div>
          <div className="border-2 border-black p-6">
            <div className="text-sm text-gray-600 mb-2">Total Study Time</div>
            <div className="text-4xl font-bold text-black">{Math.round(totalStudyTime)}</div>
            <div className="text-sm text-gray-600 mt-2">minutes</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/flashcards"
              className="border-4 border-black p-8 hover:bg-black hover:text-white transition-colors"
            >
              <div className="text-2xl font-bold mb-2">Study Flashcards</div>
              <div className="text-gray-600">
                {dueCards.length} cards due for review
              </div>
            </Link>
            <Link
              href="/practice"
              className="border-4 border-black p-8 hover:bg-black hover:text-white transition-colors"
            >
              <div className="text-2xl font-bold mb-2">Practice Questions</div>
              <div className="text-gray-600">
                {totalQuestions} questions available
              </div>
            </Link>
          </div>
        </div>

        {/* Topics Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {curriculum.map((topic) => {
              const topicCards = flashcards.filter((c) => c.topicId === topic.id);
              const topicQuestions = questions.filter((q) => q.topicId === topic.id);
              const topicDueCards = dueCards.filter((id) =>
                topicCards.some((c) => c.id === id)
              );
              
              // Calculate progress
              const cardsReviewed = topicCards.filter((c) => 
                progress?.flashcards[c.id]
              ).length;
              const questionsAnswered = topicQuestions.filter((q) =>
                progress?.questions[q.id]?.answered
              ).length;

              return (
                <Link
                  key={topic.id}
                  href={`/flashcards?topic=${topic.id}`}
                  className="border-2 border-black p-4 hover:bg-black hover:text-white transition-colors"
                >
                  <div className="font-bold text-lg mb-2">{topic.name}</div>
                  <div className="text-sm text-gray-600 mb-2 hover:text-gray-300">
                    Weight: {topic.weight}%
                  </div>
                  <div className="text-sm space-y-1">
                    <div>{cardsReviewed}/{topicCards.length} cards reviewed</div>
                    <div>{questionsAnswered}/{topicQuestions.length} questions answered</div>
                    <div className="font-semibold mt-2">{topicDueCards.length} cards due</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}

