import type { Question } from "@/lib/types/study";
import { curriculum } from "./curriculum";

/**
 * CFA Level I Practice Questions
 * Initial set of questions covering key concepts
 */
export const questions: Question[] = [
  // Ethics
  {
    id: "q-ethics-001",
    text: "According to the Code of Ethics, CFA Institute members and candidates must:",
    options: [
      "Place personal interests above client interests",
      "Place the integrity of the investment profession and interests of clients above personal interests",
      "Only act ethically when it benefits their career",
      "Follow ethical standards only in their home country",
    ],
    correctAnswer: 1,
    explanation: "Standard I(B) requires members and candidates to place the integrity of the investment profession and the interests of clients above their own personal interests.",
    topicId: "ethics",
    subtopicId: "ethics-code",
    difficulty: "easy",
  },
  {
    id: "q-ethics-002",
    text: "A portfolio manager receives material nonpublic information about a company's upcoming earnings announcement. According to Standard II(A), the manager should:",
    options: [
      "Trade on the information immediately to benefit clients",
      "Share the information with other portfolio managers",
      "Not trade on or share the material nonpublic information",
      "Trade on the information only if it benefits the firm",
    ],
    correctAnswer: 2,
    explanation: "Standard II(A) prohibits trading on or sharing material nonpublic information. The manager must not act on this information until it becomes public.",
    topicId: "ethics",
    subtopicId: "ethics-application",
    difficulty: "medium",
  },
  
  // Quantitative Methods
  {
    id: "q-quant-001",
    text: "An investor deposits $10,000 in an account earning 6% annual interest, compounded annually. What is the value after 5 years?",
    options: [
      "$13,000",
      "$13,382",
      "$13,500",
      "$14,000",
    ],
    correctAnswer: 1,
    explanation: "FV = PV × (1 + r)^n = $10,000 × (1.06)^5 = $10,000 × 1.3382 = $13,382",
    topicId: "quantitative",
    subtopicId: "quant-time-value",
    difficulty: "easy",
  },
  {
    id: "q-quant-002",
    text: "A stock has returns of 10%, -5%, 15%, and 8% over four years. What is the geometric mean return?",
    options: [
      "7.00%",
      "7.25%",
      "7.50%",
      "9.50%",
    ],
    correctAnswer: 1,
    explanation: "Geometric mean = [(1.10)(0.95)(1.15)(1.08)]^(1/4) - 1 = [1.293]^(1/4) - 1 = 1.0725 - 1 = 7.25%",
    topicId: "quantitative",
    subtopicId: "quant-statistics",
    difficulty: "medium",
  },
  {
    id: "q-quant-003",
    text: "If P(A) = 0.4, P(B) = 0.3, and P(A and B) = 0.12, what is P(A|B)?",
    options: [
      "0.30",
      "0.40",
      "0.48",
      "0.12",
    ],
    correctAnswer: 1,
    explanation: "P(A|B) = P(A and B) / P(B) = 0.12 / 0.30 = 0.40",
    topicId: "quantitative",
    subtopicId: "quant-probability",
    difficulty: "easy",
  },
  
  // Economics
  {
    id: "q-econ-001",
    text: "According to the law of demand, when the price of a good increases:",
    options: [
      "Quantity demanded increases",
      "Quantity demanded decreases",
      "Demand increases",
      "Supply decreases",
    ],
    correctAnswer: 1,
    explanation: "The law of demand states that as price increases, quantity demanded decreases, ceteris paribus. This is a movement along the demand curve, not a shift of the curve.",
    topicId: "economics",
    subtopicId: "econ-demand-supply",
    difficulty: "easy",
  },
  {
    id: "q-econ-002",
    text: "In which market structure do firms have the most pricing power?",
    options: [
      "Perfect competition",
      "Monopolistic competition",
      "Oligopoly",
      "Monopoly",
    ],
    correctAnswer: 3,
    explanation: "A monopoly has the most pricing power because it is the sole supplier of a product with no close substitutes, facing no competition.",
    topicId: "economics",
    subtopicId: "econ-firms",
    difficulty: "easy",
  },
  {
    id: "q-econ-003",
    text: "GDP is calculated as:",
    options: [
      "C + I + G",
      "C + I + G + X",
      "C + I + G + (X - M)",
      "C + I + G - T",
    ],
    correctAnswer: 2,
    explanation: "GDP = C (consumption) + I (investment) + G (government spending) + (X - M) where X is exports and M is imports. Net exports (X - M) can be positive or negative.",
    topicId: "economics",
    subtopicId: "econ-macro",
    difficulty: "medium",
  },
  
  // Financial Statement Analysis
  {
    id: "q-fsa-001",
    text: "The accounting equation states that:",
    options: [
      "Assets = Liabilities - Equity",
      "Assets = Liabilities + Equity",
      "Assets + Liabilities = Equity",
      "Assets = Revenue - Expenses",
    ],
    correctAnswer: 1,
    explanation: "The fundamental accounting equation is Assets = Liabilities + Equity. This must always balance in double-entry bookkeeping.",
    topicId: "financial-reporting",
    subtopicId: "fsa-balance",
    difficulty: "easy",
  },
  {
    id: "q-fsa-002",
    text: "A company has current assets of $500,000 and current liabilities of $300,000. What is the current ratio?",
    options: [
      "0.60",
      "1.67",
      "2.00",
      "1.50",
    ],
    correctAnswer: 1,
    explanation: "Current Ratio = Current Assets / Current Liabilities = $500,000 / $300,000 = 1.67",
    topicId: "financial-reporting",
    subtopicId: "fsa-analysis",
    difficulty: "easy",
  },
  {
    id: "q-fsa-003",
    text: "Which of the following is NOT one of the three main financial statements?",
    options: [
      "Balance Sheet",
      "Income Statement",
      "Cash Flow Statement",
      "Statement of Retained Earnings",
    ],
    correctAnswer: 3,
    explanation: "The three main financial statements are: Balance Sheet, Income Statement, and Cash Flow Statement. While Statement of Retained Earnings is important, it's not considered one of the three primary statements.",
    topicId: "financial-reporting",
    subtopicId: "fsa-intro",
    difficulty: "easy",
  },
  
  // Corporate Issuers
  {
    id: "q-corp-001",
    text: "A company has equity value of $60 million, debt value of $40 million, cost of equity of 12%, cost of debt of 6%, and tax rate of 30%. What is the WACC?",
    options: [
      "8.4%",
      "9.0%",
      "9.6%",
      "10.2%",
    ],
    correctAnswer: 2,
    explanation: "WACC = (E/V × Re) + (D/V × Rd × (1 - Tc)) = (60/100 × 0.12) + (40/100 × 0.06 × 0.70) = 0.072 + 0.0168 = 0.0888 = 8.88% ≈ 9.0%",
    topicId: "corporate-issuers",
    subtopicId: "corp-capital",
    difficulty: "hard",
  },
  
  // Equity
  {
    id: "q-equity-001",
    text: "According to the efficient market hypothesis (semi-strong form), stock prices reflect:",
    options: [
      "Only past prices",
      "All public information",
      "All information including private",
      "No information",
    ],
    correctAnswer: 1,
    explanation: "Semi-strong form efficiency states that stock prices reflect all publicly available information, including past prices and all public announcements.",
    topicId: "equity",
    subtopicId: "equity-efficiency",
    difficulty: "medium",
  },
  {
    id: "q-equity-002",
    text: "A stock is expected to pay a dividend of $2 next year, has a required return of 10%, and a constant growth rate of 5%. What is the stock's value using the DDM?",
    options: [
      "$20",
      "$30",
      "$40",
      "$50",
    ],
    correctAnswer: 2,
    explanation: "V₀ = D₁ / (r - g) = $2 / (0.10 - 0.05) = $2 / 0.05 = $40",
    topicId: "equity",
    subtopicId: "equity-models",
    difficulty: "medium",
  },
  
  // Fixed Income
  {
    id: "q-fi-001",
    text: "When market interest rates rise, bond prices:",
    options: [
      "Rise",
      "Fall",
      "Remain unchanged",
      "Rise or fall depending on maturity",
    ],
    correctAnswer: 1,
    explanation: "Bond prices and interest rates have an inverse relationship. When interest rates rise, existing bonds with lower coupon rates become less attractive, so their prices fall.",
    topicId: "fixed-income",
    subtopicId: "fi-intro",
    difficulty: "easy",
  },
  {
    id: "q-fi-002",
    text: "Yield to maturity (YTM) represents:",
    options: [
      "The coupon rate of the bond",
      "The current yield of the bond",
      "The total return if the bond is held to maturity",
      "The yield on a comparable risk-free bond",
    ],
    correctAnswer: 2,
    explanation: "YTM is the internal rate of return (IRR) of a bond if held to maturity, considering all coupon payments and the face value repayment.",
    topicId: "fixed-income",
    subtopicId: "fi-intro",
    difficulty: "medium",
  },
  
  // Derivatives
  {
    id: "q-deriv-001",
    text: "A forward contract differs from a futures contract in that forwards are:",
    options: [
      "Standardized and traded on exchanges",
      "Customized and traded over-the-counter",
      "Always settled daily",
      "Always require margin",
    ],
    correctAnswer: 1,
    explanation: "Forward contracts are customized agreements traded over-the-counter (OTC), while futures are standardized contracts traded on exchanges.",
    topicId: "derivatives",
    subtopicId: "deriv-intro",
    difficulty: "medium",
  },
  
  // Alternative Investments
  {
    id: "q-alt-001",
    text: "Which of the following is NOT typically considered an alternative investment?",
    options: [
      "Real estate",
      "Private equity",
      "Hedge funds",
      "Large-cap stocks",
    ],
    correctAnswer: 3,
    explanation: "Large-cap stocks are traditional investments. Alternative investments include real estate, private equity, hedge funds, commodities, and infrastructure.",
    topicId: "alternative",
    subtopicId: "alt-categories",
    difficulty: "easy",
  },
  
  // Portfolio Management
  {
    id: "q-port-001",
    text: "According to CAPM, if the risk-free rate is 3%, market return is 10%, and a stock has a beta of 1.5, what is the expected return?",
    options: [
      "10.5%",
      "13.5%",
      "15.0%",
      "18.0%",
    ],
    correctAnswer: 1,
    explanation: "E(Ri) = Rf + βi × [E(Rm) - Rf] = 0.03 + 1.5 × (0.10 - 0.03) = 0.03 + 1.5 × 0.07 = 0.03 + 0.105 = 0.135 = 13.5%",
    topicId: "portfolio",
    subtopicId: "port-risk-ii",
    difficulty: "medium",
  },
  {
    id: "q-port-002",
    text: "A stock with a beta of 0.8 is:",
    options: [
      "More volatile than the market",
      "Less volatile than the market",
      "Uncorrelated with the market",
      "Perfectly correlated with the market",
    ],
    correctAnswer: 1,
    explanation: "Beta measures systematic risk relative to the market. A beta of 0.8 means the stock is 20% less volatile than the market (β < 1).",
    topicId: "portfolio",
    subtopicId: "port-risk-ii",
    difficulty: "easy",
  },
];

/**
 * Get question by ID
 */
export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

/**
 * Get questions by topic
 */
export function getQuestionsByTopic(topicId: string): Question[] {
  return questions.filter((q) => q.topicId === topicId);
}

/**
 * Get questions by subtopic
 */
export function getQuestionsBySubtopic(subtopicId: string): Question[] {
  return questions.filter((q) => q.subtopicId === subtopicId);
}

/**
 * Get questions by difficulty
 */
export function getQuestionsByDifficulty(difficulty: "easy" | "medium" | "hard"): Question[] {
  return questions.filter((q) => q.difficulty === difficulty);
}

/**
 * Get all question IDs
 */
export function getAllQuestionIds(): string[] {
  return questions.map((q) => q.id);
}

// Update curriculum with question IDs
curriculum.forEach((topic) => {
  topic.subtopics.forEach((subtopic) => {
    const topicQuestions = getQuestionsBySubtopic(subtopic.id);
    subtopic.questions = topicQuestions.map((q) => q.id);
  });
});

