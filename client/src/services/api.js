import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Stock crawler & ISIN lookup
  getStockAnalysis: async (query) => {
    const res = await axios.get(`${API_BASE}/bse/stock/${encodeURIComponent(query)}`);
    return res.data;
  },

  // Search autocomplete
  searchStocks: async (q) => {
    const res = await axios.get(`${API_BASE}/bse/search?q=${encodeURIComponent(q)}`);
    return res.data;
  },

  // Get full BSE universe
  getUniverse: async () => {
    const res = await axios.get(`${API_BASE}/bse/universe`);
    return res.data;
  },

  // Get sample portfolios
  getSamplePortfolios: async () => {
    const res = await axios.get(`${API_BASE}/portfolio/samples`);
    return res.data;
  },

  // Analyze portfolio JSON
  analyzePortfolio: async (holdings) => {
    const res = await axios.post(`${API_BASE}/portfolio/analyze`, { holdings });
    return res.data;
  },

  // Upload file (CSV, XLSX, JSON)
  uploadPortfolioFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${API_BASE}/portfolio/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Investment mechanisms
  getMechanisms: async () => {
    const res = await axios.get(`${API_BASE}/strategies/mechanisms`);
    return res.data;
  },

  // Dynamic screener
  screenStocks: async (filters) => {
    const res = await axios.post(`${API_BASE}/strategies/screen`, filters);
    return res.data;
  },
};
