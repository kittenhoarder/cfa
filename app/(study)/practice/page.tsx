"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { questions, getQuestionsByTopic } from "@/lib/content/questions";
import { curriculum } from "@/lib/content/curriculum";
import { getDefaultUserId } from "@/lib/utils/progress";

function PracticePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId] = useState(() => getDefaultUserId());
  const [progress, setProgress] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [jumpToInput, setJumpToInput] = useState<string>("");

  // Load progress and handle URL params
  useEffect(() => {
    async function loadProgress() {
      try {
        const response = await fetch(`/api/progress?userId=${userId}`);
        const data = await response.json();
        setProgress(data);
        
        // Handle URL parameters
        const topicParam = searchParams.get("topic");
        const questionParam = searchParams.get("question");
        const indexParam = searchParams.get("index");
        
        if (topicParam) {
          setSelectedTopic(topicParam);
        }
        
        // Calculate filtered questions
        const filtered = topicParam && topicParam !== "all"
          ? getQuestionsByTopic(topicParam)
          : questions;
        
        // Set initial question index
        let initialIndex = 0;
        if (questionParam) {
          const questionIndex = filtered.findIndex((q) => q.id === questionParam);
          if (questionIndex >= 0) initialIndex = questionIndex;
        } else if (indexParam) {
          const index = parseInt(indexParam, 10) - 1;
          if (index >= 0 && index < filtered.length) initialIndex = index;
        }
        
        setCurrentQuestionIndex(initialIndex);
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [userId, searchParams]);

  // Filter questions
  const filteredQuestions = selectedTopic === "all"
    ? questions
    : getQuestionsByTopic(selectedTopic);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const isAnswered = currentQuestion && progress?.questions[currentQuestion.id]?.answered;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (loading || !currentQuestion) return;
      
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Enter" && !showExplanation && selectedAnswer !== null) {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentQuestionIndex, filteredQuestions.length, showExplanation, selectedAnswer, loading, currentQuestion]);

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else if (filteredQuestions.length > 1) {
      setCurrentQuestionIndex(filteredQuestions.length - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleJumpTo = () => {
    const index = parseInt(jumpToInput, 10) - 1;
    if (index >= 0 && index < filteredQuestions.length) {
      setCurrentQuestionIndex(index);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setJumpToInput("");
    }
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    setCurrentQuestionIndex(randomIndex);
    setSelectedAnswer(null);
    setShowExplanation(false);
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

  const handleMarkUnanswered = async () => {
    if (!currentQuestion) return;

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: "mark_unanswered",
          data: {
            questionId: currentQuestion.id,
          },
        }),
      });

      const updatedProgress = await response.json();
      setProgress(updatedProgress);
    } catch (error) {
      console.error("Error marking question as unanswered:", error);
    }
  };

  const handleTopicChange = (newTopic: string) => {
    setSelectedTopic(newTopic);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (newTopic === "all") {
      params.delete("topic");
    } else {
      params.set("topic", newTopic);
    }
    router.push(`/practice?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ paddingTop: "48px" }}>
        <div className="text-black text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8" style={{ paddingTop: "48px" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">No Questions Available</h1>
          <p className="text-xl text-gray-600 mb-8">No questions found for the selected filter.</p>
          <a href="/study" className="inline-block border-2 border-black px-8 py-4 text-lg font-semibold text-black hover:bg-black hover:text-white transition-colors">
            Back to Study
          </a>
        </div>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: "48px" }}>
      {/* Header */}
      <header className="border-b-2 border-black p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-black">Practice Questions</h1>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </div>
        </div>
      </header>

      {/* Navigation Controls */}
      <div className="border-b border-gray-300 p-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 items-center">
          <button
            onClick={handlePrevious}
            className="border-2 border-black px-4 py-2 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white transition-colors touch-manipulation"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="border-2 border-black px-4 py-2 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white transition-colors touch-manipulation"
          >
            Next →
          </button>
          <button
            onClick={handleRandom}
            className="border-2 border-black px-4 py-2 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white transition-colors touch-manipulation"
          >
            Random
          </button>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="1"
              max={filteredQuestions.length}
              value={jumpToInput}
              onChange={(e) => setJumpToInput(e.target.value)}
              placeholder="Go to question"
              className="border-2 border-black px-3 py-2 w-28 text-black bg-white font-semibold"
            />
            <button
              onClick={handleJumpTo}
              className="border-2 border-black px-4 py-2 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white transition-colors touch-manipulation"
            >
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Topic Filter */}
      <div className="border-b border-gray-300 p-4">
        <div className="max-w-4xl mx-auto">
          <select
            value={selectedTopic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="border-2 border-black px-4 py-2 text-black bg-white font-semibold w-full md:w-auto"
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
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">
            {curriculum.find((t) => t.id === currentQuestion.topicId)?.name} • {currentQuestion.difficulty}
            {isAnswered && <span className="ml-2 text-green-700">✓ Answered</span>}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-black mb-6 md:mb-8 break-words">{currentQuestion.text}</h2>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full text-left border-2 border-black px-4 md:px-6 py-3 md:py-4 min-h-[56px] text-sm md:text-base text-black font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation break-words";
              
              if (showExplanation) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += " bg-[var(--color-correct)] text-white";
                } else if (index === selectedAnswer && !isCorrect) {
                  buttonClass += " bg-[var(--color-incorrect)] text-white";
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
                  <span className="font-mono mr-2 md:mr-4">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`border-2 p-4 md:p-6 mb-8 ${isCorrect ? "border-black bg-gray-50" : "border-black bg-gray-100"}`}>
              <div className="font-bold text-base md:text-lg mb-2">
                {isCorrect ? "✓ Correct" : "✗ Incorrect"}
              </div>
              <div className="text-black text-sm md:text-base break-words">{currentQuestion.explanation}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            {!showExplanation ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="border-2 border-black px-6 md:px-8 py-3 md:py-4 min-h-[44px] text-sm md:text-base text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                Submit Answer
              </button>
            ) : (
              <>
                <button
                  onClick={handleNext}
                  className="border-2 border-black px-6 md:px-8 py-3 md:py-4 min-h-[44px] text-sm md:text-base text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
                >
                  Next Question
                </button>
                {isAnswered && (
                  <button
                    onClick={handleMarkUnanswered}
                    className="border-2 border-black px-6 md:px-8 py-3 md:py-4 min-h-[44px] text-sm md:text-base text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
                  >
                    Mark as Unanswered
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ paddingTop: "48px" }}>
        <div className="text-black text-xl">Loading...</div>
      </div>
    }>
      <PracticePageContent />
    </Suspense>
  );
}
