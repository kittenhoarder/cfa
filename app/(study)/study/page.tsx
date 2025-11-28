"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDefaultUserId, getDueCards } from "@/lib/utils/progress";
import { flashcards } from "@/lib/content/flashcards";
import { questions } from "@/lib/content/questions";
import { curriculum } from "@/lib/content/curriculum";

export default function StudyPage() {
  const [userId] = useState(() => getDefaultUserId());
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const response = await fetch(`/api/progress?userId=${userId}`);
        const data = await response.json();
        setProgress(data);
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black">Study Dashboard</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
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

              return (
                <div key={topic.id} className="border-2 border-black p-4">
                  <div className="font-bold text-lg mb-2">{topic.name}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Weight: {topic.weight}%
                  </div>
                  <div className="text-sm">
                    <div>{topicDueCards.length} cards due</div>
                    <div>{topicQuestions.length} questions</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t-2 border-black pt-8">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/progress"
              className="border-2 border-black px-6 py-3 text-black font-semibold hover:bg-black hover:text-white transition-colors"
            >
              View Progress
            </Link>
            <Link
              href="/"
              className="border-2 border-black px-6 py-3 text-black font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

