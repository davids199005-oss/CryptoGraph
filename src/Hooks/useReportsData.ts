/**
 * Hook that fetches and refreshes price data for selected coins (CryptoCompare API),
 * builds OHLC-style history for charts, and computes per-coin report cards.
 * Refreshes every 10 seconds. Returns chart-ready data and colors.
 */
import { useEffect, useMemo, useState } from "react";
import { CoinsModel } from "../Models/coinsModel";
import { coinsService } from "../Services/CoinsService";

/** Single OHLC candle for a time point. */
type OhlcCandle = {
    open: number;
    high: number;
    low: number;
    close: number;
};

/** Raw price history point: time plus per-coin OHLC or numeric value. */
type PriceDataPoint = {
    time: string;
    timestamp?: number;
    [coinId: string]: string | number | OhlcCandle | undefined;
};

/** Flattened point for Recharts: time plus one number per coin (by symbol). */
type ChartDataPoint = {
    time: string;
    [coinName: string]: string | number;
};

/** Per-coin report row: current/previous price and change for the Reports page. */
export type CoinReport = {
    coin: CoinsModel;
    currentPrice: number;
    previousPrice: number;
    priceChange: number;
    priceChangePercent: number;
};

/** How often to refetch prices for the Reports chart (10 seconds). */
const REFRESH_INTERVAL_MS = 10 * 1000;

export type UseReportsDataResult = {
    priceHistory: PriceDataPoint[];
    coinReports: CoinReport[];
    loading: boolean;
    lastUpdated: Date | null;
    chartData: ChartDataPoint[];
    chartColors: string[];
    selectedCoins: CoinsModel[];
};

export function useReportsData(
    selectedCoinIds: string[],
    selectedCoins: CoinsModel[]
): UseReportsDataResult {
    const [priceHistory, setPriceHistory] = useState<PriceDataPoint[]>([]);
    const [coinReports, setCoinReports] = useState<CoinReport[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
                const coinsForApi = selectedCoins
                    .filter(coin => coin.id && coin.symbol)
                    .map(coin => ({ id: coin.id!, symbol: coin.symbol! }));

                if (coinsForApi.length === 0) {
                    setLoading(false);
                    return;
                }

                const pricesMap = await coinsService.getMultipleCoinsPricesBySymbols(coinsForApi);

                if (isCancelled) return;

                const now = new Date();
                const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const timestamp = Math.floor(now.getTime() / 1000);

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
                            const open = previousPrice.close;
                            const close = currentPrice;
                            const high = Math.max(open, close) * 1.002;
                            const low = Math.min(open, close) * 0.998;
                            candle = { open, high, low, close };
                        } else if (typeof previousPrice === "number") {
                            const open = previousPrice;
                            const close = currentPrice;
                            const high = Math.max(open, close) * 1.002;
                            const low = Math.min(open, close) * 0.998;
                            candle = { open, high, low, close };
                        } else {
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

                    setCoinReports(reports);

                    return newHistory;
                });

                setLastUpdated(now);
            } catch (error) {
                console.error("Error fetching coin prices:", error);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        fetchPrices();

        const intervalId = window.setInterval(fetchPrices, REFRESH_INTERVAL_MS);

        return () => {
            isCancelled = true;
            window.clearInterval(intervalId);
        };
    }, [selectedCoinIds, selectedCoins]);

    const chartColors = useMemo(() => [
        "#00f5ff",
        "#ff00aa",
        "#00ff88",
        "#ff3366",
        "#ffaa00",
        "#8b5cf6",
        "#06b6d4",
        "#ec4899",
        "#84cc16",
        "#6366f1",
    ], []);

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

                    if (coinData && typeof coinData === "object" && "close" in coinData) {
                        price = coinData.close;
                    } else if (typeof coinData === "number") {
                        price = coinData;
                    }

                    if (price !== undefined) {
                        dataPoint[coin.symbol.toUpperCase()] = price;
                    }
                }
            });

            return dataPoint;
        }).filter(point => Object.keys(point).length > 1);
    }, [priceHistory, selectedCoins]);

    return {
        priceHistory,
        coinReports,
        loading,
        lastUpdated,
        chartData,
        chartColors,
        selectedCoins,
    };
}
