import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Coins, 
  AlertTriangle,
  RotateCw,
  Lock,
  ArrowRight
} from 'lucide-react';
import { PortfolioSummary, HoldingItem, TabType } from '../types';

interface MultiBrokerIngestionProps {
  portfolio: PortfolioSummary;
  holdings: HoldingItem[];
  onUploadSimulate: () => void;
  onSetuToggle: (enabled: boolean) => void;
  setActiveTab: (tab: TabType) => void;
}

export const MultiBrokerIngestion: React.FC<MultiBrokerIngestionProps> = ({
  portfolio,
  holdings,
  onUploadSimulate,
  onSetuToggle,
  setActiveTab,
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(100);
  const [parseStage, setParseStage] = useState('All depository CAS statements parsed successfully');
  const [fileName, setFileName] = useState('CDSL_CAS_Consolidated_Q3_2026.pdf');
  const [isDragOver, setIsDragOver] = useState(false);

  const triggerUploadProcess = () => {
    setIsParsing(true);
    setParseProgress(15);
    setParseStage('Extracting NSDL / CDSL Depository records & PAN hash...');

    setTimeout(() => {
      setParseProgress(45);
      setParseStage('Parsing equities, mutual funds & ISIN holding units...');
    }, 600);

    setTimeout(() => {
      setParseProgress(80);
      setParseStage('Cross-referencing live NSE closing prices & NAVs...');
    }, 1200);

    setTimeout(() => {
      setParseProgress(100);
      setParseStage('100% Ingestion Complete: ₹12,50,000 portfolio indexed.');
      setIsParsing(false);
      onUploadSimulate();
    }, 1800);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner bar matching Screenshot 1 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
              Multi-Broker Ingestion
              <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Sync
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Consolidate Zerodha, Groww, Upstox via depository CAS statements and bank FDs via RBI Account Aggregator.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-slate-300 font-medium">Auto-sync (Setu)</span>
              <button
                type="button"
                role="switch"
                aria-checked={portfolio.setuConnected}
                onClick={() => onSetuToggle(!portfolio.setuConnected)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  portfolio.setuConnected ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    portfolio.setuConnected ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={triggerUploadProcess}
              disabled={isParsing}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 hover:bg-white text-slate-900 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload CAS PDF
            </button>
          </div>
        </div>

        {/* Sync Connectors status Strip (CDSL/NSDL & Setu Sandbox) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-rose-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">CDSL / NSDL CAS</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Connected (eCAS verified)
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">Setu AA Gateway</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> RBI Compliant / Connected
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">256-Bit Vault</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Zero credentials stored</div>
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">Active Valuation</div>
              <div className="text-[11px] font-mono text-cyan-400 font-semibold mt-0.5">₹12,50,000 Live</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload Dropzone & Portfolio Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dropzone and Parser (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); triggerUploadProcess(); }}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all bg-slate-900/40 ${
              isDragOver 
                ? 'border-cyan-400 bg-cyan-950/20' 
                : 'border-slate-700/80 hover:border-slate-600'
            }`}
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Drop your monthly CAS Statement PDF here
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Supports CAMS / KFintech Consolidated Account Statements (CAS) or individual Zerodha / Groww tax P&L summaries.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={triggerUploadProcess}
                disabled={isParsing}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                {isParsing ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    Parsing Statement...
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    Simulate Upload Demo CAS PDF
                  </>
                )}
              </button>
              <span className="text-xs text-slate-500">or drop your file</span>
            </div>

            {/* Parsing Progress Indicator */}
            {isParsing && (
              <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-medium flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    {parseStage}
                  </span>
                  <span className="font-mono text-slate-300">{parseProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${parseProgress}%` }}
                  />
                </div>
              </div>
            )}

            {!isParsing && (
              <div className="mt-4 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Current Active File: <span className="text-slate-200 font-mono">{fileName}</span>
              </div>
            )}
          </div>

          {/* Itemized Holdings List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Parsed Ingested Instruments</h3>
              <span className="text-xs text-slate-400 font-mono">{holdings.length} Positions</span>
            </div>
            
            <div className="divide-y divide-slate-800/80">
              {holdings.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-200 truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="text-cyan-400 font-mono">{item.ticker}</span>
                      <span>·</span>
                      <span>{item.source}</span>
                      <span>·</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-semibold text-slate-100">{formatCurrency(item.totalValue)}</div>
                    <div className="text-[11px] font-mono text-slate-400">{item.allocationPercent.toFixed(1)}% portfolio</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ingested Portfolio Value Summary Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ingested Portfolio Total
            </div>
            <div className="text-3xl font-extrabold text-white font-mono mt-1 tracking-tight">
              {formatCurrency(portfolio.totalValue)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              ₹12.50 Lakhs indexed across depository & banking accounts.
            </div>

            {/* Asset Breakdown Strip */}
            <div className="mt-6 space-y-3">
              {/* Equities */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                    Equities & Small-Cap MFs
                  </span>
                  <span className="font-mono font-bold text-cyan-300">
                    {formatCurrency(portfolio.equitiesValue)} ({portfolio.equitiesPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/60 rounded-full h-1.5">
                  <div 
                    className="bg-cyan-400 h-1.5 rounded-full" 
                    style={{ width: `${portfolio.equitiesPercent}%` }} 
                  />
                </div>
              </div>

              {/* Debt / FDs */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                    Fixed Deposits (Setu AA)
                  </span>
                  <span className="font-mono font-bold text-emerald-300">
                    {formatCurrency(portfolio.debtValue)} ({portfolio.debtPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/60 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-400 h-1.5 rounded-full" 
                    style={{ width: `${portfolio.debtPercent}%` }} 
                  />
                </div>
              </div>

              {/* REITs & InvITs (Zero / Blind Spot) */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-rose-300 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Alternative Yield (REITs & InvITs)
                  </span>
                  <span className="font-mono font-bold text-rose-400">
                    ₹0 (0.0%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/60 rounded-full h-1.5">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '0%' }} />
                </div>
                <p className="text-[11px] text-rose-300/80 mt-1.5">
                  Critical gap: Zero real-estate backed quarterly yield or inflation-hedged dividends.
                </p>
              </div>
            </div>

            {/* Action link to Tab 2 */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Health Score: <span className="text-rose-400 font-bold font-mono">58/100</span>
              </div>
              <button
                onClick={() => setActiveTab('radar')}
                className="px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg flex items-center gap-1 transition-all"
              >
                Inspect Asset Radar
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Setu AA Compliance Details Card */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Setu Account Aggregator Framework
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Consents are managed under RBI guidelines. Data is end-to-end encrypted with zero screen-scraping and revocable at any moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
