import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Award, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  Scale
} from 'lucide-react';
import { quizQuestions } from '../data/mockPortfolio';
import { TabType } from '../types';

interface LearningHubProps {
  setActiveTab: (tab: TabType) => void;
}

export const LearningHub: React.FC<LearningHubProps> = ({ setActiveTab }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    const updated = { ...selectedAnswers, [questionId]: optionIndex };
    setSelectedAnswers(updated);
    setShowExplanations({ ...showExplanations, [questionId]: true });

    // Calculate score if all questions answered
    if (Object.keys(updated).length === quizQuestions.length) {
      let score = 0;
      quizQuestions.forEach(q => {
        if (updated[q.id] === q.correctIndex) {
          score += 1;
        }
      });
      setQuizScore(score);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanations({});
    setQuizScore(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Interactive Learning Hub
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-300">
                Asset Intelligence Masterclass
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Demystifying Commercial REITs vs. high-volatility retail equity positions.
            </p>
          </div>

          <a
            href="#quiz-section"
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
          >
            <HelpCircle className="w-4 h-4" />
            Take 1-Minute Quiz
          </a>
        </div>
      </div>

      {/* Comparative Asset Card: Mid-Cap Stock vs Commercial REIT */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              Side-by-Side Instrument Architecture
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Your Mid-Cap Growth Stock vs. Commercial REIT
            </h2>
          </div>
          <div className="hidden sm:block text-xs text-slate-400">
            Compare risk-adjusted profile & payout predictability
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: High Volatility Mid-Cap Stock */}
          <div className="bg-slate-950/70 border border-rose-900/40 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> High Risk / Equity Beta
                </span>
                <span className="text-xs font-mono bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-800/60">
                  e.g., Persistent / Tata Motors
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-2">
                High-Volatility Mid-Cap Stock
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Typical growth stock in standard retail CAS demat portfolios.
              </p>

              {/* Metrics Table */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Target Return Profile</span>
                  <span className="text-slate-200 font-semibold font-mono text-right">
                    ~14.0% annualized (high swings)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Beta / Market Sensitivity</span>
                  <span className="text-rose-400 font-semibold font-mono text-right">
                    1.35x (Amplifies market crashes)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Cash Flow Cadence</span>
                  <span className="text-slate-300 font-mono text-right">
                    Irregular (0.5% – 1.2% dividend)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Asset Backing</span>
                  <span className="text-slate-300 text-right">
                    Operational earnings & multiples
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Peak Historical Drawdown</span>
                  <span className="text-rose-400 font-bold font-mono text-right">
                    -38% to -52% (COVID/2022)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900 text-[11px] text-slate-400">
              Ideal for long-term growth, but introduces severe sequencing risk without a cash buffer.
            </div>
          </div>

          {/* Card 2: Commercial REIT */}
          <div className="bg-slate-950/70 border border-cyan-800/60 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> Alternative Yield / Hedging
                </span>
                <span className="text-xs font-mono bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/60">
                  e.g., Embassy / Mindspace
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-2">
                Commercial Real Estate Trust (REIT)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Backed by Grade-A office campuses leased to multinational blue-chips.
              </p>

              {/* Metrics Table */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Target Return Profile</span>
                  <span className="text-emerald-400 font-semibold font-mono text-right">
                    7.5% cash yield + 5-7% cap growth (~13.5% total)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Beta / Market Sensitivity</span>
                  <span className="text-emerald-400 font-semibold font-mono text-right">
                    0.42x (Low correlation to stock panic)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Cash Flow Cadence</span>
                  <span className="text-cyan-300 font-bold font-mono text-right">
                    Mandatory 90% payout quarterly
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Asset Backing</span>
                  <span className="text-slate-200 text-right">
                    Physical IT Parks (Google, J.P. Morgan leases)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Peak Historical Drawdown</span>
                  <span className="text-emerald-400 font-bold font-mono text-right">
                    -14% (Rapid quarterly recovery)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900 text-[11px] text-cyan-300/80">
              Contracted 5–9 year commercial leases with 15% escalation clauses ensure inflation-beating yields.
            </div>
          </div>
        </div>
      </div>

      {/* 1-Minute Interactive Quiz Section */}
      <div id="quiz-section" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              1-Minute Knowledge Check
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Test Your REIT Yields & Liquidity Expertise
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {quizScore !== null && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full border font-mono ${
                quizScore === quizQuestions.length
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/80 border-amber-800 text-amber-300'
              }`}>
                Score: {quizScore}/{quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
              </span>
            )}
            <button
              onClick={handleResetQuiz}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-800"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {quizQuestions.map((q, qIndex) => {
            const selected = selectedAnswers[q.id];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === q.correctIndex;

            return (
              <div key={q.id} className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <div className="font-semibold text-slate-100 text-sm leading-snug">
                    {q.question}
                  </div>
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 pl-9">
                  {q.options.map((opt, optIndex) => {
                    const isOptionSelected = selected === optIndex;
                    const isOptionCorrect = optIndex === q.correctIndex;

                    let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850';
                    
                    if (isAnswered) {
                      if (isOptionCorrect) {
                        btnStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-200 font-semibold shadow-sm';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        btnStyle = 'bg-rose-950/60 border-rose-600 text-rose-200';
                      } else {
                        btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                        disabled={isAnswered}
                        className={`p-3 text-xs text-left rounded-lg border transition-all flex items-start gap-2.5 ${btnStyle}`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {isAnswered && isOptionCorrect && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          {isAnswered && isOptionSelected && !isOptionCorrect && (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          {(!isAnswered || (!isOptionCorrect && !isOptionSelected)) && (
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block text-[10px] text-center leading-3">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                          )}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Green/Red Feedback & Explanation */}
                {isAnswered && (
                  <div className={`mt-3 ml-9 p-3 rounded-lg text-xs border ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-900/70 text-rose-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          Correct! Regulatory Insight Verified
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          Incorrect Selection
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Next Step CTA */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Ready to test how adding REITs protects against market drawdowns?
          </div>
          <button
            onClick={() => setActiveTab('simulator')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            Launch Crash Simulator (Tab 4)
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
