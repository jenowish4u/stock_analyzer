# BSE AlphaLens 📈
### Internet & BSE Financial Intelligence, Portfolio Diagnostics & Systematic Investment Strategy Engine
**Backend Framework: FastAPI (Python 3.12+) | Frontend: React (Vite + Tailwind CSS + Recharts)**

**BSE AlphaLens** is a financial analysis and portfolio intelligence platform with a **pure FastAPI (Python)** backend and modern React frontend. It allows investors to lookup and crawl Indian equities listed on the Bombay Stock Exchange (BSE) by **ISIN code** or **Ticker symbol**, inspect comprehensive financial statements and valuation models, upload their investment portfolio for health checks, and discover systematic quantitative investment mechanisms for superior risk-adjusted returns.

---

## 🌟 Key Features

### 1. 🔍 Internet & BSE Ticker / ISIN Crawler (FastAPI)
- **Universal Identifier Search**: Lookup any Indian equity using its **12-character ISIN** (e.g. `INE002A01018`, `INE467B01029`), **BSE Scrip Code** (e.g. `500325`, `532540`), or **Ticker Symbol** (`RELIANCE`, `TCS`, `HDFCBANK`, `HAL`, `POLYCAB`, `TRENT`, etc.).
- **Live Market & 52-Week Range**: Visual meter highlighting where the current market price trades within its 52-week band.
- **Audited Financial Statements**: Multi-year interactive charts for Revenue, EBITDA, Net Profit (PAT), Free Cash Flow (FCF), Debt, and Equity.
- **Piotroski F-Score (0-9)**: Complete 9-point fundamental financial strength checklist (Profitability, Leverage, Liquidity, Operating Efficiency).
- **Altman Z-Score**: Quantitative bankruptcy and credit distress gauge (Safe Zone, Grey Zone, Distress Zone).
- **Valuation Engines**: Discounted Cash Flow (DCF) Fair Value, Benjamin Graham Number, and Margin of Safety percentage.
- **DuPont 3-Way Analysis**: Breakdown of ROE into Net Margin $\times$ Asset Turnover $\times$ Leverage Multiplier.
- **Filings & Web News Sentiment**: Live sentiment score and catalytic growth drivers.

---

### 2. 💼 Portfolio Upload & Risk Diagnostics (Python Pandas Engine)
- **Native Zerodha Multi-Asset Statement Support**: Direct upload of Zerodha multi-asset export spreadsheets (`.xlsx`) and CSV statements containing Client ID, Direct Equities, ETFs, Gold & Silver commodities, and Mutual Funds (18+ schemes).
- **External Search & Live Browser Lookup**: Live lookup capability for every portfolio holding, ticker, or ISIN code using real-time search queries and financial intelligence.
- **Multi-Format Ingestion**: Upload portfolios in **CSV**, **Excel (.xlsx / .xls)**, or **JSON** parsed with Pandas and OpenPyXL.
- **Preset Portfolios**: Includes ready-made sample portfolios for instant 1-click testing:
  - *Zerodha Real-World Multi-Asset Statement (Client FW3757)*
  - *Balanced Core & Satellite Compounders*
  - *High-Risk Concentrated Portfolio (Needs Doctor)*
  - *High Dividend & PSU Cash Flow*
- **Portfolio Metrics**:
  - Total Invested Capital vs Current Market Value
  - Net Profit/Loss (₹ and %)
  - Portfolio Weighted Beta (Sensitivity relative to BSE Sensex)
  - Sharpe Ratio ($S = \frac{R_p - R_f}{\sigma_p}$ against India 10Y G-Sec benchmark $R_f = 6.85\%$)
  - Sortino Ratio (Downside volatility)
  - Herfindahl-Hirschman Concentration Index (HHI)
  - Macro Asset Allocation breakdown (Equities, ETFs, Gold & Silver, Mutual Funds, Debt)
  - Interactive Sector Allocation (Donut chart) & Market Cap Exposure (Large/Mid/Small Cap)
  - Position-level Action Recommendation (`ACCUMULATE`, `HOLD`, `TAKE PROFIT`, `TRIM / EXIT`)

