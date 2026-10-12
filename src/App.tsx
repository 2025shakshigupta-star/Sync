/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, PortfolioSummary, HoldingItem } from './types';
import { initialPortfolioSummary, mockHoldings } from './data/mockPortfolio';
import { Navbar } from './components/Navbar';
import { MultiBrokerIngestion } from './components/MultiBrokerIngestion';
import { VisualDashboardRadar } from './components/VisualDashboardRadar';
import { LearningHub } from './components/LearningHub';
import { GoalCompoundingCrashSimulator } from './components/GoalCompoundingCrashSimulator';
import { PayoutMaturityTracker } from './components/PayoutMaturityTracker';
import { ContextualCopilot } from './components/ContextualCopilot';
import { ShieldCheck, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('ingestion');
  const [portfolio, setPortfolio] = useState<PortfolioSummary>(initialPortfolioSummary);
  const [holdings, setHoldings] = useState<HoldingItem[]>(mockHoldings);
  const [isSimulatedRebalance, setIsSimulatedRebalance] = useState(false);

  // When simulated rebalance is turned on from anywhere (Navbar or Tab 2)
  const currentHealthScore = isSimulatedRebalance ? 86 : portfolio.healthScore;

  const handleUploadSimulate = () => {
    // Re-trigger confirmation
    setPortfolio(prev => ({
      ...prev,
      casUploaded: true,
    }));
  };

  const handleSetuToggle = (enabled: boolean) => {
    setPortfolio(prev => ({
      ...prev,
      setuConnected: enabled,
      debtValue: enabled ? 400000 : 0,
      debtPercent: enabled ? 32 : 0,
      totalValue: enabled ? 1250000 : 850000,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col selection:bg-cyan-500/25 selection:text-cyan-200">
      {/* Top Navbar adhering to the top bar contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalPortfolio={portfolio.totalValue}
        diversificationScore={currentHealthScore}
        isSimulatedRebalance={isSimulatedRebalance}
        setIsSimulatedRebalance={setIsSimulatedRebalance}
      />

      {/* Main Viewport Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'ingestion' && (
          <MultiBrokerIngestion
            portfolio={portfolio}
            holdings={holdings}
            onUploadSimulate={handleUploadSimulate}
            onSetuToggle={handleSetuToggle}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'radar' && (
          <VisualDashboardRadar
            isSimulated={isSimulatedRebalance}
            setIsSimulated={setIsSimulatedRebalance}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'learning' && (
          <LearningHub setActiveTab={setActiveTab} />
        )}

        {activeTab === 'simulator' && (
          <GoalCompoundingCrashSimulator />
        )}

        {activeTab === 'payouts' && (
          <PayoutMaturityTracker />
        )}

        {activeTab === 'copilot' && (
          <ContextualCopilot />
        )}
      </main>

      {/* Fintech Trust & Regulatory Disclaimer Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-200">sync</span>
            <span>·</span>
            <span>Retail Portfolio Intelligence & Asset Radar</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              RBI Account Aggregator Ecosystem
            </span>
            <span aria-hidden="true">·</span>
            <span>CDSL / NSDL CAS Compatible</span>
            <span aria-hidden="true">·</span>
            <span>SEBI REIT Regulations 2014</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
