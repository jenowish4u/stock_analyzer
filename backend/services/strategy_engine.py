from backend.data.bse_universe import BSE_STOCKS

class StrategyEngine:
    @staticmethod
    def get_investment_mechanisms():
        return [
            {
                "id": "quality_compounders",
                "name": "Quality at a Reasonable Price (QARP / CANSLIM)",
                "badge": "Highest Long-Term Sharpe",
                "icon": "ShieldCheck",
                "philosophy": "Invest in businesses with formidable economic moats, exceptional capital efficiency (ROCE > 20%), zero or low debt leverage, and structural secular tailwinds.",
                "idealFor": "Long-term wealth builders seeking multi-year compounding with minimal downside anxiety.",
                "rules": [
                    "ROCE > 20% and ROE > 18% consistently over 3+ years",
                    "Debt-to-Equity < 0.3 (pristine balance sheet safety)",
                    "Piotroski F-Score >= 8 out of 9",
                    "Altman Z-Score >= 3.0 (Negligible distress risk)",
                    "Rebalancing: Annual review to allow compounding winners to run",
                ],
                "expectedCagr": "18% - 24%",
                "historicalSharpe": "1.65",
                "riskProfile": "Low to Moderate",
                "recommendedAllocation": "30% - 50% of total equity portfolio",
                "screenedTickers": [s for s in BSE_STOCKS if s.get("roce", 0) >= 25 and s.get("debtToEquity", 1) <= 0.1 and s.get("piotroskiScore", 0) >= 8],
            },
            {
                "id": "value_margin_of_safety",
                "name": "Deep Value & Benjamin Graham Margin of Safety",
                "badge": "Asymmetric Risk-Reward",
                "icon": "BadgePercent",
                "philosophy": "Buy fundamentally sound companies trading at a steep discount to their intrinsic DCF value, offering a built-in margin of safety against market corrections.",
                "idealFor": "Value-oriented investors looking for downside protection and multi-year valuation re-rating.",
                "rules": [
                    "Current Market Price < DCF Intrinsic Value or Graham Number",
                    "P/E ratio below sector median (PE < 20 for Large Caps)",
                    "Price to Book (P/B) < 3.0x",
                    "Positive Free Cash Flow (FCF Yield > 4%)",
                    "Rebalancing: Semi-annual portfolio review",
                ],
                "expectedCagr": "15% - 20%",
                "historicalSharpe": "1.42",
                "riskProfile": "Moderate",
                "recommendedAllocation": "20% - 30% of portfolio",
                "screenedTickers": [s for s in BSE_STOCKS if s.get("pe", 99) <= 20 and s.get("dcfFairValue", 0) >= s.get("currentPrice", 0)],
            },
            {
                "id": "high_dividend_cashflow",
                "name": "Dividend Aristocrats & Cash-Flow Reinvestment (DRIP)",
                "badge": "Passive Income Fortress",
                "icon": "Coins",
                "philosophy": "Target high cash-generative PSU and bluechip leaders offering resilient dividend yields, and systematically reinvest payouts into market dips.",
                "idealFor": "Defensive portfolios, retirees, or investors seeking steady liquidity and low volatility.",
                "rules": [
                    "Dividend Yield > 2.0% (preferably > 3.0%)",
                    "Sustainable dividend payout ratio backed by operating cash flows",
                    "Dominant market share with regulated or monopoly business model",
                    "Rebalancing: Reinvest dividends quarterly into lagging positions",
                ],
                "expectedCagr": "13% - 17% (Total Return including Dividends)",
                "historicalSharpe": "1.52",
                "riskProfile": "Low",
                "recommendedAllocation": "15% - 25% of portfolio",
                "screenedTickers": [s for s in BSE_STOCKS if s.get("dividendYield", 0) >= 1.5 and s.get("fcfYield", 0) >= 3.0],
            },
            {
                "id": "momentum_breakout",
                "name": "Relative Strength & Trend Following (Momentum Factor)",
                "badge": "Maximum Capital Acceleration",
                "icon": "TrendingUp",
                "philosophy": "Ride strong price and earnings momentum. Stocks displaying relative strength near 52-week highs tend to continue outperforming.",
                "idealFor": "Active growth investors comfortable with trailing stop-losses and higher portfolio turnover.",
                "rules": [
                    "Current Price within 15% of 52-Week High",
                    "1-Year Return > 30% outperforming the BSE Sensex",
                    "Accelerating quarterly revenue and EBITDA margins",
                    "Exit Rule: Strict 12% trailing stop-loss to protect capital",
                    "Rebalancing: Monthly / Bi-monthly momentum scoring",
                ],
                "expectedCagr": "22% - 32%",
                "historicalSharpe": "1.38",
                "riskProfile": "High",
                "recommendedAllocation": "15% - 25% of portfolio",
                "screenedTickers": [s for s in BSE_STOCKS if s.get("change52w", 0) >= 30 and (s.get("currentPrice", 1) / max(s.get("high52w", 1), 1)) >= 0.85],
            },
            {
                "id": "midcap_multibagger_scale",
                "name": "Emerging Mid-Cap Multibaggers & PLI Champions",
                "badge": "Alpha Generation Engine",
                "icon": "Rocket",
                "philosophy": "Identify mid-sized industry disrupters in high-growth themes (defense indigenization, renewable power, electronic manufacturing, digital engineering).",
                "idealFor": "Aggressive investors aiming for 3x - 5x capital appreciation over a 5-year horizon.",
                "rules": [
                    "Market Cap between ₹20,000 Cr and ₹100,000 Cr (Mid-Cap zone)",
                    "Sales growth > 20% CAGR with expansion in gross margins",
                    "Beneficiary of national capex themes (Make in India, Green Energy, EMS)",
                    "Rebalancing: Review holding every 6 months against order book execution",
                ],
                "expectedCagr": "24% - 35%",
                "historicalSharpe": "1.45",
                "riskProfile": "Moderate-High",
                "recommendedAllocation": "20% - 35% of portfolio",
                "screenedTickers": [s for s in BSE_STOCKS if s.get("capCategory") == "Mid Cap" and s.get("roce", 0) >= 20],
            },
            {
                "id": "core_satellite_framework",
                "name": "Institutional Core & Satellite Asset Allocation",
                "badge": "All-Weather Optimum",
                "icon": "Layers",
                "philosophy": "The gold standard of portfolio architecture: anchor 60% in bulletproof large-cap compounders, 30% in high-alpha satellite midcaps, and 10% in tactical cash/G-Sec.",
                "idealFor": "Any serious investor seeking the optimal trade-off between risk management and benchmark-beating returns.",
                "rules": [
                    "60% Core: Large-Cap leaders (Reliance, TCS, HDFC Bank, L&T, ITC)",
                    "30% Satellite: High-growth innovators (Polycab, HAL, Persistent, Dixon)",
                    "10% Tactical Buffer: Liquid reserves or high-dividend cash flows for dip-buying",
                    "Rebalancing: Semi-annual rebalancing when any segment drifts by > 5%",
                ],
                "expectedCagr": "17% - 22%",
                "historicalSharpe": "1.82",
                "riskProfile": "Optimal / Balanced",
                "recommendedAllocation": "100% Comprehensive Strategy",
                "screenedTickers": BSE_STOCKS[:8],
            }
        ]

    @staticmethod
    def screen_universe(filters: dict = None):
        filters = filters or {}
        results = list(BSE_STOCKS)

        search = filters.get("search")
        if search:
            q = search.strip().upper()
            results = [
                s for s in results
                if q in s["ticker"].upper()
                or q in s["bseCode"]
                or q in s["isin"].upper()
                or q in s["name"].upper()
                or q in s["sector"].upper()
            ]

        sector = filters.get("sector")
        if sector and sector != "ALL":
            results = [s for s in results if s.get("sector") == sector]

        cap = filters.get("capCategory")
        if cap and cap != "ALL":
            results = [s for s in results if s.get("capCategory") == cap]

        min_roce = filters.get("minRoce")
        if min_roce:
            try:
                results = [s for s in results if s.get("roce", 0) >= float(min_roce)]
            except ValueError:
                pass

        max_pe = filters.get("maxPe")
        if max_pe:
            try:
                results = [s for s in results if s.get("pe", 999) <= float(max_pe)]
            except ValueError:
                pass

        min_piotroski = filters.get("minPiotroski")
        if min_piotroski:
            try:
                results = [s for s in results if s.get("piotroskiScore", 0) >= int(min_piotroski)]
            except ValueError:
                pass

        max_debt = filters.get("maxDebtToEquity")
        if max_debt:
            try:
                results = [s for s in results if s.get("debtToEquity", 999) <= float(max_debt)]
            except ValueError:
                pass

        if filters.get("valuationOnly") == "undervalued":
            results = [s for s in results if s.get("dcfFairValue", 0) > s.get("currentPrice", 0)]

        return results
