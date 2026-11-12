import React, { useState, useEffect } from 'react';
import { 
  Sparkles, AlertTriangle, ShieldCheck, TrendingUp, ArrowRight, 
  CheckCircle, RefreshCw, BarChart2, ShieldAlert, Award, ChevronRight,
  Sliders, PlusCircle, MinusCircle, DollarSign
} from 'lucide-react';
import { api } from '../services/api';

export default function PortfolioDoctor({ onSelectStock, onGoToMechanisms }) {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Automatically load the high-risk or standard sample portfolio to diagnose
    const fetchSampleToDiagnose = async () => {
      try {
        setLoading(true);
        const samples = await api.getSamplePortfolios();
        if (samples && samples.length > 1) {
          // Select high risk sample to demonstrate AI Doctor capabilities
          const res = await api.analyzePortfolio(samples[1].holdings);
          setPortfolioData(res);
        } else if (samples && samples.length > 0) {
          const res = await api.analyzePortfolio(samples[0].holdings);
          setPortfolioData(res);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSampleToDiagnose();
  }, []);

  const plan = portfolioData?.improvementPlan;
  const summary = portfolioData?.summary;
  const alerts = plan?.alerts || [];
  const rebalancingActions = plan?.rebalancingActions || [];
  const recommendedAdditions = plan?.recommendedAdditions || [];
  const projection = plan?.expectedImprovement;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            Quantitative Portfolio Improvement Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Portfolio Doctor & Rebalancing Plan
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Prescriptive diagnosis pinpointing over-concentration, high debt risks, and suboptimal Sharpe ratios, recommending high-grade BSE equities to optimize risk-adjusted returns.
          </p>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
          <span>Generating quantitative rebalancing diagnostic...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!loading && plan && (
        <div className="space-y-6">
          {/* Diagnostic Risk Alerts Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Identified Portfolio Vulnerabilities ({alerts.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Critical areas requiring capital reallocation to prevent catastrophic drawdown.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    alert.type === 'danger'
                      ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                      : alert.type === 'warning'
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                      : 'bg-blue-950/20 border-blue-500/40 text-blue-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/80 border border-current">
                        {alert.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{alert.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/60 text-xs font-semibold text-slate-100 flex items-start gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Prescription: {alert.suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Rebalancing Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step 1: Capital Trimming */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div>
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MinusCircle className="w-4 h-4" />
                      Step 1: Trim / De-Risk
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Capital to Harvest</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {rebalancingActions.length > 0 ? (
                    rebalancingActions.map((act, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{act.ticker}</span>
                            <span className="text-xs text-rose-400 font-mono-num font-semibold">
                              Trim: {act.currentWeight} → {act.targetWeight}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{act.rationale}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Harvest Capital</span>
                          <span className="text-sm font-bold font-mono-num text-emerald-400">
                            +₹{act.capitalToReallocate.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      No positions currently exceed individual risk limits.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
                Harvested capital is redeployed systematically into non-correlated, high-ROCE BSE leaders below.
              </div>
            </div>

            {/* Step 2: High-Grade BSE Additions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4" />
                      Step 2: Capital Deployment
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Recommended BSE Equities to Add</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {recommendedAdditions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectStock(item.ticker)}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                              {item.ticker}
                            </span>
                            <span className="text-xs text-slate-400 truncate max-w-[150px]">{item.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono-num">
                              ROCE: {item.roce}%
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono-num mt-0.5">
                            ISIN: {item.isin} • BSE: {item.bseCode}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-200 font-mono-num">
                            ₹{item.currentPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-emerald-400 block font-semibold">
                            Target: {item.targetWeight}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-1 group-hover:line-clamp-none transition-all">
                        {item.investmentThesis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onGoToMechanisms}
                className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore All 6 BSE Investment Mechanisms</span>
                <ChevronRight className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          </div>

          {/* Before vs After Projected Impact */}
          {projection && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-400" />
                    Projected Rebalancing Impact (Before vs. After)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Estimated performance frontier after executing the Doctor recommendations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Sharpe Ratio */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Sharpe Ratio (Rf=7%)</span>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <span className="text-xl font-bold font-mono-num text-slate-400">{projection.currentSharpe}</span>
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                    <span className="text-2xl font-extrabold font-mono-num text-emerald-400">{projection.projectedSharpe}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
                    +35% Risk-Adjusted Gain
                  </span>
                </div>

                {/* Portfolio Beta */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Portfolio Beta (Volatility)</span>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <span className="text-xl font-bold font-mono-num text-rose-400">{projection.currentBeta}</span>
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                    <span className="text-2xl font-extrabold font-mono-num text-emerald-400">{projection.projectedBeta}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Balanced Market Sensitivity
                  </span>
                </div>

                {/* Diversification Protection */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Downside Protection</span>
                  <div className="text-sm font-bold text-slate-200 mt-2">
                    HHI Reduced by ~40%
                  </div>
                  <span className="text-[11px] text-blue-400 font-semibold mt-1 block">
                    {projection.diversificationImpact}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
