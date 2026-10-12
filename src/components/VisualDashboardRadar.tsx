import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Sparkles, 
  ShieldCheck, 
  Info, 
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { TabType } from '../types';

interface VisualDashboardRadarProps {
  isSimulated: boolean;
  setIsSimulated: (val: boolean) => void;
  setActiveTab: (tab: TabType) => void;
}

export const VisualDashboardRadar: React.FC<VisualDashboardRadarProps> = ({
  isSimulated,
  setIsSimulated,
  setActiveTab,
}) => {
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);

  // 5 axes: Equities, Debt, REITs, InvITs, Gold
  const axes = [
    { key: 'Equities', label: 'Equities', current: 68, recommended: 50, desc: 'Large/Mid/Small cap stocks & active mutual funds' },
    { key: 'Debt', label: 'Debt / FDs', current: 32, recommended: 20, desc: 'Bank Fixed Deposits & sovereign debt' },
    { key: 'REITs', label: 'REITs', current: 0, recommended: 18, desc: 'Commercial real estate office & retail trusts' },
    { key: 'InvITs', label: 'InvITs', current: 0, recommended: 7, desc: 'Power transmission & highway infrastructure yields' },
    { key: 'Gold', label: 'Gold', current: 0, recommended: 5, desc: 'Sovereign Gold Bonds & physical bullion hedge' },
  ];

  const currentScore = isSimulated ? 86 : 58;
  const healthLabel = isSimulated
    ? 'Well Diversified - Resilient Defensive Shield'
    : 'Unbalanced - Overexposed to Equity Volatility';

  // Radar geometry
  const size = 320;
  const center = size / 2;
  const radius = 100;
  const totalAxes = axes.length;

  const getCoordinates = (value: number, index: number) => {
    // scale value (0 to 100)
    const factor = (value / 100) * radius;
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const x = center + factor * Math.cos(angle);
    const y = center + factor * Math.sin(angle);
    return { x, y };
  };

  const currentPoints = axes.map((a, i) => {
    const val = isSimulated ? a.recommended : a.current;
    const { x, y } = getCoordinates(val, i);
    return `${x},${y}`;
  }).join(' ');

  const recommendedPoints = axes.map((a, i) => {
    const { x, y } = getCoordinates(a.recommended, i);
    return `${x},${y}`;
  }).join(' ');

  // Circular gauge arc calculations
  // Arc angle from 180 to 0 (half circle)
  const gaugeRadius = 75;
  const gaugeCircumference = Math.PI * gaugeRadius;
  const gaugeOffset = gaugeCircumference - (currentScore / 100) * gaugeCircumference;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Visual Dashboard & Asset Radar
              </h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                isSimulated 
                  ? 'bg-emerald-950/70 border border-emerald-800/80 text-emerald-300'
                  : 'bg-amber-950/70 border border-amber-800/80 text-amber-300'
              }`}>
                {isSimulated ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" /> Optimal Balance
                  </>
                ) : (
                  <>
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> Gap Alert: Overexposed
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-dimensional asset dispersion health score and 5-axis allocation radar web.
            </p>
          </div>

          {/* Interactive Simulation Switch */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-200">
                {isSimulated ? 'REIT Hedging Active' : 'Simulate 18% REIT Hedge'}
              </div>
              <div className="text-[11px] text-slate-400">
                {isSimulated ? 'Score boosted to 86/100' : 'Fix 0% alternative yield gap'}
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isSimulated}
              onClick={() => setIsSimulated(!isSimulated)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isSimulated ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isSimulated ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Gauge, Spider Web Radar, and Allocation Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gauge Card (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">Diversification Score</h2>
              <span className="text-[11px] text-slate-400 font-mono">SEBI Risk-Model</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Asset class balance & drawdown resistance index</p>

            {/* Circular Gauge Graphic */}
            <div className="relative flex flex-col items-center justify-center my-6">
              <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
                {/* Background Half Arc */}
                <path
                  d="M 25 105 A 75 75 0 0 1 175 105"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Colored Gauge Indicator Arc */}
                <path
                  d="M 25 105 A 75 75 0 0 1 175 105"
                  fill="none"
                  stroke={currentScore >= 80 ? 'url(#gaugeGradGreen)' : 'url(#gaugeGradCoral)'}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={gaugeCircumference}
                  strokeDashoffset={gaugeOffset}
                  className="transition-all duration-700 ease-out"
                />
                {/* Gradients */}
                <defs>
                  <linearGradient id="gaugeGradCoral" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="70%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                  <linearGradient id="gaugeGradGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Score Display */}
              <div className="absolute bottom-2 flex flex-col items-center">
                <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                  {currentScore}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                  out of 100
                </span>
              </div>
            </div>

            {/* Health Status Callout */}
            <div className={`p-3 rounded-xl border text-center transition-all ${
              currentScore >= 80
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/30 border-rose-900/50 text-rose-300'
            }`}>
              <div className="text-xs font-bold">{healthLabel}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {currentScore >= 80 
                  ? 'Includes commercial rental yield & inflation-linked distributions'
                  : 'High concentration in equities creates -38% downside risk'}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 text-center">
            <button
              onClick={() => setIsSimulated(!isSimulated)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {isSimulated ? 'Revert to Uploaded CAS' : 'View Recommended 86-Score Portfolio'}
            </button>
          </div>
        </div>

        {/* 5-Axis Spider Web Radar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">Asset Dispersion Radar</h2>
                <p className="text-xs text-slate-400">Interactive 5-Axis Spider Web allocation</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1">
                  <span className={`w-2.5 h-2.5 rounded-sm ${isSimulated ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <span className="text-slate-300">{isSimulated ? 'Simulated' : 'Current'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400/50 border border-dashed border-cyan-400" />
                  <span className="text-slate-400">Benchmark</span>
                </div>
              </div>
            </div>

            {/* SVG Spider Chart */}
            <div className="flex items-center justify-center py-2">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                {/* Concentric grid webs */}
                {[0.25, 0.5, 0.75, 1.0].map((level, lvlIdx) => {
                  const gridPts = axes.map((_, i) => {
                    const factor = level * radius;
                    const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                    const x = center + factor * Math.cos(angle);
                    const y = center + factor * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={lvlIdx}
                      points={gridPts}
                      fill="none"
                      stroke="#1E293B"
                      strokeWidth="1"
                      strokeDasharray={lvlIdx === 3 ? 'none' : '2,2'}
                    />
                  );
                })}

                {/* Axis lines from center to outer edge */}
                {axes.map((_, i) => {
                  const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                  const x = center + radius * Math.cos(angle);
                  const y = center + radius * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke="#334155"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Benchmark Polygon (Dashed Cyan) */}
                <polygon
                  points={recommendedPoints}
                  fill="rgba(6, 182, 212, 0.08)"
                  stroke="#06B6D4"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                />

                {/* Current / Active Polygon */}
                <polygon
                  points={currentPoints}
                  fill={isSimulated ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}
                  stroke={isSimulated ? '#10B981' : '#F43F5E'}
                  strokeWidth="2.5"
                  className="transition-all duration-500"
                />

                {/* Axis Labels & Interactive Nodes */}
                {axes.map((axis, i) => {
                  const val = isSimulated ? axis.recommended : axis.current;
                  const { x, y } = getCoordinates(val, i);
                  
                  // Label coordinates slightly beyond radius
                  const labelRadius = radius + 26;
                  const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                  const lx = center + labelRadius * Math.cos(angle);
                  const ly = center + labelRadius * Math.sin(angle);

                  return (
                    <g key={axis.key} className="cursor-pointer" onMouseEnter={() => setHoveredAxis(axis.key)} onMouseLeave={() => setHoveredAxis(null)}>
                      {/* Active data point circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={hoveredAxis === axis.key ? 6 : 4}
                        fill={isSimulated ? '#34D399' : '#FB7185'}
                        stroke="#0F172A"
                        strokeWidth="2"
                        className="transition-all duration-200"
                      />

                      {/* Text Label */}
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[11px] font-medium fill-slate-300 hover:fill-cyan-300 transition-colors"
                      >
                        {axis.label}
                      </text>
                      <text
                        x={lx}
                        y={ly + 11}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[10px] font-mono font-bold fill-slate-400"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Interactive Axis Inspector Pill */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs">
            {hoveredAxis ? (
              <div>
                <span className="font-semibold text-cyan-300">{hoveredAxis}: </span>
                <span className="text-slate-300">
                  {axes.find(a => a.key === hoveredAxis)?.desc}
                </span>
              </div>
            ) : (
              <div className="text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                Hover any radar axis or toggle simulation above to inspect weight distribution.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Blind Spot Alert & Asset Weights (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Blind Spot Detected Alert Card */}
          <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-900/60 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              Blind Spot Detected
            </div>
            <h3 className="text-sm font-bold text-white mt-1">
              0% Alternative Yield Assets
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Your portfolio has zero exposure to Commercial REITs or InvITs. You are dependent 100% on market beta capital appreciation rather than contracted contractual rental yield.
            </p>
            <div className="mt-4 pt-3 border-t border-rose-900/40 flex items-center justify-between text-xs">
              <span className="text-slate-400">Recommended Allocation:</span>
              <span className="text-emerald-400 font-mono font-bold">15% – 20%</span>
            </div>
          </div>

          {/* Asset Weight Bars matching screenshot 6 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Current Asset Mix</h3>
              <Percent className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {axes.map((axis) => {
              const val = isSimulated ? axis.recommended : axis.current;
              const isOver = val > axis.recommended + 10;
              const isZero = val === 0;

              return (
                <div key={axis.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{axis.label}</span>
                    <span className={`font-mono font-bold ${
                      isZero ? 'text-rose-400' : isOver ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {val}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isZero 
                          ? 'bg-rose-500 w-0' 
                          : isOver 
                            ? 'bg-gradient-to-r from-cyan-400 to-amber-400' 
                            : 'bg-emerald-400'
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('learning')}
                className="w-full py-2 text-xs font-semibold rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 hover:text-white hover:bg-cyan-900/60 flex items-center justify-center gap-1.5 transition-all"
              >
                Learn How REITs Bridge This Gap
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