---

### 3. ⚡ AI Portfolio Doctor & Prescriptive Rebalancing
- **Vulnerability Diagnostics**: Detects single-stock concentration (>20%), sector clustering (>35%), high debt-to-equity leverage, and deteriorating Piotroski scores.
- **Actionable 3-Step Rebalancing Plan**:
  - **Step 1: Capital to Harvest**: Specifies exact capital amounts to trim from overweighted or high-risk holdings.
  - **Step 2: High-Grade BSE Additions**: Recommends top-tier BSE stocks with high ROCE (>20%), zero debt, and pristine Piotroski scores to deploy capital into.
  - **Step 3: Projected Impact**: Shows Before vs After Sharpe Ratio improvement (+35%), Beta reduction, and downside drawdown protection.

---

### 4. 🎯 6 BSE Systematic Investment Mechanisms
Systematic quantitative strategies to beat benchmark returns:
1. **Quality at a Reasonable Price (QARP / CANSLIM)**: High ROCE (>20%), ROE (>18%), Low Debt ($< 0.3$), Piotroski $\ge 8$. Expected CAGR: **18% - 24%**.
2. **Deep Value & Benjamin Graham Margin of Safety**: Price below DCF Intrinsic Value, Low P/E, Safe Altman Z, FCF yield > 4%. Expected CAGR: **15% - 20%**.
3. **Dividend Aristocrats & Cash-Flow Compounding (DRIP)**: Yield > 2.5%, sustainable payout, quarterly reinvestment. Expected CAGR: **13% - 17%**.
4. **Momentum & Relative Strength (Trend Breakouts)**: Proximity to 52W high, 1Y Return > 30%, trailing stop-losses. Expected CAGR: **22% - 32%**.
5. **Emerging Mid-Cap Multibaggers & PLI Champions**: Sales growth > 20%, domestic capex beneficiaries. Expected CAGR: **24% - 35%**.
6. **Institutional Core & Satellite Asset Allocation**: 60% Core Bluechips + 30% Growth Satellites + 10% Tactical Reserves. Expected CAGR: **17% - 22%** (Sharpe **1.82**).

---

### 5. 📊 BSE Universe Screener
- Interactive screener covering BSE securities.
- Filter dynamically by Sector, Cap Category, Min ROCE, Max P/E, Min Piotroski Score, and DCF Undervalued status.

---

## 🚀 How to Run with FastAPI

### Prerequisites
- Python 3.10+ (Installed via Anaconda/standard Python)
- Node.js (for client build)

### 1. Start the FastAPI Backend & Fullstack Application
In your terminal, run:
```powershell
cd d:\Antigravity\Project1
python -m uvicorn backend.main:app --host 0.0.0.0 --port 5000
```
Then open **[http://localhost:5000](http://localhost:5000)** in your browser!

FastAPI automatically serves:
- The Interactive OpenAPI documentation at **[http://localhost:5000/docs](http://localhost:5000/docs)**
- The ReDoc API documentation at **[http://localhost:5000/redoc](http://localhost:5000/redoc)**
- All backend REST endpoints at `/api/...`
- The React SPA client interface at `/`

### 2. Development Mode with Hot Reload
- **FastAPI Backend (with auto-reload)**:
  ```powershell
  python -m uvicorn backend.main:app --port 5000 --reload
  ```
- **React Frontend (Vite dev server)**:
  ```powershell
  npm run client
  ```
  Open **`http://localhost:5173`**.

---

## 📁 Sample CSV Format for Portfolio Upload
Save the following format as `.csv` and upload in the Portfolio Diagnostics tab:
```csv
Ticker,ISIN,Quantity,BuyPrice
RELIANCE,INE002A01018,30,2480.00
TCS,INE467B01029,25,3550.00
HDFCBANK,INE040A01034,60,1540.00
LT,INE018A01030,20,2950.00
SUNPHARMA,INE044A01036,45,1300.00
POLYCAB,INE455K01017,15,4900.00
BEL,INE263A01024,200,195.00
TRENT,INE849A01020,15,4200.00
```
*(A downloadable template button is also provided directly within the user interface)*.
