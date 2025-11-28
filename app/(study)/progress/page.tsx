"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDefaultUserId, getWeakAreas, getTopicAccuracy } from "@/lib/utils/progress";
import { questions, getQuestionsByTopic } from "@/lib/content/questions";
import { curriculum } from "@/lib/content/curriculum";
import { flashcards } from "@/lib/content/flashcards";

export default function ProgressPage() {
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

  // Build questions by topic map
  const questionsByTopic: { [topicId: string]: string[] } = {};
  curriculum.forEach((topic) => {
    questionsByTopic[topic.id] = getQuestionsByTopic(topic.id).map((q) => q.id);
  });

  const weakAreas = progress ? getWeakAreas(progress, questionsByTopic) : [];
  const totalStudyTime = progress?.stats?.totalStudyTime || 0;
  const currentStreak = progress?.stats?.currentStreak || 0;
  const longestStreak = progress?.stats?.longestStreak || 0;
  const cardsMastered = progress?.stats?.cardsMastered || 0;
  const totalCards = flashcards.length;

  // Calculate overall accuracy
  let totalAttempts = 0;
  let totalCorrect = 0;
  Object.values(progress?.questions || {}).forEach((q: any) => {
    totalAttempts += q.attempts || 0;
    totalCorrect += q.correct || 0;
  });
  const overallAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black">Progress</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="border-2 border-black p-6">
            <div className="text-sm text-gray-600 mb-2">Overall Accuracy</div>
            <div className="text-4xl font-bold text-black">
              {overallAccuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {totalCorrect} / {totalAttempts} correct
            </div>
          </div>
          <div className="border-2 border-black p-6">
            <div className="text-sm text-gray-600 mb-2">Cards Mastered</div>
            <div className="text-4xl font-bold text-black">{cardsMastered}</div>
            <div className="text-sm text-gray-600 mt-2">of {totalCards}</div>
          </div>
          <div className="border-2 border-black p-6">
            <div className="text-sm text-gray-600 mb-2">Current Streak</div>
            <div className="text-4xl font-bold text-black">{currentStreak}</div>
            <div className="text-sm text-gray-600 mt-2">days</div>
          </div>
          <div className="border-2 border-black p-6">
            <div className="text-sm text-gray-600 mb-2">Longest Streak</div>
            <div className="text-4xl font-bold text-black">{longestStreak}</div>
            <div className="text-sm text-gray-600 mt-2">days</div>
          </div>
        </div>

        {/* Weak Areas */}
        {weakAreas.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">Weak Areas</h2>
            <div className="space-y-4">
              {weakAreas.map((area) => {
                const topic = curriculum.find((t) => t.id === area.topicId);
                return (
                  <div key={area.topicId} className="border-2 border-black p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-lg">{topic?.name}</div>
                      <div className="text-2xl font-bold text-black">
                        {area.accuracy.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {area.totalAttempts} attempts
                    </div>
                    <div className="mt-4 h-4 bg-gray-200 border border-black">
                      <div
                        className="h-full bg-black"
                        style={{ width: `${area.accuracy}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Topic Performance */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Topic Performance</h2>
          <div className="space-y-4">
            {curriculum.map((topic) => {
              const topicQuestions = getQuestionsByTopic(topic.id);
              const accuracy = progress
                ? getTopicAccuracy(progress, topicQuestions.map((q) => q.id))
                : 0;
              const topicProgress = progress?.questions || {};
              let topicAttempts = 0;
              let topicCorrect = 0;
              topicQuestions.forEach((q) => {
                const qProgress = topicProgress[q.id];
                if (qProgress) {
                  topicAttempts += qProgress.attempts || 0;
                  topicCorrect += qProgress.correct || 0;
                }
              });

              return (
                <div key={topic.id} className="border-2 border-black p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-bold text-lg">{topic.name}</div>
                      <div className="text-sm text-gray-600">
                        Weight: {topic.weight}% • {topicQuestions.length} questions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-black">
                        {accuracy.toFixed(1)}%
                      </div>
                      {topicAttempts > 0 && (
                        <div className="text-sm text-gray-600">
                          {topicCorrect} / {topicAttempts}
                        </div>
                      )}
                    </div>
                  </div>
                  {topicAttempts > 0 && (
                    <div className="h-4 bg-gray-200 border border-black">
                      <div
                        className="h-full bg-black"
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}

