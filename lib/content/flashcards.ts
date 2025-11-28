import type { Flashcard } from "@/lib/types/study";
import { curriculum } from "./curriculum";

/**
 * CFA Level I Flashcard Content
 * Initial set of flashcards covering key concepts
 */
export const flashcards: Flashcard[] = [
  // Ethics
  {
    id: "ethics-001",
    front: "What are the six components of the Code of Ethics?",
    back: "1) Act with integrity, competence, diligence, respect, and in an ethical manner. 2) Place the integrity of the investment profession and interests of clients above personal interests. 3) Use reasonable care and exercise independent professional judgment. 4) Practice and encourage others to practice in a professional and ethical manner. 5) Promote the integrity of and uphold the rules governing capital markets. 6) Maintain and improve professional competence.",
    topicId: "ethics",
    subtopicId: "ethics-code",
  },
  {
    id: "ethics-002",
    front: "What is the difference between Standards and Guidance?",
    back: "Standards are mandatory requirements that all CFA Institute members and candidates must follow. Guidance provides recommended procedures for complying with the Standards and helps interpret their meaning.",
    topicId: "ethics",
    subtopicId: "ethics-guidance",
  },
  {
    id: "ethics-003",
    front: "What is Material Nonpublic Information (MNPI)?",
    back: "Information that is not publicly available and would be important to a reasonable investor in making an investment decision. Using MNPI violates Standard II(A) - Material Nonpublic Information.",
    topicId: "ethics",
    subtopicId: "ethics-application",
  },
  
  // Quantitative Methods
  {
    id: "quant-001",
    front: "What is the formula for Future Value (FV)?",
    back: "FV = PV × (1 + r)^n, where PV is present value, r is the interest rate per period, and n is the number of periods.",
    topicId: "quantitative",
    subtopicId: "quant-time-value",
  },
  {
    id: "quant-002",
    front: "What is the formula for Present Value (PV)?",
    back: "PV = FV / (1 + r)^n, where FV is future value, r is the discount rate per period, and n is the number of periods.",
    topicId: "quantitative",
    subtopicId: "quant-time-value",
  },
  {
    id: "quant-003",
    front: "What is the difference between arithmetic mean and geometric mean?",
    back: "Arithmetic mean is the simple average: sum of values divided by count. Geometric mean is the nth root of the product of n values, used for calculating average returns over time. Geometric mean ≤ arithmetic mean.",
    topicId: "quantitative",
    subtopicId: "quant-statistics",
  },
  {
    id: "quant-004",
    front: "What is the formula for standard deviation?",
    back: "σ = √[Σ(xi - μ)² / n] for population, or s = √[Σ(xi - x̄)² / (n-1)] for sample, where μ is population mean, x̄ is sample mean.",
    topicId: "quantitative",
    subtopicId: "quant-statistics",
  },
  {
    id: "quant-005",
    front: "What is conditional probability P(A|B)?",
    back: "The probability of event A occurring given that event B has occurred. Formula: P(A|B) = P(A and B) / P(B).",
    topicId: "quantitative",
    subtopicId: "quant-probability",
  },
  
  // Economics
  {
    id: "econ-001",
    front: "What is the law of demand?",
    back: "As the price of a good or service increases, the quantity demanded decreases, ceteris paribus (all else equal). The demand curve slopes downward.",
    topicId: "economics",
    subtopicId: "econ-demand-supply",
  },
  {
    id: "econ-002",
    front: "What is the law of supply?",
    back: "As the price of a good or service increases, the quantity supplied increases, ceteris paribus. The supply curve slopes upward.",
    topicId: "economics",
    subtopicId: "econ-demand-supply",
  },
  {
    id: "econ-003",
    front: "What are the four types of market structures?",
    back: "1) Perfect competition - many firms, homogeneous products. 2) Monopolistic competition - many firms, differentiated products. 3) Oligopoly - few firms, high barriers. 4) Monopoly - single firm, high barriers.",
    topicId: "economics",
    subtopicId: "econ-firms",
  },
  {
    id: "econ-004",
    front: "What is GDP?",
    back: "Gross Domestic Product - the total market value of all final goods and services produced within a country's borders in a given time period. GDP = C + I + G + (X - M), where C is consumption, I is investment, G is government spending, X is exports, M is imports.",
    topicId: "economics",
    subtopicId: "econ-macro",
  },
  
  // Financial Statement Analysis
  {
    id: "fsa-001",
    front: "What is the accounting equation?",
    back: "Assets = Liabilities + Equity. This equation must always balance in double-entry bookkeeping.",
    topicId: "financial-reporting",
    subtopicId: "fsa-balance",
  },
  {
    id: "fsa-002",
    front: "What are the three main financial statements?",
    back: "1) Balance Sheet - shows assets, liabilities, and equity at a point in time. 2) Income Statement - shows revenues and expenses over a period. 3) Cash Flow Statement - shows cash inflows and outflows over a period.",
    topicId: "financial-reporting",
    subtopicId: "fsa-intro",
  },
  {
    id: "fsa-003",
    front: "What is the difference between operating, investing, and financing cash flows?",
    back: "Operating: cash from core business operations. Investing: cash from buying/selling long-term assets. Financing: cash from borrowing, repaying debt, or equity transactions.",
    topicId: "financial-reporting",
    subtopicId: "fsa-cashflow",
  },
  {
    id: "fsa-004",
    front: "What is the current ratio?",
    back: "Current Ratio = Current Assets / Current Liabilities. Measures short-term liquidity. A ratio > 1 indicates the company can cover short-term obligations.",
    topicId: "financial-reporting",
    subtopicId: "fsa-analysis",
  },
  
  // Corporate Issuers
  {
    id: "corp-001",
    front: "What is the weighted average cost of capital (WACC)?",
    back: "WACC = (E/V × Re) + (D/V × Rd × (1 - Tc)), where E is equity value, D is debt value, V is total value, Re is cost of equity, Rd is cost of debt, and Tc is tax rate.",
    topicId: "corporate-issuers",
    subtopicId: "corp-capital",
  },
  {
    id: "corp-002",
    front: "What is financial leverage?",
    back: "The use of debt to finance assets. Measured by Debt-to-Equity ratio or Debt-to-Assets ratio. Higher leverage increases potential returns but also increases risk.",
    topicId: "corporate-issuers",
    subtopicId: "corp-leverage",
  },
  
  // Equity
  {
    id: "equity-001",
    front: "What is the efficient market hypothesis (EMH)?",
    back: "Theory that asset prices reflect all available information. Three forms: Weak (prices reflect past prices), Semi-strong (prices reflect all public information), Strong (prices reflect all information including private).",
    topicId: "equity",
    subtopicId: "equity-efficiency",
  },
  {
    id: "equity-002",
    front: "What is the dividend discount model (DDM)?",
    back: "V₀ = D₁ / (r - g), where V₀ is stock value, D₁ is expected dividend next period, r is required return, and g is constant growth rate. Assumes dividends grow at constant rate forever.",
    topicId: "equity",
    subtopicId: "equity-models",
  },
  
  // Fixed Income
  {
    id: "fi-001",
    front: "What is the relationship between bond prices and interest rates?",
    back: "Inverse relationship. When interest rates rise, bond prices fall, and vice versa. This is because existing bonds with lower coupon rates become less attractive compared to new bonds with higher rates.",
    topicId: "fixed-income",
    subtopicId: "fi-intro",
  },
  {
    id: "fi-002",
    front: "What is yield to maturity (YTM)?",
    back: "The total return anticipated on a bond if held until maturity. It's the internal rate of return (IRR) of the bond, considering all coupon payments and the face value repayment.",
    topicId: "fixed-income",
    subtopicId: "fi-intro",
  },
  
  // Derivatives
  {
    id: "deriv-001",
    front: "What is a forward contract?",
    back: "A customized agreement between two parties to buy or sell an asset at a specified price on a future date. Traded over-the-counter (OTC), not standardized, and involves counterparty risk.",
    topicId: "derivatives",
    subtopicId: "deriv-intro",
  },
  {
    id: "deriv-002",
    front: "What is a futures contract?",
    back: "A standardized forward contract traded on an exchange. Features include daily settlement (marking to market), margin requirements, and elimination of counterparty risk through the clearinghouse.",
    topicId: "derivatives",
    subtopicId: "deriv-intro",
  },
  
  // Alternative Investments
  {
    id: "alt-001",
    front: "What are the main categories of alternative investments?",
    back: "1) Real Estate - direct ownership, REITs, mortgages. 2) Private Equity - venture capital, buyouts, growth equity. 3) Hedge Funds - various strategies. 4) Commodities - physical goods, futures. 5) Infrastructure - public assets. 6) Other - collectibles, natural resources.",
    topicId: "alternative",
    subtopicId: "alt-categories",
  },
  
  // Portfolio Management
  {
    id: "port-001",
    front: "What is the Capital Asset Pricing Model (CAPM)?",
    back: "E(Ri) = Rf + βi × [E(Rm) - Rf], where E(Ri) is expected return on asset i, Rf is risk-free rate, βi is beta (sensitivity to market), and E(Rm) is expected market return.",
    topicId: "portfolio",
    subtopicId: "port-risk-ii",
  },
  {
    id: "port-002",
    front: "What is beta (β)?",
    back: "A measure of systematic risk. β = 1 means the asset moves with the market. β > 1 means more volatile than market. β < 1 means less volatile than market. β = 0 means no correlation with market.",
    topicId: "portfolio",
    subtopicId: "port-risk-ii",
  },
];

/**
 * Get flashcard by ID
 */
export function getFlashcardById(id: string): Flashcard | undefined {
  return flashcards.find((card) => card.id === id);
}

/**
 * Get flashcards by topic
 */
export function getFlashcardsByTopic(topicId: string): Flashcard[] {
  return flashcards.filter((card) => card.topicId === topicId);
}

/**
 * Get flashcards by subtopic
 */
export function getFlashcardsBySubtopic(subtopicId: string): Flashcard[] {
  return flashcards.filter((card) => card.subtopicId === subtopicId);
}

/**
 * Get all flashcard IDs
 */
export function getAllFlashcardIds(): string[] {
  return flashcards.map((card) => card.id);
}

// Update curriculum with flashcard IDs
curriculum.forEach((topic) => {
  topic.subtopics.forEach((subtopic) => {
    const topicFlashcards = getFlashcardsBySubtopic(subtopic.id);
    subtopic.flashcards = topicFlashcards.map((card) => card.id);
  });
});

