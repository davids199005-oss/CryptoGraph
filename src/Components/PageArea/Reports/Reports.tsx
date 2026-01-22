import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Stack,
    alpha,
    CircularProgress,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { AppState } from "../../../Redux/AppState";
import { CoinsModel } from "../../../Models/CoinsModel";
import { coinsService } from "../../../Services/CoinsService";
import { PriceFormatter } from "../../../Utils/PriceFormatter";

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

const REFRESH_INTERVAL_MS = 1 * 1000; // 1 second

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
            <Container maxWidth="xl" sx={{ py: 8 }}>
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h4" gutterBottom>
                            No Coins Selected
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Please select coins on the Home page to view reports and charts.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', py: 4, background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.9) 0%, rgba(18, 22, 51, 0.95) 100%)' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h2" gutterBottom>
                        Coins Reports & Real-Time Chart
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {loading && (
                            <Chip
                                icon={<CircularProgress size={16} />}
                                label="Refreshing..."
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {lastUpdated && (
                            <Typography variant="body2" color="text.secondary">
                                Last updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </Typography>
                        )}
                    </Stack>
                </Box>

                {/* Line Chart */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Real-Time Line Chart
                        </Typography>
                        {selectedCoinIds.length > 0 && chartData.length > 0 ? (
                            <Box sx={{ mt: 3 }}>
                                <ResponsiveContainer width="100%" height={500}>
                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={alpha('#667eea', 0.1)} />
                                        <XAxis
                                            dataKey="time"
                                            stroke="#ffffff"
                                            style={{ fontSize: '12px' }}
                                        />
                                        <YAxis
                                            stroke="#ffffff"
                                            style={{ fontSize: '12px' }}
                                            domain={['auto', 'auto']}
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
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <CircularProgress />
                                <Typography variant="body1" sx={{ mt: 2 }}>Loading chart data...</Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Coin Reports */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Coins Reports
                    </Typography>
                    <Grid container spacing={3}>
                        {coinReports.map((report) => (
                            <Grid item xs={12} sm={6} md={4} key={report.coin.id}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                            {report.coin.image && (
                                                <Box
                                                    component="img"
                                                    src={report.coin.image}
                                                    alt={report.coin.name}
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: '50%',
                                                        border: '2px solid',
                                                        borderColor: 'primary.main',
                                                    }}
                                                />
                                            )}
                                            <Box>
                                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                                    {report.coin.name}
                                                </Typography>
                                                <Chip
                                                    label={report.coin.symbol?.toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha('#667eea', 0.2),
                                                        color: 'primary.light',
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </Box>
                                        </Stack>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Current Price
                                            </Typography>
                                            <Typography variant="h6" color="primary.light">
                                                {PriceFormatter.formatCurrency(report.currentPrice)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                24h Change
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {report.priceChange >= 0 ? (
                                                    <TrendingUp sx={{ color: 'success.main' }} />
                                                ) : (
                                                    <TrendingDown sx={{ color: 'error.main' }} />
                                                )}
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: report.priceChange >= 0 ? 'success.main' : 'error.main',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {report.priceChange >= 0 ? "+" : ""}{report.priceChangePercent.toFixed(2)}%
                                                    ({PriceFormatter.formatCurrency(report.priceChange)})
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        <Stack spacing={1}>
                                            {report.coin.market_cap && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="text.secondary">Market Cap:</Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {PriceFormatter.formatCurrency(report.coin.market_cap)}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {report.coin.total_volume && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="text.secondary">Volume:</Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {PriceFormatter.formatCurrency(report.coin.total_volume)}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {report.coin.market_cap_rank && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2" color="text.secondary">Rank:</Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        #{report.coin.market_cap_rank}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
