import React, { useState, useEffect } from 'react';
import { 
  Filter, Search, ArrowUpDown, ArrowUpRight, ArrowDownRight, 
  RefreshCw, CheckCircle, ShieldCheck, Download, ChevronRight, SlidersHorizontal
} from 'lucide-react';
import { api } from '../services/api';

export default function BseScreener({ onSelectStock }) {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [capFilter, setCapFilter] = useState('ALL');
  const [minRoce, setMinRoce] = useState('');
  const [maxPe, setMaxPe] = useState('');
  const [minPiotroski, setMinPiotroski] = useState('');
  const [undervaluedOnly, setUndervaluedOnly] = useState(false);
  const [sortField, setSortField] = useState('marketCap');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const fetchUniverse = async () => {
      try {
        setLoading(true);
        const data = await api.getUniverse();
        setStocks(data.stocks || []);
        setFilteredStocks(data.stocks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniverse();
  }, []);

  // Filter application
  useEffect(() => {
    let result = [...stocks];

    if (search.trim()) {
      const q = search.trim().toUpperCase();
      result = result.filter(s =>
        s.ticker.toUpperCase().includes(q) ||
        s.isin.toUpperCase().includes(q) ||
        s.bseCode.includes(q) ||
        s.name.toUpperCase().includes(q)
      );
    }

    if (sectorFilter !== 'ALL') {
      result = result.filter(s => s.sector === sectorFilter);
    }

    if (capFilter !== 'ALL') {
      result = result.filter(s => s.capCategory === capFilter);
    }

    if (minRoce) {
      result = result.filter(s => s.roce >= parseFloat(minRoce));
    }

    if (maxPe) {
      result = result.filter(s => s.pe <= parseFloat(maxPe));
    }

    if (minPiotroski) {
      result = result.filter(s => s.piotroskiScore >= parseInt(minPiotroski));
    }

    if (undervaluedOnly) {
      result = result.filter(s => (s.dcfFairValue || s.currentPrice) > s.currentPrice);
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    setFilteredStocks(result);
  }, [stocks, search, sectorFilter, capFilter, minRoce, maxPe, minPiotroski, undervaluedOnly, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sectors = ['ALL', ...new Set(stocks.map(s => s.sector))].filter(Boolean);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              <Filter className="w-4 h-4" />
              BSE Equities Universe Screener
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Screen All BSE Tickers & ISINs
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Lookup and filter across all BSE securities with fundamentals, valuation multiples, Piotroski health scores, and bankruptcy safety ratings.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">BSE Universe Catalog</span>
            <span className="text-2xl font-extrabold text-blue-400 font-mono-num">
              {filteredStocks.length} <span className="text-sm font-normal text-slate-400">/ {stocks.length} stocks</span>
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Universal Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Ticker, ISIN, or BSE Scrip..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono-num text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sector Filter */}
          <div>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>{sec === 'ALL' ? 'All Industry Sectors' : sec}</option>
              ))}
            </select>
          </div>

          {/* Cap Filter */}
          <div>
            <select
              value={capFilter}
              onChange={(e) => setCapFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Market Caps</option>
              <option value="Large Cap">Large Cap (&gt; ₹1 Lakh Cr)</option>
              <option value="Mid Cap">Mid Cap (₹20k - ₹1 Lakh Cr)</option>
              <option value="Small Cap">Small Cap (&lt; ₹20k Cr)</option>
            </select>
          </div>

          {/* Quick Quantitative Toggles */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 cursor-pointer w-full select-none hover:bg-slate-900">
              <input
                type="checkbox"
                checked={undervaluedOnly}
                onChange={(e) => setUndervaluedOnly(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-emerald-400">Undervalued (DCF)</span>
            </label>
          </div>
        </div>

        {/* Secondary Numeric Filters */}
        <div className="pt-4 flex items-center gap-3 flex-wrap text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" /> Factor Constraints:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Min ROCE %:</span>
            <input
              type="number"
              placeholder="e.g. 20"
              value={minRoce}
              onChange={(e) => setMinRoce(e.target.value)}
              className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono-num text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Max P/E:</span>
            <input
              type="number"
              placeholder="e.g. 35"
              value={maxPe}
              onChange={(e) => setMaxPe(e.target.value)}
              className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono-num text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Min Piotroski (0-9):</span>
            <input
              type="number"
              placeholder="e.g. 7"
              value={minPiotroski}
              onChange={(e) => setMinPiotroski(e.target.value)}
              className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono-num text-xs"
            />
          </div>
          {(minRoce || maxPe || minPiotroski || undervaluedOnly || search || sectorFilter !== 'ALL' || capFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setSectorFilter('ALL');
                setCapFilter('ALL');
                setMinRoce('');
                setMaxPe('');
                setMinPiotroski('');
                setUndervaluedOnly(false);
              }}
              className="text-xs text-rose-400 hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Universe Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-semibold select-none">
                <th onClick={() => handleSort('ticker')} className="py-3 px-3 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">
                    <span>Ticker / ISIN</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('sector')} className="py-3 px-2 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">
                    <span>Sector</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('marketCap')} className="py-3 px-2 text-right cursor-pointer hover:text-white">
                  <div className="flex items-center justify-end gap-1">
                    <span>Mkt Cap (Cr)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('currentPrice')} className="py-3 px-2 text-right cursor-pointer hover:text-white">
                  <div className="flex items-center justify-end gap-1">
                    <span>CMP (₹)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('change52w')} className="py-3 px-2 text-right cursor-pointer hover:text-white">
                  <div className="flex items-center justify-end gap-1">
                    <span>1Y Ret (%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('pe')} className="py-3 px-2 text-right cursor-pointer hover:text-white">
                  <div className="flex items-center justify-end gap-1">
                    <span>P/E</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('roce')} className="py-3 px-2 text-right cursor-pointer hover:text-white">
                  <div className="flex items-center justify-end gap-1">
                    <span>ROCE (%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('debtToEquity')} className="py-3 px-2 text-right cursor-pointer hover:text-white">
                  <div className="flex items-center justify-end gap-1">
                    <span>D/E</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => handleSort('piotroskiScore')} className="py-3 px-2 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">
                    <span>Piotroski</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-num">
              {filteredStocks.map((stock) => (
                <tr 
                  key={stock.ticker} 
                  className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  onClick={() => onSelectStock(stock.ticker)}
                >
                  <td className="py-3 px-3 font-sans">
                    <div className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {stock.ticker}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono-num">
                      {stock.isin} • BSE: {stock.bseCode}
                    </div>
                  </td>
                  <td className="py-3 px-2 font-sans text-slate-300">
                    <span className="truncate block max-w-[120px]">{stock.sector}</span>
                  </td>
                  <td className="py-3 px-2 text-right text-slate-200">
                    ₹{(stock.marketCap).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-white">
                    ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`py-3 px-2 text-right font-bold ${stock.change52w >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stock.change52w >= 0 ? '+' : ''}{stock.change52w}%
                  </td>
                  <td className="py-3 px-2 text-right text-slate-200 font-semibold">
                    {stock.pe}x
                  </td>
                  <td className="py-3 px-2 text-right text-emerald-400 font-bold">
                    {stock.roce}%
                  </td>
                  <td className={`py-3 px-2 text-right ${stock.debtToEquity <= 0.3 ? 'text-emerald-400' : stock.debtToEquity > 1.5 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {stock.debtToEquity}x
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      stock.piotroskiScore >= 8 ? 'bg-emerald-500/20 text-emerald-400' :
                      stock.piotroskiScore >= 6 ? 'bg-blue-500/20 text-blue-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {stock.piotroskiScore}/9
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStock(stock.ticker);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-bold transition-all flex items-center gap-1 mx-auto"
                    >
                      <span>Analyze</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
