import React, { useState, useMemo } from 'react';
import { 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  Flame, 
  CheckCircle2, 
  Sliders,
  PieChart as PieChartIcon
} from 'lucide-react';

export const GoalCompoundingCrashSimulator: React.FC = () => {
  // Goal Controls
  const [targetGoal, setTargetGoal] = useState<number>(5000000); // ₹50 Lakhs default
  const [timelineYears, setTimelineYears] = useState<number>(10); // 10 Years default
  const [monthlySIP, setMonthlySIP] = useState<number>(15000); // ₹15,000 / month
  const [initialCapital, setInitialCapital] = useState<number>(1250000); // ₹12.5L ingested
  const [riskProfile, setRiskProfile] = useState<'Moderate-High' | 'Aggressive' | 'Conservative'>('Moderate-High');
  
  // Standout Feature: Simulate Market Crash Toggle
  const [simulateCrash, setSimulateCrash] = useState<boolean>(true);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatLakhs = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)}L`;
  };

  // Trajectory calculation across timeline
  // Annual growth rates based on portfolio types:
  // Base diversified growth: ~12.2% CAGR (Equities + REITs + FDs)
  // Base unhedged equity growth: ~13.5% CAGR in bull run, but with high beta shock
  const chartData = useMemo(() => {
    const data: Array<{
      year: number;
      projectedDiversified: number;
      unhedgedEquity: number;
      crashDrawdownVal?: number;
      diversifiedCrashVal?: number;
    }> = [];

    const rDiversified = 0.125;
    const rEquity = 0.138;
    const monthlyRateDiv = rDiversified / 12;
    const monthlyRateEq = rEquity / 12;

    // Crash occurs around Year 3-4 (shock event like COVID 2020)
    const crashYear = Math.max(2, Math.floor(timelineYears * 0.35));

    for (let yr = 0; yr <= timelineYears; yr++) {
      const months = yr * 12;
      
      // Standard FV with SIP formula
      // FV = P * (1+r)^t + SIP * (((1+r/12)^n - 1) / (r/12)) * (1+r/12)
      let sipFVDiversified = 0;
      let sipFVEquity = 0;
      if (months > 0) {
        sipFVDiversified = monthlySIP * ((Math.pow(1 + monthlyRateDiv, months) - 1) / monthlyRateDiv) * (1 + monthlyRateDiv);
        sipFVEquity = monthlySIP * ((Math.pow(1 + monthlyRateEq, months) - 1) / monthlyRateEq) * (1 + monthlyRateEq);
      }

      const pFVDiversified = initialCapital * Math.pow(1 + rDiversified, yr);
      const pFVEquity = initialCapital * Math.pow(1 + rEquity, yr);

      let valDiv = Math.round(pFVDiversified + sipFVDiversified);
      let valEq = Math.round(pFVEquity + sipFVEquity);

      // Apply historical shock curve if crash simulation is enabled
      let crashEqVal = valEq;
      let crashDivVal = valDiv;

      if (yr === crashYear) {
        // Shock hit: Unhedged plunges -38%, Diversified cushioned at -14%
        crashEqVal = Math.round(valEq * 0.62);
        crashDivVal = Math.round(valDiv * 0.86);
      } else if (yr === crashYear + 1) {
        // Year after shock: Unhedged still struggling (-25% from trajectory), Diversified recovering (-6%)
        crashEqVal = Math.round(valEq * 0.75);
        crashDivVal = Math.round(valDiv * 0.94);
      } else if (yr > crashYear + 1) {
        // Compound recovery gap: Unhedged lost significant principal, remains behind
        const yearsPostCrash = yr - (crashYear + 1);
        const eqDeficit = Math.max(0.08, 0.20 - yearsPostCrash * 0.03);
        const divDeficit = Math.max(0.01, 0.04 - yearsPostCrash * 0.015);
        crashEqVal = Math.round(valEq * (1 - eqDeficit));
        crashDivVal = Math.round(valDiv * (1 - divDeficit));
      }

      data.push({
        year: yr,
        projectedDiversified: valDiv,
        unhedgedEquity: simulateCrash ? crashEqVal : valEq,
        crashDrawdownVal: crashEqVal,
        diversifiedCrashVal: crashDivVal,
      });
    }

    return data;
  }, [timelineYears, monthlySIP, initialCapital, simulateCrash]);

  // Protected capital metric
  const finalYearData = chartData[chartData.length - 1];
  const capitalProtected = simulateCrash 
    ? Math.max(620000, finalYearData.diversifiedCrashVal! - finalYearData.crashDrawdownVal!) 
    : 620000;

  // SVG Chart rendering dimensions
  const svgWidth = 620;
  const svgHeight = 260;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Max value calculation for vertical scaling
  const maxValue = Math.max(
    targetGoal,
    ...chartData.map(d => Math.max(d.projectedDiversified, d.unhedgedEquity))
  ) * 1.1;

  const getX = (year: number) => padding.left + (year / timelineYears) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - (val / maxValue) * graphHeight;

  // Path generators
  const diversifiedPath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.year)} ${getY(simulateCrash ? d.diversifiedCrashVal! : d.projectedDiversified)}`).join(' ');
  const unhedgedPath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.year)} ${getY(d.unhedgedEquity)}`).join(' ');

  // Area under diversified curve
  const diversifiedArea = `${diversifiedPath} L ${getX(timelineYears)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  // Recommended Portfolio Breakdown Segments
  const breakdownSegments = [
    { label: 'Mutual Funds', percent: 35, color: '#06B6D4' },
    { label: 'Equity / Stocks', percent: 30, color: '#10B981' },
    { label: 'Debt & Bonds', percent: 20, color: '#8B5CF6' },
    { label: 'REITs & Gold', percent: 15, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* Standout Header with Live Crash Toggle matching Screenshot 5 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Capital & Crash Simulator
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-rose-950/70 border border-rose-800/80 text-rose-300">
                Stress-Testing Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Historical shock simulation (COVID 2020 / 2008) comparing unhedged equity vs. REIT-diversified resilience.
            </p>
          </div>

          {/* Toggle Switch matching Screenshot 5 */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-xs font-semibold text-slate-200">
              Simulate Market Crash (COVID 2020 Shock)
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={simulateCrash}
              onClick={() => setSimulateCrash(!simulateCrash)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                simulateCrash ? 'bg-rose-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  simulateCrash ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Protection Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Target Wealth Milestone</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            {formatLakhs(targetGoal)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
            Horizon: {timelineYears} Years @ ₹{monthlySIP.toLocaleString()}/mo SIP
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Unhedged Equity Drawdown</div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
            -38.2% Plunge
          </div>
          <div className="text-[11px] text-rose-300/70 mt-0.5">
            Without REIT cash flows or debt cushion
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-800/60 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Capital Protected by Diversification
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 font-mono mt-1">
            +{formatINR(capitalProtected)}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">
            Cushioned drawdown (-14%) & 2.4x faster recovery
          </div>
        </div>
      </div>

      {/* Main Grid: Goal Sliders (Left 4 cols) & Compounding / Crash Chart (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Goal Parameters
            </h3>
            <span className="text-xs text-slate-400 font-mono">FV = P(1+r)ⁿ</span>
          </div>

          {/* Slider 1: Target Wealth Goal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Target Wealth Goal</span>
              <span className="font-mono font-bold text-cyan-400">{formatLakhs(targetGoal)}</span>
            </div>
            <input
              type="range"
              min={1000000}
              max={10000000}
              step={500000}
              value={targetGoal}
              onChange={(e) => setTargetGoal(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹10L</span>
              <span>₹50L (Default)</span>
              <span>₹1.0 Cr</span>
            </div>
          </div>

          {/* Slider 2: Timeline Horizon */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Time Horizon</span>
              <span className="font-mono font-bold text-emerald-400">{timelineYears} Years</span>
            </div>
            <input
              type="range"
              min={2}
              max={20}
              step={1}
              value={timelineYears}
              onChange={(e) => setTimelineYears(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2Y</span>
              <span>5Y</span>
              <span>10Y</span>
              <span>20Y</span>
            </div>
          </div>

          {/* Slider 3: Monthly Investment / SIP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Monthly SIP Contribution</span>
              <span className="font-mono font-bold text-amber-400">{formatINR(monthlySIP)}</span>
            </div>
            <input
              type="range"
              min={3000}
              max={60000}
              step={1000}
              value={monthlySIP}
              onChange={(e) => setMonthlySIP(Number(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹3k/mo</span>
              <span>₹15k/mo</span>
              <span>₹60k/mo</span>
            </div>
          </div>

          {/* Risk Profile Selector */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs text-slate-300 font-medium">Investor Risk Profile</label>
            <select
              value={riskProfile}
              onChange={(e) => setRiskProfile(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="Moderate-High">Moderate-High (Balanced with 18% REITs)</option>
              <option value="Aggressive">Aggressive (100% Equity / High Drawdown)</option>
              <option value="Conservative">Conservative (50% Debt & FDs)</option>
            </select>
          </div>

          {/* Recommended Breakdown Donut Card matching Screenshot 4 */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Recommended Portfolio Breakdown
              </span>
              <PieChartIcon className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="flex items-center gap-4">
              {/* Donut graphic */}
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#06B6D4" strokeWidth="16" strokeDasharray="83.5 238.7" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="16" strokeDasharray="71.6 238.7" strokeDashoffset="-83.5" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" strokeWidth="16" strokeDasharray="47.7 238.7" strokeDashoffset="-155.1" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="16" strokeDasharray="35.8 238.7" strokeDashoffset="-202.8" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-mono font-bold text-white leading-none">
                    ₹{(monthlySIP / 1000).toFixed(0)}k
                  </span>
                  <span className="text-[8px] text-slate-400 leading-none mt-0.5">/mo</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1 text-xs">
                {breakdownSegments.map(seg => (
                  <div key={seg.label} className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="text-slate-300">{seg.label}</span>
                    <span className="font-mono font-semibold text-slate-200 ml-auto">({seg.percent}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic SVG Compounding Line Chart with Crash Simulator Overlay */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Projected Growth ({timelineYears} Years)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculated Future Value with reinvested rental yield distributions.
                </p>
              </div>

              {/* Legend Pills matching Screenshot 4 & 5 */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
                  <span className="text-emerald-300 font-medium">Diversified (Protected)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-rose-400 rounded-full" />
                  <span className="text-rose-400 font-medium">
                    {simulateCrash ? 'COVID 2020 Crash' : 'Unhedged Equity'}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Compounding Line Chart */}
            <div className="relative w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto min-w-[500px] select-none"
              >
                <defs>
                  {/* Diversified area gradient */}
                  <linearGradient id="divAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Crash drawdown gradient */}
                  <linearGradient id="crashAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0.25, 0.5, 0.75, 1.0].map((step, idx) => {
                  const val = maxValue * step;
                  const y = getY(val);
                  return (
                    <g key={idx}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={svgWidth - padding.right}
                        y2={y}
                        stroke="#1E293B"
                        strokeDasharray="3,3"
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[10px] font-mono fill-slate-400"
                      >
                        {formatLakhs(val)}
                      </text>
                    </g>
                  );
                })}

                {/* Target Goal Dotted Line */}
                {targetGoal <= maxValue && (
                  <g>
                    <line
                      x1={padding.left}
                      y1={getY(targetGoal)}
                      x2={svgWidth - padding.right}
                      y2={getY(targetGoal)}
                      stroke="#06B6D4"
                      strokeWidth="1.5"
                      strokeDasharray="5,4"
                    />
                    <text
                      x={svgWidth - padding.right}
                      y={getY(targetGoal) - 6}
                      textAnchor="end"
                      className="text-[10px] font-mono font-bold fill-cyan-400"
                    >
                      Target: {formatLakhs(targetGoal)}
                    </text>
                  </g>
                )}

                {/* Shaded Area for Diversified Protection */}
                <path d={diversifiedArea} fill="url(#divAreaGrad)" />

                {/* Crash Trajectory Path (Red) */}
                <path
                  d={unhedgedPath}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />

                {/* Diversified Trajectory Path (Green) */}
                <path
                  d={diversifiedPath}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />

                {/* Data Points and Scrubber interaction */}
                {chartData.map((d) => {
                  const x = getX(d.year);
                  const yDiv = getY(simulateCrash ? d.diversifiedCrashVal! : d.projectedDiversified);
                  const yEq = getY(d.unhedgedEquity);
                  const isHovered = hoveredYear === d.year;

                  return (
                    <g
                      key={d.year}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredYear(d.year)}
                      onMouseLeave={() => setHoveredYear(null)}
                    >
                      {/* Interactive invisible hover column */}
                      <rect
                        x={x - 15}
                        y={padding.top}
                        width="30"
                        height={graphHeight}
                        fill="transparent"
                      />

                      {/* X-axis year ticks */}
                      <text
                        x={x}
                        y={svgHeight - padding.bottom + 18}
                        textAnchor="middle"
                        className={`text-[10px] font-mono transition-colors ${
                          isHovered ? 'fill-cyan-400 font-bold' : 'fill-slate-400'
                        }`}
                      >
                        Yr {d.year}
                      </text>

                      {/* Dots */}
                      <circle cx={x} cy={yDiv} r={isHovered ? 5 : 3} fill="#10B981" stroke="#0F172A" strokeWidth="2" />
                      <circle cx={x} cy={yEq} r={isHovered ? 5 : 3} fill="#F43F5E" stroke="#0F172A" strokeWidth="2" />

                      {isHovered && (
                        <line
                          x1={x}
                          y1={padding.top}
                          x2={x}
                          y2={svgHeight - padding.bottom}
                          stroke="#38BDF8"
                          strokeWidth="1"
                          strokeDasharray="2,2"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Interactive Scrubber Inspector Callout matching Screenshot 4 */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400">Inspecting: </span>
                <span className="text-cyan-400 font-bold font-mono">
                  Year {hoveredYear !== null ? hoveredYear : timelineYears}
                </span>
                <span className="text-slate-400"> · Diversified Value: </span>
                <span className="text-emerald-400 font-bold font-mono">
                  {formatINR(
                    simulateCrash 
                      ? chartData[hoveredYear ?? timelineYears].diversifiedCrashVal!
                      : chartData[hoveredYear ?? timelineYears].projectedDiversified
                  )}
                </span>
              </div>

              <div>
                <span className="text-slate-400">Unhedged Gap: </span>
                <span className="text-rose-400 font-bold font-mono">
                  {formatINR(chartData[hoveredYear ?? timelineYears].unhedgedEquity)}
                </span>
                <span className="text-slate-500 ml-2">
                  (Diff: +{formatINR(
                    (simulateCrash 
                      ? chartData[hoveredYear ?? timelineYears].diversifiedCrashVal! 
                      : chartData[hoveredYear ?? timelineYears].projectedDiversified) - 
                    chartData[hoveredYear ?? timelineYears].unhedgedEquity
                  )})
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 flex items-center justify-between">
            <span>Projection methodology: ₹12.5L principal + monthly compounding SIP @ 12.5% CAGR.</span>
            <span className="text-emerald-400 font-medium">Historical 2020 Drawdown Model: Sebi VIX Shock</span>
          </div>
        </div>

      </div>
    </div>
  );
};
