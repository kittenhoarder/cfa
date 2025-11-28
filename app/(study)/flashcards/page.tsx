"use client";

import { useState, useEffect } from "react";
import { flashcards, getFlashcardById, getFlashcardsByTopic } from "@/lib/content/flashcards";
import { curriculum } from "@/lib/content/curriculum";
import { getDefaultUserId, getDueCards } from "@/lib/utils/progress";
import type { Quality } from "@/lib/types/study";

export default function FlashcardsPage() {
  const [userId] = useState(() => getDefaultUserId());
  const [progress, setProgress] = useState<any>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [dueCards, setDueCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load progress
  useEffect(() => {
    async function loadProgress() {
      try {
        const response = await fetch(`/api/progress?userId=${userId}`);
        const data = await response.json();
        setProgress(data);
        
        const allCardIds = flashcards.map((c) => c.id);
        const due = getDueCards(data, allCardIds);
        setDueCards(due);
        
        if (due.length > 0) {
          const firstDueIndex = flashcards.findIndex((c) => c.id === due[0]);
          if (firstDueIndex >= 0) {
            setCurrentCardIndex(firstDueIndex);
          }
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [userId]);

  // Filter cards
  const filteredCards = selectedTopic === "all" 
    ? flashcards.filter((card) => dueCards.includes(card.id))
    : getFlashcardsByTopic(selectedTopic).filter((card) => dueCards.includes(card.id));

  const currentCard = filteredCards[currentCardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleQuality = async (quality: Quality) => {
    if (!currentCard || !progress) return;

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: "flashcard_review",
          data: {
            cardId: currentCard.id,
            quality,
          },
        }),
      });

      const updatedProgress = await response.json();
      setProgress(updatedProgress);

      // Update due cards
      const allCardIds = flashcards.map((c) => c.id);
      const due = getDueCards(updatedProgress, allCardIds);
      setDueCards(due);

      // Move to next card
      setIsFlipped(false);
      if (currentCardIndex < filteredCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else if (filteredCards.length > 1) {
        setCurrentCardIndex(0);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">No Cards Due</h1>
          <p className="text-xl text-gray-600 mb-8">All flashcards are up to date!</p>
          <a href="/study" className="inline-block border-2 border-black px-8 py-4 text-lg font-semibold text-black hover:bg-black hover:text-white transition-colors">
            Back to Study
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Flashcards</h1>
          <div className="text-sm text-gray-600">
            {currentCardIndex + 1} / {filteredCards.length}
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
              setCurrentCardIndex(0);
              setIsFlipped(false);
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

      {/* Flashcard */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <div
            className="relative w-full aspect-[4/3] border-4 border-black bg-white cursor-pointer touch-manipulation"
            onClick={handleFlip}
            onTouchStart={(e) => {
              // Prevent double-tap zoom on mobile
              if (e.touches.length > 1) {
                e.preventDefault();
              }
            }}
            style={{ perspective: "1000px" }}
          >
            <div
              className="absolute inset-0 transition-transform duration-300"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 p-8 flex items-center justify-center bg-white backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-4">Question</div>
                  <div className="text-2xl font-semibold text-black">{currentCard.front}</div>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 p-8 flex items-center justify-center bg-black text-white backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-4">Answer</div>
                  <div className="text-xl text-white">{currentCard.back}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4 text-sm text-gray-600">
            Click card to flip
          </div>
        </div>

        {/* Quality Buttons */}
        {isFlipped && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => handleQuality(0)}
              className="border-2 border-black px-6 py-4 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
            >
              Again (0)
            </button>
            <button
              onClick={() => handleQuality(1)}
              className="border-2 border-black px-6 py-4 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
            >
              Hard (1)
            </button>
            <button
              onClick={() => handleQuality(2)}
              className="border-2 border-black px-6 py-4 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
            >
              Good (2)
            </button>
            <button
              onClick={() => handleQuality(3)}
              className="border-2 border-black px-6 py-4 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
            >
              Easy (3)
            </button>
            <button
              onClick={() => handleQuality(4)}
              className="border-2 border-black px-6 py-4 min-h-[44px] text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation md:col-span-1"
            >
              Perfect (4)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

