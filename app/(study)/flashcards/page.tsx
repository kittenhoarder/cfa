"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { flashcards, getFlashcardsByTopic } from "@/lib/content/flashcards";
import { curriculum } from "@/lib/content/curriculum";
import { getDefaultUserId, getDueCards } from "@/lib/utils/progress";
import type { Quality } from "@/lib/types/study";

function FlashcardsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId] = useState(() => getDefaultUserId());
  const [progress, setProgress] = useState<any>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [dueCards, setDueCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [jumpToInput, setJumpToInput] = useState<string>("");

  // Load progress and handle URL params
  useEffect(() => {
    async function loadProgress() {
      try {
        const response = await fetch(`/api/progress?userId=${userId}`);
        const data = await response.json();
        setProgress(data);
        
        const allCardIds = flashcards.map((c) => c.id);
        const due = getDueCards(data, allCardIds);
        setDueCards(due);
        
        // Handle URL parameters
        const topicParam = searchParams.get("topic");
        const cardParam = searchParams.get("card");
        const indexParam = searchParams.get("index");
        
        if (topicParam) {
          setSelectedTopic(topicParam);
        }
        
        // Calculate filtered cards
        const filtered = topicParam && topicParam !== "all"
          ? getFlashcardsByTopic(topicParam).filter((card) => due.includes(card.id))
          : flashcards.filter((card) => due.includes(card.id));
        
        // Set initial card index
        let initialIndex = 0;
        if (cardParam) {
          const cardIndex = filtered.findIndex((c) => c.id === cardParam);
          if (cardIndex >= 0) initialIndex = cardIndex;
        } else if (indexParam) {
          const index = parseInt(indexParam, 10) - 1;
          if (index >= 0 && index < filtered.length) initialIndex = index;
        } else if (due.length > 0) {
          const firstDueIndex = filtered.findIndex((c) => c.id === due[0]);
          if (firstDueIndex >= 0) initialIndex = firstDueIndex;
        }
        
        setCurrentCardIndex(initialIndex);
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [userId, searchParams]);

  // Filter cards
  const filteredCards = selectedTopic === "all" 
    ? flashcards.filter((card) => dueCards.includes(card.id))
    : getFlashcardsByTopic(selectedTopic).filter((card) => dueCards.includes(card.id));

  const currentCard = filteredCards[currentCardIndex];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (loading || !currentCard) return;
      
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!isFlipped) {
          setIsFlipped(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentCardIndex, filteredCards.length, isFlipped, loading, currentCard]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    } else if (filteredCards.length > 1) {
      setCurrentCardIndex(filteredCards.length - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else if (filteredCards.length > 1) {
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  const handleJumpTo = () => {
    const index = parseInt(jumpToInput, 10) - 1;
    if (index >= 0 && index < filteredCards.length) {
      setCurrentCardIndex(index);
      setIsFlipped(false);
      setJumpToInput("");
    }
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setCurrentCardIndex(randomIndex);
    setIsFlipped(false);
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
      handleNext();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleTopicChange = (newTopic: string) => {
    setSelectedTopic(newTopic);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (newTopic === "all") {
      params.delete("topic");
    } else {
      params.set("topic", newTopic);
    }
    router.push(`/flashcards?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ paddingTop: "48px" }}>
        <div className="text-black text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentCard || filteredCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8" style={{ paddingTop: "48px" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">No Cards Available</h1>
          <p className="text-xl text-gray-600 mb-8">No flashcards found for the selected filter.</p>
          <a href="/study" className="inline-block border-2 border-black px-8 py-4 text-lg font-semibold text-black hover:bg-black hover:text-white transition-colors">
            Back to Study
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: "48px" }}>
      {/* Header */}
      <header className="border-b-2 border-black p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-black">Flashcards</h1>
          <div className="text-sm text-gray-600">
            Card {currentCardIndex + 1} of {filteredCards.length}
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
              max={filteredCards.length}
              value={jumpToInput}
              onChange={(e) => setJumpToInput(e.target.value)}
              placeholder="Go to card"
              className="border-2 border-black px-3 py-2 w-24 text-black bg-white font-semibold"
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

      {/* Flashcard */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <div
            className="relative w-full min-h-[50vh] md:aspect-[4/3] border-4 border-black bg-white cursor-pointer touch-manipulation"
            onClick={handleFlip}
            onTouchStart={(e) => {
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
                className="absolute inset-0 p-4 md:p-8 flex items-center justify-center bg-white backface-hidden overflow-y-auto"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="text-center w-full">
                  <div className="text-sm text-gray-600 mb-4">Question</div>
                  <div className="text-base md:text-xl lg:text-2xl font-semibold text-black break-words">{currentCard.front}</div>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 p-4 md:p-8 flex items-center justify-center bg-black text-white backface-hidden overflow-y-auto"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="text-center w-full">
                  <div className="text-sm text-gray-400 mb-4">Answer</div>
                  <div className="text-sm md:text-lg lg:text-xl text-white break-words">{currentCard.back}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4 text-sm text-gray-600">
            Click card to flip • Use ← → arrows to navigate
          </div>
        </div>

        {/* Quality Buttons */}
        {isFlipped && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => handleQuality(0)}
              className="border-2 border-black px-4 md:px-6 py-3 md:py-4 min-h-[44px] text-sm md:text-base text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
            >
              Again (0)
            </button>
            <button
              onClick={() => handleQuality(1)}
              className="border-2 border-black px-4 md:px-6 py-3 md:py-4 min-h-[44px] text-sm md:text-base text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
            >
              Hard (1)
            </button>
            <button
              onClick={() => handleQuality(2)}
              className="border-2 border-black px-4 md:px-6 py-3 md:py-4 min-h-[44px] text-sm md:text-base text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
            >
              Good (2)
            </button>
            <button
              onClick={() => handleQuality(3)}
              className="border-2 border-black px-4 md:px-6 py-3 md:py-4 min-h-[44px] text-sm md:text-base text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation"
            >
              Easy (3)
            </button>
            <button
              onClick={() => handleQuality(4)}
              className="border-2 border-black px-4 md:px-6 py-3 md:py-4 min-h-[44px] text-sm md:text-base text-black font-semibold hover:bg-black hover:text-white active:bg-gray-800 active:text-white transition-colors touch-manipulation md:col-span-1"
            >
              Perfect (4)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ paddingTop: "48px" }}>
        <div className="text-black text-xl">Loading...</div>
      </div>
    }>
      <FlashcardsPageContent />
    </Suspense>
  );
}
