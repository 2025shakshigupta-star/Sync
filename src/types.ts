export type TabType = 
  | 'ingestion' 
  | 'radar' 
  | 'learning' 
  | 'simulator' 
  | 'payouts' 
  | 'copilot';

export interface HoldingItem {
  id: string;
  name: string;
  ticker: string;
  category: 'Equity' | 'Debt' | 'REIT' | 'InvIT' | 'Gold';
  source: 'Zerodha Kite' | 'Groww CAS' | 'HDFC Bank' | 'ICICI Bank' | 'NSE';
  units: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  allocationPercent: number;
}

export interface PortfolioSummary {
  totalValue: number;
  equitiesValue: number;
  equitiesPercent: number;
  debtValue: number;
  debtPercent: number;
  reitsValue: number;
  reitsPercent: number;
  invitsValue: number;
  invitsPercent: number;
  goldValue: number;
  goldPercent: number;
  healthScore: number;
  healthStatus: string;
  casUploaded: boolean;
  setuConnected: boolean;
}

export interface CashflowEvent {
  id: string;
  title: string;
  asset: string;
  category: 'REIT' | 'FD' | 'Dividend';
  amount: number;
  dateStr: string;
  monthIndex: number; // 0 to 11
  status: 'Upcoming' | 'Completed' | 'Processing';
  details: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type CopilotLanguage = 'en' | 'hi' | 'mr';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  lang?: CopilotLanguage;
  badge?: string;
}
