"use client";

import { useState, useEffect } from "react";
import { questions, getQuestionsByTopic } from "@/lib/content/questions";
import { curriculum } from "@/lib/content/curriculum";
import { getDefaultUserId } from "@/lib/utils/progress";

export default function PracticePage() {
  const [userId] = useState(() => getDefaultUserId());
  const [progress, setProgress] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Load progress
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

  // Filter questions
  const filteredQuestions = selectedTopic === "all"
    ? questions
    : getQuestionsByTopic(selectedTopic);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setShowExplanation(true);

    // Update progress
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: "question_attempt",
          data: {
            questionId: currentQuestion.id,
            isCorrect,
          },
        }),
      });

      const updatedProgress = await response.json();
      setProgress(updatedProgress);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">No Questions Available</h1>
          <a href="/study" className="inline-block border-2 border-black px-8 py-4 text-lg font-semibold text-black hover:bg-black hover:text-white transition-colors">
            Back to Study
          </a>
        </div>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Practice Questions</h1>
          <div className="text-sm text-gray-600">
            {currentQuestionIndex + 1} / {filteredQuestions.length}
          </div>
        </div>
      </header>

      {/* Topic Filter */}
      <div className="border-b border-gray-300 p-4">
        <div className="max-w-4xl mx-auto">
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentQuestionIndex(0);
              setSelectedAnswer(null);
              setShowExplanation(false);
            }}
            className="border-2 border-black px-4 py-2 text-black bg-white font-semibold"
          >
            <option value="all">All Topics</option>
            {curriculum.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Question */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">
            {curriculum.find((t) => t.id === currentQuestion.topicId)?.name} • {currentQuestion.difficulty}
          </div>
          <h2 className="text-2xl font-bold text-black mb-8">{currentQuestion.text}</h2>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full text-left border-2 border-black px-6 py-4 min-h-[56px] text-black font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation";
              
              if (showExplanation) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += " bg-black text-white";
                } else if (index === selectedAnswer && !isCorrect) {
                  buttonClass += " bg-gray-800 text-white";
                }
              } else if (selectedAnswer === index) {
                buttonClass += " bg-gray-200";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={buttonClass}
                >
                  <span className="font-mono mr-4">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`border-2 p-6 mb-8 ${isCorrect ? "border-black bg-gray-50" : "border-black bg-gray-100"}`}>
              <div className="font-bold text-lg mb-2">
                {isCorrect ? "✓ Correct" : "✗ Incorrect"}
              </div>
              <div className="text-black">{currentQuestion.explanation}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {!showExplanation ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="border-2 border-black px-8 py-4 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="border-2 border-black px-8 py-4 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

