"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDefaultUserId } from "@/lib/utils/progress";

export default function ExamSelector() {
  const router = useRouter();
  const [examLevel, setExamLevel] = useState<string>("");
  const [examDate, setExamDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!examLevel || !examDate) {
      setError("Please select both exam level and date");
      return;
    }

    const selectedDate = new Date(examDate);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (selectedDate <= todayDate) {
      setError("Exam date must be in the future");
      return;
    }

    setLoading(true);

    try {
      const userId = getDefaultUserId();
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          examLevel,
          examDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save exam selection");
      }

      // Redirect to dashboard
      router.push("/study");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
      <div className="border-2 border-black p-8 bg-white">
        <h3 className="text-2xl font-bold text-black mb-6">Select Your Exam</h3>
        
        {error && (
          <div className="mb-4 p-4 bg-gray-100 border-2 border-black text-black">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="examLevel" className="block text-sm font-semibold text-black mb-2">
              Exam Level
            </label>
            <select
              id="examLevel"
              value={examLevel}
              onChange={(e) => setExamLevel(e.target.value)}
              required
              className="w-full border-2 border-black px-4 py-3 text-black bg-white font-semibold"
            >
              <option value="">Select Exam Level</option>
              <option value="level-1">CFA Level I</option>
              <option value="level-2">CFA Level II</option>
              <option value="level-3">CFA Level III</option>
            </select>
          </div>

          <div>
            <label htmlFor="examDate" className="block text-sm font-semibold text-black mb-2">
              Exam Date
            </label>
            <input
              type="date"
              id="examDate"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={today}
              required
              className="w-full border-2 border-black px-4 py-3 text-black bg-white font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border-4 border-black px-8 py-4 text-xl font-bold text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Start Studying"}
          </button>
        </div>
      </div>
    </form>
  );
}

