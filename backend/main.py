import os
import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Any, Dict

# Ensure backend directory is in python path
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
if str(parent_dir) not in sys.path:
    sys.path.insert(0, str(parent_dir))

from backend.data.bse_universe import BSE_STOCKS, search_universe
from backend.services.crawler_service import CrawlerService
from backend.services.portfolio_engine import PortfolioEngine
from backend.services.strategy_engine import StrategyEngine

app = FastAPI(
    title="BSE AlphaLens Financial Analytics API",
    description="FastAPI Backend for Internet & BSE Financial Crawling, ISIN Lookup, Portfolio Diagnostics & Systematic Strategies",
    version="2.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class HoldingItem(BaseModel):
    ticker: Optional[str] = None
    isin: Optional[str] = None
    query: Optional[str] = None
    quantity: float
    buyPrice: Optional[float] = None

class PortfolioAnalyzeRequest(BaseModel):
    holdings: List[Dict[str, Any]]

class ScreenRequest(BaseModel):
    search: Optional[str] = None
    sector: Optional[str] = None
    capCategory: Optional[str] = None
    minRoce: Optional[str] = None
    maxPe: Optional[str] = None
    minPiotroski: Optional[str] = None
    maxDebtToEquity: Optional[str] = None
    valuationOnly: Optional[str] = None

# --- API Endpoints ---

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": "BSE AlphaLens Financial Analytics Engine",
        "framework": "FastAPI",
        "version": "2.0.0"
    }

@app.get("/api/bse/stock/{query}")
async def get_stock_analysis(query: str):
    try:
        analysis = await CrawlerService.crawl_and_analyze(query)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/bse/search")
async def search_stocks(q: str = Query(default="")):
    results = search_universe(q)[:10]
    return [
        {
            "ticker": s["ticker"],
            "name": s["name"],
            "isin": s["isin"],
            "bseCode": s["bseCode"],
            "sector": s["sector"],
            "capCategory": s["capCategory"],
            "currentPrice": s["currentPrice"],
            "change52w": s["change52w"],
            "pe": s["pe"],
            "roce": s["roce"],
        }
        for s in results
    ]

@app.get("/api/bse/external_lookup")
async def external_lookup(q: str = Query(...)):
    """
    Live external search/browser lookup for any Ticker, ISIN, or Mutual Fund scheme name
    """
    try:
        analysis = await CrawlerService.crawl_and_analyze(q)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/bse/universe")
async def get_universe():
    return {
        "totalCount": len(BSE_STOCKS),
        "stocks": BSE_STOCKS,
    }

@app.get("/api/portfolio/samples")
async def get_portfolio_samples():
    return PortfolioEngine.get_sample_portfolios()

@app.post("/api/portfolio/analyze")
async def analyze_portfolio(req: PortfolioAnalyzeRequest):
    try:
        report = PortfolioEngine.analyze_portfolio(req.holdings)
        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/portfolio/upload")
async def upload_portfolio(file: UploadFile = File(...)):
    try:
        content = await file.read()
        filename = file.filename or "portfolio.csv"
        normalized_holdings = PortfolioEngine.parse_file(content, filename)
        report = PortfolioEngine.analyze_portfolio(normalized_holdings)
        return {
            "filename": filename,
            "extractedCount": len(normalized_holdings),
            "report": report
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process file: {str(e)}")

@app.get("/api/strategies/mechanisms")
async def get_investment_mechanisms():
    return StrategyEngine.get_investment_mechanisms()

@app.post("/api/strategies/screen")
async def screen_stocks(req: ScreenRequest):
    results = StrategyEngine.screen_universe(req.dict())
    return {
        "count": len(results),
        "results": results
    }

# --- Static React Client Serving ---
client_dist = parent_dir / "client" / "dist"

if client_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(client_dist / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = client_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(client_dist / "index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting FastAPI backend on port {port}...")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)
