import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StockAnalyzer from './components/StockAnalyzer';
import PortfolioAnalyzer from './components/PortfolioAnalyzer';
import PortfolioDoctor from './components/PortfolioDoctor';
import InvestmentMechanisms from './components/InvestmentMechanisms';
import BseScreener from './components/BseScreener';
import { Activity, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [selectedStock, setSelectedStock] = useState('RELIANCE');

  const handleSelectStock = (ticker) => {
    setSelectedStock(ticker);
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navbar with Live Pulse */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSelectStock={handleSelectStock} 
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'analyzer' && (
          <StockAnalyzer initialStock={selectedStock} />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioAnalyzer 
            onGoToDoctor={() => setActiveTab('doctor')} 
          />
        )}

        {activeTab === 'doctor' && (
          <PortfolioDoctor 
            onSelectStock={handleSelectStock} 
            onGoToMechanisms={() => setActiveTab('mechanisms')} 
          />
        )}

        {activeTab === 'mechanisms' && (
          <InvestmentMechanisms 
            onSelectStock={handleSelectStock} 
          />
        )}

        {activeTab === 'screener' && (
          <BseScreener 
            onSelectStock={handleSelectStock} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span>BSE AlphaLens • Internet & Bombay Stock Exchange Financial Intelligence Platform</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-400">
            For educational and investment research purposes only. Not SEBI registered investment advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
