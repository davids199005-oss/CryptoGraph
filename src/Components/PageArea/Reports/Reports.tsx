import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AppState } from "../../../Redux/AppState";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { PriceFormatter } from "../../../Utils/PriceFormatter";
import "./Reports.css";

type OhlcCandle = {
    open: number;
    high: number;
    low: number;
    close: number;
};

type PriceDataPoint = {
    time: string;
    timestamp?: number;
    [coinId: string]: string | number | OhlcCandle | undefined;
};

type ChartDataPoint = {
    time: string;
    [coinName: string]: string | number;
};

type CoinReport = {
    coin: CoinsModel;
    currentPrice: number;
    previousPrice: number;
    priceChange: number;
    priceChangePercent: number;
};

const REFRESH_INTERVAL_MS = 1 * 60 * 1000; // 1 minute

export function Reports() {
    const allCoins = useSelector((state: AppState) => state.coins);
    const selectedCoinIds = useSelector((state: AppState) => state.selectedCoins);

    const [priceHistory, setPriceHistory] = useState<PriceDataPoint[]>([]);
    const [coinReports, setCoinReports] = useState<CoinReport[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const selectedCoins = useMemo(() => {
        return allCoins.filter(coin => coin.id && selectedCoinIds.includes(coin.id));
    }, [allCoins, selectedCoinIds]);

    useEffect(() => {
        if (selectedCoinIds.length === 0) {
            setPriceHistory([]);
            setCoinReports([]);
            return;
        }

        let isCancelled = false;

        async function fetchPrices() {
            setLoading(true);
            try {
                // Prepare coins data with id and symbol for CryptoCompare API
                const coinsForApi = selectedCoins
                    .filter(coin => coin.id && coin.symbol)
                    .map(coin => ({ id: coin.id!, symbol: coin.symbol! }));

                if (coinsForApi.length === 0) {
                    setLoading(false);
                    return;
                }

                // Single API request to CryptoCompare for all selected coins
                const pricesMap = await coinsService.getMultipleCoinsPricesBySymbols(coinsForApi);

                if (isCancelled) return;

                const now = new Date();
                const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const timestamp = Math.floor(now.getTime() / 1000);

                // Update price history with OHLC data and calculate reports
                setPriceHistory(prev => {
                    const previousDataPoint = prev[prev.length - 1];
                    const newDataPoint: PriceDataPoint = { time: timeString, timestamp };

                    selectedCoins.forEach(coin => {
                        if (!coin.id) return;

                        const currentPrice = pricesMap.get(coin.id);
                        if (currentPrice === undefined) return;

                        const previousPrice = previousDataPoint?.[coin.id];
                        let candle: OhlcCandle;

                        if (previousPrice && typeof previousPrice === "object" && "close" in previousPrice) {
                            // Use previous close as open
                            const open = previousPrice.close;
                            const close = currentPrice;
                            const high = Math.max(open, close) * 1.002;
                            const low = Math.min(open, close) * 0.998;
                            candle = { open, high, low, close };
                        } else if (typeof previousPrice === "number") {
                            // Legacy format - previous price was a number
                            const open = previousPrice;
                            const close = currentPrice;
                            const high = Math.max(open, close) * 1.002;
                            const low = Math.min(open, close) * 0.998;
                            candle = { open, high, low, close };
                        } else {
                            // First candle - use current price for all
                            candle = {
                                open: currentPrice,
                                high: currentPrice * 1.002,
                                low: currentPrice * 0.998,
                                close: currentPrice
                            };
                        }

                        newDataPoint[coin.id] = candle;
                    });

                    const updated = [...prev, newDataPoint];
                    const newHistory = updated.slice(-30);

                    // Calculate reports based on previous and current data points
                    const reports: CoinReport[] = selectedCoins
                        .filter(coin => coin.id)
                        .map(coin => {
                            const currentPrice = pricesMap.get(coin.id!) || 0;
                            const previousData = previousDataPoint?.[coin.id!];
                            let previousPrice: number;

                            if (previousData && typeof previousData === "object" && "close" in previousData) {
                                previousPrice = previousData.close;
                            } else if (typeof previousData === "number") {
                                previousPrice = previousData;
                            } else {
                                previousPrice = currentPrice;
                            }

                            const priceChange = currentPrice - previousPrice;
                            const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

                            return {
                                coin,
                                currentPrice,
                                previousPrice,
                                priceChange,
                                priceChangePercent,
                            };
                        });

                    // Update reports state (this is safe as it's in a state updater function)
                    setCoinReports(reports);

                    return newHistory;
                });

                setLastUpdated(now);
            } catch (error) {
                console.error("Error fetching coin prices:", error);
                // Set error state or show user-friendly message
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        // Initial fetch
        fetchPrices();

        // Set up interval for auto-refresh
        const intervalId = window.setInterval(fetchPrices, REFRESH_INTERVAL_MS);

        return () => {
            isCancelled = true;
            window.clearInterval(intervalId);
        };
    }, [selectedCoinIds, selectedCoins]);

    const chartColors = useMemo(() => [
        "#667eea",      // Blue
        "#f59e0b",      // Amber
        "#10b981",      // Green
        "#ef4444",      // Red
        "#8b5cf6",      // Purple
        "#f97316",      // Orange
        "#06b6d4",      // Cyan
        "#ec4899",      // Pink
        "#84cc16",      // Lime
        "#6366f1",      // Indigo
    ], []);


    // Transform price history to recharts format
    const chartData = useMemo(() => {
        if (priceHistory.length === 0 || selectedCoins.length === 0) {
            return [];
        }

        return priceHistory.map(point => {
            const dataPoint: ChartDataPoint = {
                time: point.time
            };

            selectedCoins.forEach(coin => {
                if (coin.id && coin.symbol) {
                    const coinData = point[coin.id];
                    let price: number | undefined;

                    // Extract price from OHLC candle or use direct price
                    if (coinData && typeof coinData === "object" && "close" in coinData) {
                        price = coinData.close;
                    } else if (typeof coinData === "number") {
                        price = coinData;
                    }

                    if (price !== undefined) {
                        // Use symbol as key for the chart
                        dataPoint[coin.symbol.toUpperCase()] = price;
                    }
                }
            });

            return dataPoint;
        }).filter(point => {
            // Filter out points with no data
            return Object.keys(point).length > 1; // More than just "time"
        });
    }, [priceHistory, selectedCoins]);

    if (selectedCoinIds.length === 0) {
        return (
            <div className="Reports">
                <div className="Reports-empty">
                    <h2>No Coins Selected</h2>
                    <p>Please select coins on the Home page to view reports and charts.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="Reports">
            <div className="Reports-header">
                <h1>Coins Reports & Real-Time Chart</h1>
                <div className="Reports-meta">
                    {loading && <span className="Reports-status">Refreshing...</span>}
                    {lastUpdated && (
                        <span className="Reports-status">
                            Last updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    )}
                </div>
            </div>

            <div className="Reports-content">
                {/* Line Chart */}
                <div className="Reports-chart-section">
                    <h2>Real-Time Line Chart</h2>
                    {selectedCoinIds.length > 0 && chartData.length > 0 ? (
                        <div className="Reports-chart-container">
                            <ResponsiveContainer width="100%" height={500}>
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#1a1a1a"
                                        style={{ fontSize: '12px' }}
                                        label={{ value: 'Time', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#666', fontSize: '14px', fontWeight: '600' } }}
                                    />
                                    <YAxis
                                        stroke="#1a1a1a"
                                        style={{ fontSize: '12px' }}
                                        domain={['auto', 'auto']}
                                        label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#666', fontSize: '14px', fontWeight: '600' } }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '4px'
                                        }}
                                        formatter={(value: number | undefined) => {
                                            if (value === undefined) return '';
                                            return PriceFormatter.formatCurrency(value);
                                        }}
                                    />
                                    <Legend />
                                    {selectedCoins.map((coin, index) => {
                                        if (!coin.symbol) return null;
                                        const color = chartColors[index % chartColors.length];
                                        return (
                                            <Line
                                                key={coin.id}
                                                type="monotone"
                                                dataKey={coin.symbol.toUpperCase()}
                                                stroke={color}
                                                strokeWidth={3}
                                                dot={false}
                                                activeDot={{ r: 5 }}
                                                name={coin.name || coin.symbol.toUpperCase()}
                                            />
                                        );
                                    })}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="Reports-chart-placeholder">
                            <p>Loading chart data...</p>
                        </div>
                    )}
                </div>

                {/* Coin Reports */}
                <div className="Reports-coins-section">
                    <h2>Coins Reports</h2>
                    <div className="Reports-coins-grid">
                        {coinReports.map((report) => (
                            <div key={report.coin.id} className="Reports-coin-card">
                                <div className="Reports-coin-header">
                                    {report.coin.image && (
                                        <img src={report.coin.image} alt={report.coin.name} />
                                    )}
                                    <div>
                                        <h3>{report.coin.name}</h3>
                                        <p className="Reports-coin-symbol">{report.coin.symbol?.toUpperCase()}</p>
                                    </div>
                                </div>

                                <div className="Reports-coin-price">
                                    <span className="Reports-price-label">Current Price:</span>
                                    <span className="Reports-price-value">{PriceFormatter.formatCurrency(report.currentPrice)}</span>
                                </div>

                                <div className="Reports-coin-change">
                                    <span className="Reports-change-label">24h Change:</span>
                                    <span
                                        className="Reports-change-value"
                                        style={{
                                            color: report.priceChange >= 0 ? "#16a34a" : "#dc2626"
                                        }}
                                    >
                                        {report.priceChange >= 0 ? "+" : ""}{report.priceChangePercent.toFixed(2)}%
                                        ({PriceFormatter.formatCurrency(report.priceChange)})
                                    </span>
                                </div>

                                {report.coin.market_cap && (
                                    <div className="Reports-coin-info">
                                        <span>Market Cap:</span>
                                        <span>{PriceFormatter.formatCurrency(report.coin.market_cap)}</span>
                                    </div>
                                )}

                                {report.coin.total_volume && (
                                    <div className="Reports-coin-info">
                                        <span>Volume:</span>
                                        <span>{PriceFormatter.formatCurrency(report.coin.total_volume)}</span>
                                    </div>
                                )}

                                {report.coin.market_cap_rank && (
                                    <div className="Reports-coin-info">
                                        <span>Rank:</span>
                                        <span>#{report.coin.market_cap_rank}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
