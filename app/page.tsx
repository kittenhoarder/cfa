import ExamSelector from "@/app/components/ExamSelector";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black">CFA Study Service</h1>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-16 mt-16">
          <h2 className="text-5xl font-bold text-black mb-6">
            Efficient CFA Exam Preparation
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Master the CFA curriculum with spaced repetition, active recall, and targeted practice questions.
          </p>
          <ExamSelector />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="border-2 border-black p-8">
            <h3 className="text-2xl font-bold text-black mb-4">Spaced Repetition</h3>
            <p className="text-gray-600">
              Review flashcards at optimal intervals using the proven SM-2 algorithm to maximize retention.
            </p>
          </div>
          <div className="border-2 border-black p-8">
            <h3 className="text-2xl font-bold text-black mb-4">Practice Questions</h3>
            <p className="text-gray-600">
              Test your knowledge with comprehensive practice questions covering all 10 CFA Level I topic areas.
            </p>
          </div>
          <div className="border-2 border-black p-8">
            <h3 className="text-2xl font-bold text-black mb-4">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your progress, identify weak areas, and maintain your study streak.
            </p>
          </div>
        </div>

        {/* Topics */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-black mb-8">CFA Level I Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Ethical and Professional Standards", weight: "15%" },
              { name: "Quantitative Methods", weight: "10%" },
              { name: "Economics", weight: "10%" },
              { name: "Financial Statement Analysis", weight: "15%" },
              { name: "Corporate Issuers", weight: "10%" },
              { name: "Equity Investments", weight: "11%" },
              { name: "Fixed Income", weight: "11%" },
              { name: "Derivatives", weight: "6%" },
              { name: "Alternative Investments", weight: "6%" },
              { name: "Portfolio Management", weight: "6%" },
            ].map((topic, index) => (
              <div key={index} className="border-2 border-black p-4">
                <div className="font-bold text-lg mb-1">{topic.name}</div>
                <div className="text-sm text-gray-600">Weight: {topic.weight}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border-t-2 border-black pt-12">
          <p className="text-gray-600 mb-4">Select your exam above to get started</p>
        </div>
      </main>
    </div>
  );
}
