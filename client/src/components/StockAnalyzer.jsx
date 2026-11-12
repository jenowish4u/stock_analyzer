import React, { useState, useEffect } from 'react';
import { 
  Search, TrendingUp, Shield, AlertTriangle, CheckCircle, HelpCircle, 
  Globe, ExternalLink, RefreshCw, BarChart3, DollarSign, Layers,
  Compass, ArrowUpRight, ArrowDownRight, Award, Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, Legend, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { api } from '../services/api';

export default function StockAnalyzer({ initialStock = 'RELIANCE' }) {
  const [searchInput, setSearchInput] = useState(initialStock);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showPiotroskiModal, setShowPiotroskiModal] = useState(false);

  const fetchAnalysis = async (query) => {
    if (!query) return;
    try {
      setLoading(true);
      setError(null);
      const result = await api.getStockAnalysis(query);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to crawl and analyze stock.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(initialStock);
  }, [initialStock]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAnalysis(searchInput);
  };

  const sampleShortcuts = [
    { ticker: 'RELIANCE', isin: 'INE002A01018', name: 'Reliance' },
    { ticker: 'TCS', isin: 'INE467B01029', name: 'TCS' },
    { ticker: 'HDFCBANK', isin: 'INE040A01034', name: 'HDFC Bank' },
    { ticker: 'HAL', isin: 'INE066F01012', name: 'HAL (Defense)' },
    { ticker: 'POLYCAB', isin: 'INE455K01017', name: 'Polycab' },
    { ticker: 'TRENT', isin: 'INE849A01020', name: 'Trent (Zudio)' },
    { ticker: 'COALINDIA', isin: 'INE522F01014', name: 'Coal India' },
    { ticker: 'SUZLON', isin: 'INE040H01021', name: 'Suzlon Energy' },
    { ticker: 'DIXON', isin: 'INE935N01020', name: 'Dixon Tech' },
  ];

  const stock = data?.stock;
  const health = data?.financialHealth;
  const webNews = data?.webNews || [];

  // Financial chart data transformation
  const chartData = stock?.financials ? stock.financials.years.map((year, i) => ({
    year,
    revenue: stock.financials.revenue[i] || 0,
    ebitda: stock.financials.ebitda[i] || 0,
    netProfit: stock.financials.netProfit[i] || 0,
    fcf: stock.financials.fcf[i] || 0,
    debt: stock.financials.totalDebt[i] || 0,
    equity: stock.financials.totalEquity[i] || 0,
  })) : [];

  // 52-Week Range percentage
  const rangePct = stock ? Math.max(0, Math.min(100, Math.round(((stock.currentPrice - stock.low52w) / (stock.high52w - stock.low52w)) * 100))) : 50;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
            <Globe className="w-4 h-4 animate-spin-slow" />
            Internet & BSE Crawler Gateway
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Comprehensive BSE Financial & ISIN Analyzer
          </h1>
          <p className="text-sm text-slate-400 mt-1 mb-5">
            Crawl Bombay Stock Exchange filings, financial statements, valuation models, Piotroski F-Score, Altman Z bankruptcy safety, and news sentiment for any Indian equity.
          </p>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter BSE Ticker (e.g. RELIANCE) or 12-digit ISIN (e.g. INE002A01018)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 font-mono-num text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Crawling...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Analyze Stock</span>
                </>
              )}
            </button>
          </form>

          {/* Quick shortcuts */}
          <div className="flex items-center gap-2 mt-4 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Popular Lookups:</span>
            {sampleShortcuts.map((s) => (
              <button
                key={s.ticker}
                onClick={() => {
                  setSearchInput(s.ticker);
                  fetchAnalysis(s.ticker);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/40 border border-slate-700/80 text-slate-300 transition-all font-mono-num text-[11px]"
              >
                {s.name} <span className="text-slate-400">({s.ticker})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Stock Main Analytical Dashboard */}
      {stock && (
        <div className="space-y-6">
          {/* Executive Company Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {stock.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
                    BSE: {stock.ticker} ({stock.bseCode})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                    ISIN: {stock.isin}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                    {stock.capCategory}
                  </span>
                </div>
                <div className="text-sm text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="text-slate-300 font-medium">{stock.sector}</span>
                  <span>•</span>
                  <span>{stock.industry}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Audited Annual Filings Analyzed
                  </span>
                </div>
              </div>

              {/* Price & 52-Week Range */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Current Market Price (CMP)</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono-num">
                      ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`text-sm font-bold font-mono-num flex items-center ${stock.change52w >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.change52w >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {stock.change52w >= 0 ? '+' : ''}{stock.change52w}% (1Y)
                    </span>
                  </div>
                </div>

                {/* 52W Range Visual Meter */}
                <div className="w-full sm:w-48 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-[11px] font-mono-num text-slate-400 mb-1">
                    <span>52W L: ₹{stock.low52w}</span>
                    <span>52W H: ₹{stock.high52w}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                      style={{ width: `${rangePct}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-center text-slate-500 mt-1 font-mono-num">
                    Trading at {rangePct}% of 52-week band
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-6">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Market Cap</span>
                <div className="text-sm font-bold font-mono-num text-slate-100 mt-0.5">
                  ₹{(stock.marketCap).toLocaleString('en-IN')} Cr
                </div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Stock P/E</span>
                <div className="text-sm font-bold font-mono-num text-slate-100 mt-0.5">
                  {stock.pe}x
                </div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Price to Book</span>
                <div className="text-sm font-bold font-mono-num text-slate-100 mt-0.5">
                  {stock.pb}x
                </div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">ROCE</span>
                <div className="text-sm font-bold font-mono-num text-emerald-400 mt-0.5">
                  {stock.roce}%
                </div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">ROE</span>
                <div className="text-sm font-bold font-mono-num text-emerald-400 mt-0.5">
                  {stock.roe}%
                </div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Debt / Equity</span>
                <div className={`text-sm font-bold font-mono-num mt-0.5 ${stock.debtToEquity <= 0.5 ? 'text-emerald-400' : stock.debtToEquity > 1.5 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {stock.debtToEquity}x
                </div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Dividend Yield</span>
                <div className="text-sm font-bold font-mono-num text-blue-400 mt-0.5">
                  {stock.dividendYield}%
                </div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium">Beta (Sensex)</span>
                <div className="text-sm font-bold font-mono-num text-slate-100 mt-0.5">
                  {stock.beta}
                </div>
              </div>
            </div>
          </div>

          {/* Deep Financial Health Scores (Piotroski, Altman Z, DCF Valuation, DuPont) */}
          {health && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* 1. Piotroski F-Score Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Piotroski F-Score
                    </span>
                    <h3 className="text-lg font-extrabold text-white">Financial Health</h3>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold font-mono-num text-lg ${
                    health.piotroski.score >= 8 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    health.piotroski.score >= 6 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {health.piotroski.score}/9
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Rating:</span>
                    <span className="font-bold text-slate-200">{health.piotroski.rating}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${health.piotroski.score >= 8 ? 'bg-emerald-400' : health.piotroski.score >= 6 ? 'bg-blue-400' : 'bg-rose-400'}`}
                      style={{ width: `${(health.piotroski.score / 9) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Evaluates profitability, capital structure leverage, liquidity, and operating margin trends.
                  </p>
                </div>

                <button
                  onClick={() => setShowPiotroskiModal(!showPiotroskiModal)}
                  className="w-full py-2 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>{showPiotroskiModal ? 'Hide 9-Point Audit' : 'View 9-Point Audit'}</span>
                </button>
              </div>

              {/* 2. Altman Z-Score Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Altman Z-Score
                    </span>
                    <h3 className="text-lg font-extrabold text-white">Bankruptcy Risk</h3>
                  </div>
                  <div className={`px-2.5 py-1 rounded-xl font-bold font-mono-num text-sm ${
                    health.altmanZ.score >= 3.0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    health.altmanZ.score >= 1.8 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {health.altmanZ.score}
                  </div>
                </div>

                <div className="space-y-2 mb-2">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[11px] font-medium">Zone Category:</span>
                    <span className={`font-bold ${
                      health.altmanZ.score >= 3.0 ? 'text-emerald-400' :
                      health.altmanZ.score >= 1.8 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {health.altmanZ.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Calculated using working capital, retained earnings, EBIT, equity market value, and sales turnover.
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 font-mono-num">
                  Benchmark: &gt; 3.0 Safe | 1.8 - 3.0 Grey | &lt; 1.8 Distress
                </div>
              </div>

              {/* 3. Intrinsic DCF & Valuation Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Intrinsic DCF Value
                    </span>
                    <h3 className="text-lg font-extrabold text-white">Fair Valuation</h3>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    health.valuation.marginOfSafetyPercent >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {health.valuation.marginOfSafetyPercent >= 0 ? 'Discounted' : 'Premium'}
                  </div>
                </div>

                <div className="space-y-2 mb-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">DCF Fair Value:</span>
                    <span className="text-base font-bold font-mono-num text-white">
                      ₹{health.valuation.dcfFairValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Graham Number:</span>
                    <span className="text-sm font-semibold font-mono-num text-slate-300">
                      ₹{health.valuation.grahamNumber ? health.valuation.grahamNumber.toLocaleString('en-IN') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-400">Margin of Safety:</span>
                    <span className={`text-sm font-bold font-mono-num ${health.valuation.marginOfSafetyPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {health.valuation.marginOfSafetyPercent}%
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-medium">
                  Verdict: <span className="text-blue-400 font-bold">{health.valuation.verdict}</span>
                </div>
              </div>

              {/* 4. Recommendation & Moat */}
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Quantitative Stance
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-white mt-1">
                    {health.recommendation.action}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Horizon: <span className="font-semibold text-white">{health.recommendation.horizon}</span>
                  </p>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-blue-500/20 text-[11px] text-slate-300">
                  <span className="font-bold text-blue-400 block mb-0.5">Economic Moat:</span>
                  {health.recommendation.keyMoat}
                </div>
              </div>
            </div>
          )}

          {/* Expandable Piotroski Checklist Audit */}
          {showPiotroskiModal && health?.piotroski && (
            <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Piotroski 9-Point Financial Health Audit
                  </h4>
                  <p className="text-xs text-slate-400">
                    Comprehensive check of fundamental financial strength and earnings quality.
                  </p>
                </div>
                <div className="text-sm font-bold font-mono-num text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                  Passed {health.piotroski.score} of 9 Criteria
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {health.piotroski.breakdown.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                      item.passed 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    <div className="mt-0.5">
                      {item.passed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-200">{item.criterion}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-Year Financial Statements Charts */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue & EBITDA Trend */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-base text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      Revenue & Operating EBITDA (₹ Cr)
                    </h4>
                    <p className="text-xs text-slate-400">4-Year Consolidated Audited Performance</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
                        formatter={(val) => [`₹${val.toLocaleString('en-IN')} Cr`]}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                      <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Net Profit & Free Cash Flow */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-base text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Net Profit (PAT) & Free Cash Flow (₹ Cr)
                    </h4>
                    <p className="text-xs text-slate-400">Cash Generation & Conversion Quality</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorFcf" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
                        formatter={(val) => [`₹${val.toLocaleString('en-IN')} Cr`]}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                      <Area type="monotone" dataKey="netProfit" name="Net Profit (PAT)" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                      <Area type="monotone" dataKey="fcf" name="Free Cash Flow" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorFcf)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Qualitative Business Moat & Catalysts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h4 className="font-bold text-base text-white flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-blue-400" />
                Business Overview & Strategic Catalysts
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {stock.description}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Key Growth Drivers & Quarterly Highlights:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stock.highlights?.map((hl, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Crawled News & Regulatory Sentiment Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Live Web & Filings Sentiment
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {stock.newsSentiment} ({Math.round(stock.sentimentScore * 100)}%)
                </span>
              </div>

              <div className="space-y-3">
                {webNews.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <div className="text-xs font-semibold text-slate-200 line-clamp-2">
                      {item.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>{item.source}</span>
                      <span className="text-slate-500">{item.timestamp}</span>
                    </div>
                    <div className="mt-1.5 text-[11px] text-blue-400 font-medium">
                      Impact: {item.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
