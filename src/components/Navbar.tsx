import React from 'react';
import { TabType } from '../types';
import { 
  UploadCloud, 
  Radar, 
  BookOpen, 
  TrendingDown, 
  CalendarClock, 
  MessageSquareCode, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  totalPortfolio: number;
  diversificationScore: number;
  isSimulatedRebalance: boolean;
  setIsSimulatedRebalance: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalPortfolio,
  diversificationScore,
  isSimulatedRebalance,
  setIsSimulatedRebalance,
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'ingestion', label: '1. Ingestion & CAS', icon: UploadCloud },
    { id: 'radar', label: '2. Asset Radar', icon: Radar },
    { id: 'learning', label: '3. Learning Hub', icon: BookOpen },
    { id: 'simulator', label: '4. Crash Simulator', icon: TrendingDown },
    { id: 'payouts', label: '5. Payout Tracker', icon: CalendarClock },
    { id: 'copilot', label: '6. AI Copilot', icon: MessageSquareCode },
  ];

  const formatLakhs = (val: number) => {
    return `₹${(val / 100000).toFixed(2)}L`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Radar className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                sync
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                  Portfolio Intelligence
                </span>
              </span>
            </div>
          </div>

          {/* Center Quick Portfolio Pill */}
          <div className="hidden md:flex items-center gap-4 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Ingested Portfolio:</span>
              <span className="font-semibold text-slate-100 font-mono">{formatLakhs(totalPortfolio)}</span>
            </div>
            <span className="text-slate-700" aria-hidden="true">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Health:</span>
              <span className={`font-mono font-semibold ${
                diversificationScore < 60 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {diversificationScore}/100
              </span>
              {diversificationScore < 60 ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
          </div>

          {/* Right Action / Rebalance Mode Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSimulatedRebalance(!isSimulatedRebalance)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
                isSimulatedRebalance
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Toggle simulated REIT rebalancing model"
            >
              <span className={`w-2 h-2 rounded-full ${isSimulatedRebalance ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {isSimulatedRebalance ? 'Simulated REIT Mix (86/100)' : 'Current Portfolio (58/100)'}
            </button>
          </div>
        </div>

        {/* Modular Navigation Tabs (Responsive Scrollable) */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1.5 border-t border-slate-800/40 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
