import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, ShieldCheck, Activity, PieChart, Sparkles, Filter, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, onSelectStock }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await api.searchStocks(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelect = (stock) => {
    onSelectStock(stock.ticker);
    setSearchQuery('');
    setSearchResults([]);
    setActiveTab('analyzer');
  };

  const navItems = [
    { id: 'analyzer', label: 'Stock & ISIN Inspector', icon: Search },
    { id: 'portfolio', label: 'Portfolio Diagnostics', icon: PieChart },
    { id: 'doctor', label: 'AI Portfolio Doctor', icon: Sparkles, badge: 'Smart' },
    { id: 'mechanisms', label: 'Investment Strategies', icon: Layers },
    { id: 'screener', label: 'BSE Screener', icon: Filter },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800">
      {/* Top BSE Market Pulse Bar */}
      <div className="bg-slate-900/80 px-4 py-1.5 text-xs border-b border-slate-800/60 hidden sm:flex items-center justify-between">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <span className="flex items-center gap-1.5 font-semibold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            BSE LIVE PULSE:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">BSE SENSEX</span>
            <span className="text-slate-100 font-mono-num font-bold">81,455.40</span>
            <span className="text-emerald-400 font-mono-num text-[11px] font-semibold">+422.30 (+0.52%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">NIFTY 50</span>
            <span className="text-slate-100 font-mono-num font-bold">24,780.15</span>
            <span className="text-emerald-400 font-mono-num text-[11px] font-semibold">+132.80 (+0.54%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">BSE MIDCAP</span>
            <span className="text-slate-100 font-mono-num font-bold">48,210.60</span>
            <span className="text-emerald-400 font-mono-num text-[11px] font-semibold">+315.20 (+0.66%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">INDIA 10Y G-SEC (Rf)</span>
            <span className="text-blue-400 font-mono-num font-bold">6.85%</span>
          </div>
        </div>
        <div className="text-slate-400 font-medium text-[11px] flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          ISIN & BSE Scrip Gateway Connected
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  BSE <span className="text-blue-400">AlphaLens</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Internet & BSE Financial Crawler & Portfolio Doctor
              </p>
            </div>
          </div>

          {/* Quick Universal ISIN / Ticker Search */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any BSE Ticker, ISIN (e.g. INE002A01018), or Scrip..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono-num"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Dropdown search results */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>BSE Equities ({searchResults.length})</span>
                  <span>ISIN / Scrip Code</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {searchResults.map((stock) => (
                    <div
                      key={stock.ticker}
                      onClick={() => handleSelect(stock)}
                      className="px-3.5 py-2.5 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                            {stock.ticker}
                          </span>
                          <span className="text-xs text-slate-400 truncate max-w-[180px]">
                            {stock.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="text-slate-400">{stock.sector}</span>
                          <span>•</span>
                          <span className="font-mono-num text-slate-400">ISIN: {stock.isin}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-slate-100 font-mono-num">
                          ₹{stock.currentPrice.toLocaleString('en-IN')}
                        </div>
                        <div className={`text-[11px] font-mono-num font-semibold ${stock.change52w >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stock.change52w >= 0 ? '+' : ''}{stock.change52w}% (1Y)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
