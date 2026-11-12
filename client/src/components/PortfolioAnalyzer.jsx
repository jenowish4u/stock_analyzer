import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, FileText, PieChart as PieIcon, ShieldAlert, ArrowUpRight, 
  ArrowDownRight, CheckCircle2, AlertCircle, Sparkles, Download, 
  RefreshCw, TrendingUp, Layers, ChevronRight, Info, Search, ExternalLink, Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { api } from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1'];

export default function PortfolioAnalyzer({ onGoToDoctor, onSelectStock }) {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const fileInputRef = useRef(null);

  // Auto-load Zerodha Portfolio on initial mount
  useEffect(() => {
    loadZerodhaSample();
  }, []);

  const loadZerodhaSample = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch the sample Zerodha CSV from public or backend upload
      const response = await fetch('/zerodha_portfolio_sample.csv');
      let blob;
      if (response.ok) {
        blob = await response.blob();
      } else {
        // Fallback: request from api
        const samples = await api.getSamplePortfolios();
        if (samples && samples.length > 0) {
          const res = await api.analyzePortfolio(samples[0].holdings || []);
          setPortfolioData(res);
          setLoading(false);
          return;
        }
      }
      if (blob) {
        const file = new File([blob], 'zerodha_portfolio_sample.csv', { type: 'text/csv' });
        const res = await api.uploadPortfolioFile(file);
        setPortfolioData(res.report);
      }
    } catch (err) {
      console.warn("Could not auto-load Zerodha CSV directly, falling back to API samples:", err);
      try {
        const samples = await api.getSamplePortfolios();
        if (samples && samples.length > 0) {
          const res = await api.analyzePortfolio(samples[0].holdings || []);
          setPortfolioData(res);
        }
      } catch (e) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.uploadPortfolioFile(file);
      setPortfolioData(res.report);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to parse portfolio file.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const summary = portfolioData?.summary;
  const rawHoldings = portfolioData?.holdings || [];
  const assetClassData = portfolioData?.assetClassBreakdown || [];
  const sectorData = portfolioData?.sectorBreakdown || [];

  // Filter holdings
  const filteredHoldings = rawHoldings.filter(h => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'EQUITY') return h.assetClass === 'Direct Equity';
    if (filterCategory === 'ETF') return h.assetClass === 'ETFs & Index Funds';
    if (filterCategory === 'COMMODITY') return h.assetClass === 'Commodities';
    if (filterCategory === 'MF') return h.assetClass === 'Mutual Funds' || h.assetClass === 'Hybrid & Multi-Asset';
    if (filterCategory === 'DEBT') return h.assetClass === 'Debt & Fixed Income' || h.assetClass === 'Cash & Liquid';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Upload and Sample Selection Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              <PieIcon className="w-4 h-4" />
              Zerodha Multi-Asset Portfolio Diagnostics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Zerodha Portfolio & External Browser Lookup
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Fully aligned with your Zerodha multi-asset export (Equities, Sectoral ETFs, Gold/Silver, and Mutual Funds). Uses external browser & financial search to look up market fundamentals, Piotroski scores, and duplicate scheme overlaps.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={loadZerodhaSample}
              className="px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Reload Zerodha Statement (FW3757)</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.xls,.json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{loading ? 'Processing...' : 'Upload Zerodha / CSV File'}</span>
            </button>
          </div>
        </div>

        {/* Zerodha Portfolio Meta Strip */}
        <div className="pt-4 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Statement Client ID: <strong className="text-white font-mono">FW3757</strong>
            </span>
            <span>•</span>
            <span>As on Date: <strong className="text-slate-200">2026-11-12</strong></span>
            <span>•</span>
            <span>Total Positions: <strong className="text-blue-400 font-mono-num">{rawHoldings.length} Assets</strong></span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono-num">
            Supports Equities, ETFs, Gold/Silver BeES & Mutual Funds
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Main Analysis Display */}
      {summary && (
        <div className="space-y-6">
          {/* Executive Portfolio Health Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Total Invested */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Total Invested</span>
              <div className="text-lg sm:text-xl font-extrabold text-white font-mono-num mt-1">
                ₹{summary.totalInvested.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 font-mono-num">Zerodha Combined Cost</span>
            </div>

            {/* Current Value */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Present Market Value</span>
              <div className="text-lg sm:text-xl font-extrabold text-white font-mono-num mt-1">
                ₹{summary.totalCurrentValue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 font-mono-num">Live Valuation</span>
            </div>

            {/* Overall P&L */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Unrealized P&L</span>
              <div className={`text-lg sm:text-xl font-extrabold font-mono-num mt-1 flex items-center gap-1 ${summary.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {summary.totalPnl >= 0 ? '+' : ''}₹{summary.totalPnl.toLocaleString('en-IN')}
              </div>
              <span className={`text-[11px] font-bold font-mono-num ${summary.totalPnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {summary.totalPnlPercent >= 0 ? '+' : ''}{summary.totalPnlPercent}% Total Return
              </span>
            </div>

            {/* Weighted Beta */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Weighted Beta</span>
              <div className="text-lg sm:text-xl font-extrabold text-blue-400 font-mono-num mt-1">
                {summary.weightedBeta}
              </div>
              <span className="text-[11px] text-slate-500">
                vs BSE Sensex Benchmark
              </span>
            </div>

            {/* Sharpe Ratio */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Sharpe Ratio (Rf=6.85%)</span>
              <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono-num mt-1">
                {summary.sharpeRatio}
              </div>
              <span className="text-[11px] text-slate-500">
                Sortino: <strong className="text-slate-300 font-mono-num">{summary.sortinoRatio}</strong>
              </span>
            </div>

            {/* Diversification Score */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Concentration Index</span>
              <div className="text-base sm:text-lg font-bold text-slate-200 mt-1 truncate">
                {summary.diversificationRating}
              </div>
              <span className="text-[11px] text-slate-500 font-mono-num">
                HHI: {summary.herfindahlIndex}
              </span>
            </div>
          </div>

          {/* AI Portfolio Doctor Callout Banner */}
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-blue-500/40 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  AI Portfolio Doctor: {portfolioData?.improvementPlan?.alerts?.length || 0} Critical Optimization Areas Detected
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Flags include 6 duplicate ELSS funds, duplicate Gold holdings, and severe Silver commodity drag (-11.77%).
                </p>
              </div>
            </div>
            <button
              onClick={onGoToDoctor}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>View Rebalancing & Improvements</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Charts: Multi-Asset Class Allocation & Sector Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-Asset Class Allocation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h4 className="font-bold text-base text-white mb-1 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-400" />
                Macro Asset Class Allocation (%)
              </h4>
              <p className="text-xs text-slate-400 mb-4">Distribution across Mutual Funds, Equities, ETFs, Gold & Silver</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetClassData}
                      dataKey="weight"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {assetClassData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
                      formatter={(val) => [`${val}%`, 'Allocation']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sub-Sector & Category Allocation */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <h4 className="font-bold text-base text-white mb-1 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Sub-Sector & Fund Category Weights (%)
              </h4>
              <p className="text-xs text-slate-400 mb-4">Granular exposure across ELSS, Commodities, Renewable Energy, etc.</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorData.slice(0, 7)} layout="vertical" margin={{ top: 10, right: 30, left: 50, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 'auto']} />
                    <YAxis dataKey="sector" type="category" stroke="#64748b" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
                      formatter={(val) => [`${val}%`, 'Weight']}
                    />
                    <Bar dataKey="weight" fill="#10b981" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Holdings Filter Tabs and Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-4 gap-3">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Zerodha Holdings Statement ({filteredHoldings.length} of {rawHoldings.length})
                </h4>
                <p className="text-xs text-slate-400">
                  Click on any holding to trigger external browser search and financial deep dive.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
                {[
                  { id: 'ALL', label: `All (${rawHoldings.length})` },
                  { id: 'EQUITY', label: 'Equities' },
                  { id: 'ETF', label: 'ETFs' },
                  { id: 'COMMODITY', label: 'Gold & Silver' },
                  { id: 'MF', label: 'Mutual Funds' },
                  { id: 'DEBT', label: 'Debt / Cash' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterCategory(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      filterCategory === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                    <th className="py-3 px-3">Investment Name / Symbol</th>
                    <th className="py-3 px-2">Asset Class</th>
                    <th className="py-3 px-2 text-right">Qty</th>
                    <th className="py-3 px-2 text-right">Avg Buy Price</th>
                    <th className="py-3 px-2 text-right">CMP / NAV</th>
                    <th className="py-3 px-2 text-right">Present Value</th>
                    <th className="py-3 px-2 text-right">Weight</th>
                    <th className="py-3 px-2 text-right">Unrealized P&L</th>
                    <th className="py-3 px-3 text-center">External Lookup</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono-num">
                  {filteredHoldings.map((h, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-sans">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{h.ticker}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{h.name}</div>
                        {h.isin && h.isin !== 'N/A' && (
                          <div className="text-[10px] text-slate-500 font-mono-num">ISIN: {h.isin}</div>
                        )}
                      </td>
                      <td className="py-3 px-2 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          h.assetClass === 'Direct Equity' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                          h.assetClass === 'Commodities' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          h.assetClass === 'ETFs & Index Funds' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          h.assetClass === 'Mutual Funds' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {h.subCategory || h.assetClass}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right text-slate-200">{h.quantity}</td>
                      <td className="py-3 px-2 text-right text-slate-300">₹{h.buyPrice.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right font-bold text-white">₹{h.cmp.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right font-bold text-slate-100">
                        ₹{Math.round(h.currentValue).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2 text-right text-slate-300 font-bold">{h.weight}%</td>
                      <td className={`py-3 px-2 text-right font-bold ${h.pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        <div>{h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent}%</div>
                        <div className="text-[10px] font-normal text-slate-400">
                          {h.pnl >= 0 ? '+' : ''}₹{Math.round(h.pnl).toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-sans">
                        <button
                          onClick={() => onSelectStock(h.ticker)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-bold transition-all flex items-center gap-1 mx-auto"
                        >
                          <Search className="w-3 h-3" />
                          <span>Search Outside</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
