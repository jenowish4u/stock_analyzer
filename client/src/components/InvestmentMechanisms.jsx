import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, BadgePercent, Coins, TrendingUp, Rocket, Layers, 
  ArrowUpRight, CheckCircle2, ChevronRight, Zap, Target, BookOpen,
  Filter, HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

const ICONS = {
  ShieldCheck,
  BadgePercent,
  Coins,
  TrendingUp,
  Rocket,
  Layers,
};

export default function InvestmentMechanisms({ onSelectStock }) {
  const [mechanisms, setMechanisms] = useState([]);
  const [selectedMechanism, setSelectedMechanism] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMechanisms = async () => {
      try {
        setLoading(true);
        const data = await api.getMechanisms();
        setMechanisms(data);
        if (data.length > 0) setSelectedMechanism(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMechanisms();
  }, []);

  const current = selectedMechanism || mechanisms[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            Systematic Wealth Building Frameworks
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            BSE Quantitative Investment Mechanisms
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Proven quantitative investment mechanisms designed to beat benchmark indices. Screen across all BSE tickers and ISINs by factor style: Quality, Value, Momentum, High Cash Flow, or Core-Satellite.
          </p>
        </div>
      </div>

      {/* Mechanism Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {mechanisms.map((mech) => {
          const Icon = ICONS[mech.icon] || Layers;
          const isSelected = current?.id === mech.id;
          return (
            <button
              key={mech.id}
              onClick={() => setSelectedMechanism(mech)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800/80 text-blue-300 border border-slate-700">
                  {mech.badge}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-2">{mech.name}</h4>
                <div className="text-[11px] font-mono-num font-semibold text-emerald-400 mt-1">
                  CAGR: {mech.expectedCagr}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Mechanism Deep Breakdown */}
      {current && (
        <div className="space-y-6">
          {/* Strategy Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Investment Mechanism
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                    {current.badge}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  {current.name}
                </h2>
                <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  {current.philosophy}
                </p>
              </div>

              {/* Strategy Scorecard */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block font-medium">Expected CAGR</span>
                  <span className="text-base font-extrabold font-mono-num text-emerald-400">
                    {current.expectedCagr}
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block font-medium">Historical Sharpe</span>
                  <span className="text-base font-extrabold font-mono-num text-blue-400">
                    {current.historicalSharpe}
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-400 block font-medium">Risk Level</span>
                  <span className="text-base font-bold text-slate-200">
                    {current.riskProfile}
                  </span>
                </div>
              </div>
            </div>

            {/* Implementation Rules & Portfolio Allocation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  Quantitative Selection Rules
                </h4>
                <div className="space-y-2">
                  {current.rules.map((rule, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Execution & Portfolio Fit
                </h4>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Ideal Investor Profile:</span>
                    <p className="text-xs text-slate-200 mt-0.5">{current.idealFor}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Recommended Capital Sizing:</span>
                    <p className="text-xs font-bold text-blue-400 mt-0.5">{current.recommendedAllocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screened BSE Tickers Matching This Mechanism */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-400" />
                  Screened BSE Equities Matching Criteria ({current.screenedTickers?.length || 0})
                </h3>
                <p className="text-xs text-slate-400">
                  Live qualified tickers from the Bombay Stock Exchange ready for portfolio inclusion.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {current.screenedTickers?.map((stock) => (
                <div
                  key={stock.ticker}
                  onClick={() => onSelectStock(stock.ticker)}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-base text-white group-hover:text-blue-400 transition-colors">
                        {stock.ticker}
                      </span>
                      <span className="text-sm font-bold font-mono-num text-slate-100">
                        ₹{stock.currentPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-medium truncate mb-2">
                      {stock.name}
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono-num mb-3">
                      ISIN: {stock.isin} • BSE: {stock.bseCode}
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-center text-xs mb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">ROCE</span>
                        <span className="font-bold text-emerald-400 font-mono-num">{stock.roce}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">P/E</span>
                        <span className="font-bold text-slate-200 font-mono-num">{stock.pe}x</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Piotroski</span>
                        <span className="font-bold text-blue-400 font-mono-num">{stock.piotroskiScore}/9</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-blue-400 font-semibold group-hover:text-blue-300">
                    <span>Deep Financial Inspection</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
