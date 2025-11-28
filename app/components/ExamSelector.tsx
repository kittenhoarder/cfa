"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDefaultUserId } from "@/lib/utils/progress";
import { getExamDatesForLevel, type ExamDate } from "@/lib/data/exam-dates";

export default function ExamSelector() {
  const router = useRouter();
  const [examLevel, setExamLevel] = useState<string>("");
  const [selectedExamDateId, setSelectedExamDateId] = useState<string>("");
  const [availableExams, setAvailableExams] = useState<ExamDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Update available exams when level changes
  useEffect(() => {
    if (examLevel && (examLevel === "level-1" || examLevel === "level-2" || examLevel === "level-3")) {
      const exams = getExamDatesForLevel(examLevel as "level-1" | "level-2" | "level-3");
      setAvailableExams(exams);
      setSelectedExamDateId(""); // Reset selection when level changes
    } else {
      setAvailableExams([]);
      setSelectedExamDateId("");
    }
  }, [examLevel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!examLevel || !selectedExamDateId) {
      setError("Please select both exam level and exam date");
      return;
    }

    const selectedExam = availableExams.find((exam) => exam.id === selectedExamDateId);
    if (!selectedExam) {
      setError("Invalid exam selection");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(selectedExam.windowStart);

    if (examDate < today) {
      setError("Selected exam date must be in the future");
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
          examDateId: selectedExam.id,
          examDate: selectedExam.windowStart,
          examWindowEnd: selectedExam.windowEnd,
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
              <option value="level-1">CFA Level I (Available)</option>
              <option value="level-2">CFA Level II (Coming Soon)</option>
              <option value="level-3">CFA Level III (Coming Soon)</option>
            </select>
          </div>

          <div>
            <label htmlFor="examDate" className="block text-sm font-semibold text-black mb-2">
              Exam Date
            </label>
            {examLevel === "level-1" ? (
              availableExams.length > 0 ? (
                <select
                  id="examDate"
                  value={selectedExamDateId}
                  onChange={(e) => setSelectedExamDateId(e.target.value)}
                  required
                  className="w-full border-2 border-black px-4 py-3 text-black bg-white font-semibold"
                >
                  <option value="">Select Exam Date</option>
                  {availableExams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.displayName}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="border-2 border-gray-400 px-4 py-3 text-gray-600 bg-gray-50">
                  No upcoming exam dates available. Please check back later.
                </div>
              )
            ) : examLevel === "level-2" || examLevel === "level-3" ? (
              <div className="border-2 border-black px-4 py-3 bg-black text-white font-semibold">
                Coming Soon! Level {examLevel === "level-2" ? "II" : "III"} support is under development.
              </div>
            ) : (
              <div className="border-2 border-gray-400 px-4 py-3 text-gray-600 bg-gray-50">
                Please select an exam level first
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || examLevel !== "level-1" || !selectedExamDateId}
            className="w-full border-4 border-black px-8 py-4 text-xl font-bold text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : examLevel === "level-1" ? "Start Studying" : "Coming Soon"}
          </button>
        </div>
      </div>
    </form>
  );
}
