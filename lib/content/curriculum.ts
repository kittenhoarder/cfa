import type { Topic } from "@/lib/types/study";

/**
 * CFA Level I Curriculum Structure
 * Based on the 10 topic areas with their exam weights
 */
export const curriculum: Topic[] = [
  {
    id: "ethics",
    name: "Ethical and Professional Standards",
    weight: 15,
    subtopics: [
      {
        id: "ethics-code",
        name: "Code of Ethics and Standards of Professional Conduct",
        flashcards: [],
        questions: [],
      },
      {
        id: "ethics-guidance",
        name: "Guidance for Standards I-VII",
        flashcards: [],
        questions: [],
      },
      {
        id: "ethics-application",
        name: "Application of the Code and Standards",
        flashcards: [],
        questions: [],
      },
    ],
  },
  {
    id: "quantitative",
    name: "Quantitative Methods",
    weight: 10,
    subtopics: [
      {
        id: "quant-time-value",
        name: "Time Value of Money",
        flashcards: [],
        questions: [],
      },
      {
        id: "quant-statistics",
        name: "Statistical Concepts and Market Returns",
        flashcards: [],
        questions: [],
      },
      {
        id: "quant-probability",
        name: "Probability Concepts",
        flashcards: [],
        questions: [],
      },
      {
        id: "quant-sampling",
        name: "Sampling and Estimation",
        flashcards: [],
        questions: [],
      },
      {
        id: "quant-hypothesis",
        name: "Hypothesis Testing",
        flashcards: [],
        questions: [],
      },
    ],
  },
  {
    id: "economics",
    name: "Economics",
    weight: 10,
    subtopics: [
      {
        id: "econ-demand-supply",
        name: "Demand and Supply Analysis",
        flashcards: [],
        questions: [],
      },
      {
        id: "econ-firms",
        name: "The Firm and Market Structures",
        flashcards: [],
        questions: [],
      },
      {
        id: "econ-macro",
        name: "Aggregate Output, Prices, and Economic Growth",
        flashcards: [],
        questions: [],
      },
      {
        id: "econ-business",
        name: "Understanding Business Cycles",
        flashcards: [],
        questions: [],
      },
      {
        id: "econ-monetary",
        name: "Monetary and Fiscal Policy",
        flashcards: [],
        questions: [],
      },
      {
        id: "econ-international",
        name: "International Trade and Capital Flows",
        flashcards: [],
        questions: [],
      },
      {
        id: "econ-currency",
        name: "Currency Exchange Rates",
        flashcards: [],
        questions: [],
      },
    ],
  },
  {
    id: "financial-reporting",
    name: "Financial Statement Analysis",
    weight: 15,
    subtopics: [
      {
        id: "fsa-intro",
        name: "Introduction to Financial Statement Analysis",
        flashcards: [],
        questions: [],
      },
      {
        id: "fsa-balance",
        name: "Financial Reporting Standards and the Balance Sheet",
        flashcards: [],
        questions: [],
      },
      {
        id: "fsa-income",
        name: "Understanding Income Statements",
        flashcards: [],
        questions: [],
      },
      {
        id: "fsa-cashflow",
        name: "Understanding Cash Flow Statements",
        flashcards: [],
        questions: [],
      },
      {
        id: "fsa-analysis",
        name: "Financial Analysis Techniques",
        flashcards: [],
        questions: [],
      },
      {
        id: "fsa-inventories",
        name: "Inventories",
        flashcards: [],
        questions: [],
      },
      {
        id: "fsa-long-lived",
        name: "Long-Lived Assets",
        flashcards: [],
        questions: [],
      },
      {
        id: "fsa-income-taxes",
        name: "Income Taxes",
        flashcards: [],
        questions: [],
      },
      {
        id: "fsa-non-current",
        name: "Non-Current Liabilities",
        flashcards: [],
        questions: [],
      },
      {
        id: "fsa-financial",
        name: "Financial Reporting Quality",
        flashcards: [],
        questions: [],
      },
    ],
  },
  {
    id: "corporate-issuers",
    name: "Corporate Issuers",
    weight: 10,
    subtopics: [
      {
        id: "corp-capital",
        name: "Capital Structure",
        flashcards: [],
        questions: [],
      },
      {
        id: "corp-leverage",
        name: "Measures of Leverage",
        flashcards: [],
        questions: [],
      },
      {
        id: "corp-dividends",
        name: "Dividends and Share Repurchases",
        flashcards: [],
        questions: [],
      },
      {
        id: "corp-working",
        name: "Working Capital Management",
        flashcards: [],
        questions: [],
      },
    ],
  },
  {
    id: "equity",
    name: "Equity Investments",
    weight: 11,
    subtopics: [
      {
        id: "equity-markets",
        name: "Market Organization and Structure",
        flashcards: [],
        questions: [],
      },
      {
        id: "equity-indices",
        name: "Security Market Indices",
        flashcards: [],
        questions: [],
      },
      {
        id: "equity-efficiency",
        name: "Market Efficiency",
        flashcards: [],
        questions: [],
      },
      {
        id: "equity-overview",
        name: "Overview of Equity Securities",
        flashcards: [],
        questions: [],
      },
      {
        id: "equity-valuation",
        name: "Introduction to Industry and Company Analysis",
        flashcards: [],
        questions: [],
      },
      {
        id: "equity-models",
        name: "Equity Valuation: Concepts and Basic Tools",
        flashcards: [],
        questions: [],
      },
    ],
  },
  {
    id: "fixed-income",
    name: "Fixed Income",
    weight: 11,
    subtopics: [
      {
        id: "fi-intro",
        name: "Introduction to Fixed-Income Valuation",
        flashcards: [],
        questions: [],
      },
      {
        id: "fi-yields",
        name: "Understanding Yield Spreads",
        flashcards: [],
        questions: [],
      },
      {
        id: "fi-intro-securities",
        name: "Introduction to Asset-Backed Securities",
        flashcards: [],
        questions: [],
      },
      {
        id: "fi-fundamentals",
        name: "Fundamentals of Credit Analysis",
        flashcards: [],
        questions: [],
      },
    ],
  },
  {
    id: "derivatives",
    name: "Derivatives",
    weight: 6,
    subtopics: [
      {
        id: "deriv-intro",
        name: "Derivative Instruments",
        flashcards: [],
        questions: [],
      },
      {
        id: "deriv-markets",
        name: "Basics of Derivative Pricing and Valuation",
        flashcards: [],
        questions: [],
      },
    ],
  },
  {
    id: "alternative",
    name: "Alternative Investments",
    weight: 6,
    subtopics: [
      {
        id: "alt-intro",
        name: "Introduction to Alternative Investments",
        flashcards: [],
        questions: [],
      },
      {
        id: "alt-categories",
        name: "Categories of Alternative Investments",
        flashcards: [],
        questions: [],
      },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio Management",
    weight: 6,
    subtopics: [
      {
        id: "port-intro",
        name: "Portfolio Management: An Overview",
        flashcards: [],
        questions: [],
      },
      {
        id: "port-risk",
        name: "Portfolio Risk and Return: Part I",
        flashcards: [],
        questions: [],
      },
      {
        id: "port-risk-ii",
        name: "Portfolio Risk and Return: Part II",
        flashcards: [],
        questions: [],
      },
      {
        id: "port-planning",
        name: "Basics of Portfolio Planning and Construction",
        flashcards: [],
        questions: [],
      },
    ],
  },
];

/**
 * Get all topic IDs
 */
export function getTopicIds(): string[] {
  return curriculum.map((topic) => topic.id);
}

/**
 * Get topic by ID
 */
export function getTopicById(topicId: string): Topic | undefined {
  return curriculum.find((topic) => topic.id === topicId);
}

/**
 * Get all subtopic IDs for a topic
 */
export function getSubtopicIds(topicId: string): string[] {
  const topic = getTopicById(topicId);
  return topic?.subtopics.map((subtopic) => subtopic.id) || [];
}

/**
 * Get all flashcard IDs for a topic
 */
export function getFlashcardIdsForTopic(topicId: string): string[] {
  const topic = getTopicById(topicId);
  if (!topic) return [];
  
  return topic.subtopics.flatMap((subtopic) => subtopic.flashcards);
}

/**
 * Get all question IDs for a topic
 */
export function getQuestionIdsForTopic(topicId: string): string[] {
  const topic = getTopicById(topicId);
  if (!topic) return [];
  
  return topic.subtopics.flatMap((subtopic) => subtopic.questions);
}

