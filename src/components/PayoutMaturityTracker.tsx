import React, { useState } from 'react';
import { 
  Calendar, 
  Building2, 
  Landmark, 
  Coins, 
  Clock, 
  CheckCircle2, 
  Filter, 
  ArrowUpRight,
  BellRing,
  CalendarCheck
} from 'lucide-react';
import { sampleCashflowEvents } from '../data/mockPortfolio';
import { CashflowEvent } from '../types';

export const PayoutMaturityTracker: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(10); // Default Nov (index 10) matching prompt
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'REIT' | 'FD' | 'Dividend'>('All');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Group events by month for the dot calendar
  const eventsByMonth = months.map((m, idx) => {
    return sampleCashflowEvents.filter(e => e.monthIndex === idx);
  });

  // Filtered events for the list
  const filteredEvents = sampleCashflowEvents.filter(item => {
    const matchesMonth = selectedMonth === null || item.monthIndex === selectedMonth;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesMonth && matchesCategory;
  });

  // Total annual cash flows
  const totalAnnualPayout = sampleCashflowEvents.reduce((acc, curr) => acc + curr.amount, 0);
  const reitTotal = sampleCashflowEvents.filter(e => e.category === 'REIT').reduce((acc, curr) => acc + curr.amount, 0);
  const fdTotal = sampleCashflowEvents.filter(e => e.category === 'FD').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner matching Screenshot 3 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Maturity & Payout Tracker
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              FD Maturities & Dividend Reminders synchronized via Setu AA and Exchange disclosures.
            </p>
          </div>

          {/* Color-Coded Dot Legend matching Screenshot 3 */}
          <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-200 font-medium">REITs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-200 font-medium">FDs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-200 font-medium">Dividends</span>
            </div>
          </div>
        </div>

        {/* Horizontal Monthly Timeline Calendar with Stacked Dots matching Screenshot 3 */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-12 gap-1 sm:gap-2">
            {months.map((monthName, idx) => {
              const monthEvents = eventsByMonth[idx];
              const isSelected = selectedMonth === idx;

              return (
                <button
                  key={monthName}
                  onClick={() => setSelectedMonth(isSelected ? null : idx)}
                  className={`flex flex-col items-center justify-between py-3 px-1 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-cyan-950/60 border border-cyan-500/50 shadow-md'
                      : 'hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  {/* Stacked Dots Area */}
                  <div className="h-16 flex flex-col-reverse items-center justify-start gap-1.5 py-1">
                    {monthEvents.map((ev) => {
                      let dotColor = 'bg-cyan-400';
                      if (ev.category === 'FD') dotColor = 'bg-emerald-400';
                      if (ev.category === 'Dividend') dotColor = 'bg-amber-400';

                      return (
                        <span
                          key={ev.id}
                          className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-sm transform hover:scale-125 transition-transform`}
                          title={`${ev.asset}: ${formatINR(ev.amount)}`}
                        />
                      );
                    })}
                    {monthEvents.length === 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    )}
                  </div>

                  {/* Divider line across timeline */}
                  <div className="w-full h-[1px] bg-slate-800 my-2" />

                  {/* Month Label */}
                  <span className={`text-xs font-semibold ${
                    isSelected ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}>
                    {monthName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-slate-500 mt-2">
            FD Maturities & Dividend Reminders · Click any month above to filter upcoming credits
          </div>
        </div>
      </div>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Total Projected Cash Flow (12M)</div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            {formatINR(totalAnnualPayout)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Average: {formatINR(Math.round(totalAnnualPayout / 12))}/month
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Fixed Deposit Capital & Interest</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {formatINR(fdTotal)}
          </div>
          <div className="text-[11px] text-emerald-400/70 mt-0.5">
            HDFC, ICICI, Bajaj Finance maturities
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400">Quarterly REIT Distributions</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
            {formatINR(reitTotal)}
          </div>
          <div className="text-[11px] text-cyan-400/70 mt-0.5">
            Commercial office rent cash yield
          </div>
        </div>
      </div>

      {/* Upcoming Events List Cards */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-cyan-400" />
              Scheduled Cash Flows & Maturity Alerts
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedMonth !== null 
                ? `Showing events for ${months[selectedMonth]} 2027` 
                : 'Showing all scheduled 2027 distributions'}
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
            {(['All', 'FD', 'REIT', 'Dividend'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  categoryFilter === cat
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'All' ? 'All Events' : cat === 'FD' ? 'Fixed Deposits' : cat === 'REIT' ? 'REIT Yield' : 'Dividends'}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((event) => {
            let badgeBg = 'bg-cyan-950/70 border-cyan-800/80 text-cyan-300';
            let icon = <Building2 className="w-4 h-4 text-cyan-400" />;

            if (event.category === 'FD') {
              badgeBg = 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300';
              icon = <Landmark className="w-4 h-4 text-emerald-400" />;
            } else if (event.category === 'Dividend') {
              badgeBg = 'bg-amber-950/70 border-amber-800/80 text-amber-300';
              icon = <Coins className="w-4 h-4 text-amber-400" />;
            }

            return (
              <div
                key={event.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${badgeBg}`}>
                      {icon}
                      {event.category === 'FD' ? 'FD Maturity' : event.category === 'REIT' ? 'REIT Distribution' : 'Stock Dividend'}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {event.dateStr}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2.5">
                    {event.title}
                  </h3>
                  <div className="text-xs text-cyan-400/90 font-mono mt-0.5">
                    {event.asset}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {event.details}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Payout Amount:</span>
                  <span className="text-base font-extrabold text-white font-mono">
                    {formatINR(event.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No events found for the selected month and filter.
            <button
              onClick={() => { setSelectedMonth(null); setCategoryFilter('All'); }}
              className="block mx-auto mt-2 text-cyan-400 underline"
            >
              Reset filters to show all events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
